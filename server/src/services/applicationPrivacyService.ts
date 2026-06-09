import { randomUUID } from "node:crypto";
import { Types } from "mongoose";
import type { QueryFilter } from "mongoose";
import Application from "../models/Application";
import type { IApplication } from "../models/Application";
import Notification from "../models/Notification";
import logger from "../utils/logger";
import {
  encryptSensitiveValue,
  isEncryptedValue,
} from "./fieldEncryption";

export const APPLICATION_RETENTION_MONTHS = 12;
const MAINTENANCE_INTERVAL_MS = 24 * 60 * 60 * 1000;

type AnonymizationReason = "retention-expired" | "account-deleted";

const getRetentionCutoff = (): Date => {
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - APPLICATION_RETENTION_MONTHS);
  return cutoff;
};

const anonymizeApplications = async (
  filter: QueryFilter<IApplication>,
  reason: AnonymizationReason,
): Promise<number> => {
  const applications = await Application.find(filter).select("_id").lean();
  if (applications.length === 0) {
    return 0;
  }

  const applicationIds = applications.map((application) =>
    String(application._id),
  );

  await Application.bulkWrite(
    applications.map((application) => ({
      updateOne: {
        filter: { _id: application._id },
        update: {
          $set: {
            anonymousApplicantId: randomUUID(),
            anonymizedAt: new Date(),
            anonymizationReason: reason,
          },
          $unset: {
            userId: "",
            housingType: "",
            housingSize: "",
            hasAnimalExperience: "",
            hasChildren: "",
            hasAllergies: "",
            allergyDetails: "",
            motivation: "",
          },
        },
      },
    })),
  );

  await Notification.deleteMany({
    applicationId: { $in: applicationIds },
  });

  return applications.length;
};

export const anonymizeApplicationsForUser = async (
  userId: string,
): Promise<number> => {
  return anonymizeApplications(
    {
      userId: new Types.ObjectId(userId),
      anonymizedAt: { $exists: false },
    },
    "account-deleted",
  );
};

export const anonymizeExpiredApplications = async (): Promise<number> => {
  const cutoff = getRetentionCutoff();

  return anonymizeApplications(
    {
      status: { $in: ["approved", "rejected", "Godkänd", "Nekad"] },
      anonymizedAt: { $exists: false },
      $or: [
        { closedAt: { $lte: cutoff } },
        {
          closedAt: { $exists: false },
          createdAt: { $lte: cutoff },
        },
      ],
    },
    "retention-expired",
  );
};

export const encryptLegacyApplicationData = async (): Promise<number> => {
  const legacyApplications = await Application.collection
    .find({
      anonymizedAt: { $exists: false },
      $or: [
        {
          motivation: {
            $type: "string",
            $ne: "",
            $not: /^enc:v1:/,
          },
        },
        {
          allergyDetails: {
            $type: "string",
            $ne: "",
            $not: /^enc:v1:/,
          },
        },
      ],
    })
    .project<{
      _id: Types.ObjectId;
      motivation?: string;
      allergyDetails?: string;
    }>({
      motivation: 1,
      allergyDetails: 1,
    })
    .toArray();

  if (legacyApplications.length === 0) {
    return 0;
  }

  await Application.collection.bulkWrite(
    legacyApplications.map((application) => {
      const protectedFields: Record<string, string> = {};

      if (
        application.motivation &&
        !isEncryptedValue(application.motivation)
      ) {
        protectedFields.motivation = encryptSensitiveValue(
          application.motivation,
        );
      }

      if (
        application.allergyDetails &&
        !isEncryptedValue(application.allergyDetails)
      ) {
        protectedFields.allergyDetails = encryptSensitiveValue(
          application.allergyDetails,
        );
      }

      return {
        updateOne: {
          filter: { _id: application._id },
          update: { $set: protectedFields },
        },
      };
    }),
  );

  return legacyApplications.length;
};

let maintenanceRunning = false;

export const runPrivacyMaintenance = async (): Promise<void> => {
  if (maintenanceRunning) {
    return;
  }

  maintenanceRunning = true;
  try {
    const encryptedCount = await encryptLegacyApplicationData();
    const anonymizedCount = await anonymizeExpiredApplications();

    logger.info(
      { encryptedCount, anonymizedCount },
      "Privacy maintenance completed",
    );
  } catch {
    logger.error("Privacy maintenance failed");
  } finally {
    maintenanceRunning = false;
  }
};

export const startPrivacyMaintenance = (): NodeJS.Timeout => {
  void runPrivacyMaintenance();

  const timer = setInterval(() => {
    void runPrivacyMaintenance();
  }, MAINTENANCE_INTERVAL_MS);

  timer.unref();
  return timer;
};
