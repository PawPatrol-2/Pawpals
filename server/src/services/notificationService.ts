import { Types } from "mongoose";
import Notification, { NotificationType } from "../models/Notification";
import Organization from "../models/Organisation";
import { Animal } from "../models/animal";

const resolveId = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (value && typeof value === "object") {
    const objectValue = value as { _id?: unknown; id?: unknown };
    if (typeof objectValue._id === "string") {
      return objectValue._id;
    }
    if (objectValue._id instanceof Types.ObjectId) {
      return objectValue._id.toString();
    }
    if (typeof objectValue.id === "string") {
      return objectValue.id;
    }
  }

  return null;
};

const resolveText = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
};

const resolveOrganizationRecipientId = async (
  organizationName: string,
): Promise<string | null> => {
  const organization = await Organization.findOne({
    organization: organizationName,
  })
    .select("_id")
    .lean();

  if (!organization?._id) {
    return null;
  }

  return String(organization._id);
};

const upsertNotification = async (params: {
  recipientUserId: string;
  type: NotificationType;
  applicationId: string;
  title: string;
  message: string;
  targetUrl: string;
}) => {
  const notification = await Notification.findOneAndUpdate(
    {
      recipientUserId: params.recipientUserId,
      type: params.type,
      applicationId: params.applicationId,
    },
    {
      recipientUserId: params.recipientUserId,
      type: params.type,
      applicationId: params.applicationId,
      title: params.title,
      message: params.message,
      targetUrl: params.targetUrl,
      readAt: null,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  return notification;
};

type ApplicationLike = {
  id?: string;
  _id?: unknown;
  userId?: unknown;
  animalId?: unknown;
  status?: string;
  animalNameSnapshot?: string;
};

export const notifyOrganizationAboutApplication = async (
  application: ApplicationLike,
) => {
  const animalId = resolveId(application.animalId);
  if (!animalId) {
    return null;
  }

  const animal = await Animal.findById(animalId)
    .select("name organizationOwner")
    .lean();

  if (!animal?.organizationOwner) {
    return null;
  }

  const recipientUserId = await resolveOrganizationRecipientId(
    animal.organizationOwner,
  );
  if (!recipientUserId) {
    return null;
  }

  const applicationId = application.id ?? resolveId(application._id);
  if (!applicationId) {
    return null;
  }

  const title = "Ny ansökan";
  const message = `Du har fått en ny ansökan för ${resolveText(animal.name, "ett djur")}.`;

  return upsertNotification({
    recipientUserId,
    type: "application-created",
    applicationId,
    title,
    message,
    targetUrl: "/organisation-dashboard",
  });
};

export const notifyApplicantAboutStatusChange = async (
  application: ApplicationLike,
) => {
  const recipientUserId = resolveId(application.userId);
  if (!recipientUserId) {
    return null;
  }

  const applicationId = application.id ?? resolveId(application._id);
  if (!applicationId) {
    return null;
  }

  const animalId = resolveId(application.animalId);
  let animalName = resolveText(application.animalNameSnapshot, "ditt djur");

  if (animalId) {
    const animal = await Animal.findById(animalId).select("name").lean();
    if (animal?.name) {
      animalName = animal.name.trim() || animalName;
    }
  }

  const title = "Ansökan uppdaterad";
  const message = `Statusen för din ansökan om ${animalName} har ändrats.`;

  return upsertNotification({
    recipientUserId,
    type: "application-status-updated",
    applicationId,
    title,
    message,
    targetUrl: "/mina-ansokningar",
  });
};

export const getNotificationSummary = async (recipientUserId: string) => {
  const counts = await Notification.aggregate<{
    _id: NotificationType;
    count: number;
  }>([
    { $match: { recipientUserId, readAt: null } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const summary = counts.reduce(
    (accumulator, item) => {
      if (item._id === "application-created") {
        accumulator.applicationCreated = item.count;
      }
      if (item._id === "application-status-updated") {
        accumulator.applicationStatusUpdated = item.count;
      }
      accumulator.total += item.count;
      return accumulator;
    },
    {
      applicationCreated: 0,
      applicationStatusUpdated: 0,
      total: 0,
    },
  );

  return summary;
};

export const markNotificationsAsRead = async (
  recipientUserId: string,
  type?: NotificationType,
) => {
  const filter: {
    recipientUserId: string;
    type?: NotificationType;
    readAt: null;
  } = {
    recipientUserId,
    readAt: null,
  };

  if (type) {
    filter.type = type;
  }

  const result = await Notification.updateMany(filter, {
    $set: { readAt: new Date() },
  });

  return result.modifiedCount ?? 0;
};
