import { Response } from 'express';
import { ApplicationResponse, CreateApplicationBody } from '../types/applicationTypes';
import Application from '../models/Application';
import Organization from '../models/Organisation';
import type { AuthenticatedRequest } from '../middleware/auth';
import {
  getNotificationSnapshotsByApplicationIds,
  notifyApplicantAboutStatusChange,
  notifyOrganizationAboutApplication,
  type NotificationApplicationSnapshot,
} from '../services/notificationService';

type LocalizedStatus = 'Inskickad' | 'Granskas' | 'Godkänd' | 'Nekad' | 'Behöver mer info';
type UpdateableStatus = LocalizedStatus | 'pending' | 'reviewing' | 'approved' | 'rejected';

type MyApplicationResponse = {
  applicationId: string;
  animalId: string | null;
  animalName: string;
  status: LocalizedStatus;
  createdAt: Date;
  notification: NotificationApplicationSnapshot | null;
};

type OrganizationApplicationResponse = MyApplicationResponse & {
  applicantName: string;
  applicantEmail: string;
  details: {
    housingType: string;
    housingSize: number | null;
    hasAnimalExperience: boolean | null;
    hasChildren: boolean | null;
    hasAllergies: boolean | null;
    allergyDetails: string;
    motivation: string;
    gdprConsent: boolean | null;
  };
};

type PopulatedAnimal = {
  _id?: unknown;
  name?: string;
  organizationOwner?: string;
} | null;

type PopulatedApplicant = {
  _id?: unknown;
  username?: string;
  email?: string;
} | null;

type ApplicationWithOptionalAnimal = {
  id: string;
  animalId?: PopulatedAnimal | string;
  userId?: PopulatedApplicant | string;
  animalNameSnapshot?: string;
  status?: string;
  createdAt: Date;
  housingType?: string;
  housingSize?: number;
  hasAnimalExperience?: boolean;
  hasChildren?: boolean;
  hasAllergies?: boolean;
  allergyDetails?: string;
  motivation?: string;
  gdprConsent?: boolean;
  closedAt?: Date;
  anonymizedAt?: Date;
};

const normalizeBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

const normalizeNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeStatus = (status: string | undefined): LocalizedStatus => {
  if (status === 'Behöver mer info') return 'Behöver mer info';
  if (status === 'Granskas' || status === 'reviewing') return 'Granskas';
  if (status === 'Godkänd' || status === 'approved') return 'Godkänd';
  if (status === 'Nekad' || status === 'rejected') return 'Nekad';
  return 'Inskickad';
};

const isUpdateableStatus = (status: string): status is UpdateableStatus => {
  return [
    'Inskickad',
    'Granskas',
    'Godkänd',
    'Nekad',
    'Behöver mer info',
    'pending',
    'reviewing',
    'approved',
    'rejected',
  ].includes(status);
};

const isClosedStatus = (status: string): boolean => {
  return ['Godkänd', 'Nekad', 'approved', 'rejected'].includes(status);
};

const resolveAnimalName = (application: ApplicationWithOptionalAnimal): string => {
  const animal = application.animalId;
  if (animal && typeof animal === 'object' && typeof animal.name === 'string') {
    const name = animal.name.trim();
    if (name) return name;
  }
  const fallbackName = application.animalNameSnapshot?.trim();
  if (fallbackName) return fallbackName;
  return 'Okänt djur';
};

const resolveAnimalId = (application: ApplicationWithOptionalAnimal): string | null => {
  const animal = application.animalId;
  if (typeof animal === 'string') return animal;
  if (animal && typeof animal === 'object' && animal._id) return String(animal._id);
  return null;
};

const resolveApplicantName = (application: ApplicationWithOptionalAnimal): string => {
  const applicant = application.userId;
  if (applicant && typeof applicant === 'object' && typeof applicant.username === 'string') {
    const username = applicant.username.trim();
    if (username) return username;
  }
  if (applicant && typeof applicant === 'object' && typeof applicant.email === 'string') {
    const email = applicant.email.trim();
    if (email) return email;
  }
  return 'Okänd adoptör';
};

const resolveApplicantEmail = (application: ApplicationWithOptionalAnimal): string => {
  const applicant = application.userId;
  if (applicant && typeof applicant === 'object' && typeof applicant.email === 'string') {
    return applicant.email.trim();
  }
  return '';
};

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const applications = await Application.find({
      userId,
      anonymizedAt: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'animalId', select: 'name' });

    const formattedApplications: Omit<MyApplicationResponse, 'notification'>[] = applications.map(
      (application) => {
        const app = application as unknown as ApplicationWithOptionalAnimal;
        return {
          applicationId: app.id,
          animalId: resolveAnimalId(app),
          animalName: resolveAnimalName(app),
          status: normalizeStatus(app.status),
          createdAt: app.createdAt,
        };
      },
    );

    const notificationSnapshots = await getNotificationSnapshotsByApplicationIds(
      userId,
      'application-status-updated',
      formattedApplications.map((application) => application.applicationId),
    );

    const applicationsWithNotifications: MyApplicationResponse[] = formattedApplications.map(
      (application) => ({
        ...application,
        notification: notificationSnapshots.get(application.applicationId) ?? null,
      }),
    );

    res.status(200).json({ applications: applicationsWithNotifications });
  } catch {
    res.status(500).json({ message: 'Kunde inte hämta ansökningar' });
  }
};

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const body = req.body as CreateApplicationBody;
    const animalId = body.animalId;

    if (animalId) {
      const existing = await Application.findOne({ userId, animalId });
      if (existing) {
        res.status(409).json({ message: 'Du har redan ansökt om detta djur' });
        return;
      }
    }

    const application = await Application.create({ ...body, userId });
    void notifyOrganizationAboutApplication(
      application as unknown as {
        id: string;
        userId: unknown;
        animalId: unknown;
        status?: string;
        animalNameSnapshot?: string;
      },
    );
    res.status(201).json(application as ApplicationResponse);
  } catch {
    res.status(500).json({ message: 'Ansökan kunde inte skickas' });
  }
};

export const getOrganizationApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const organization = await Organization.findById(userId).select('organization');

    if (!organization?.organization) {
      res.status(403).json({ message: 'Endast organisationer kan hämta dessa ansökningar' });
      return;
    }

    const applications = await Application.find({
      anonymizedAt: { $exists: false },
    })
      .select(
        'animalId userId animalNameSnapshot status createdAt housingType housingSize hasAnimalExperience hasChildren hasAllergies allergyDetails motivation gdprConsent',
      )
      .sort({ createdAt: -1 })
      .populate({
        path: 'animalId',
        select: 'name organizationOwner',
        match: { organizationOwner: organization.organization },
      })
      .populate({ path: 'userId', select: 'username email' });

    const formattedApplications: Omit<OrganizationApplicationResponse, 'notification'>[] =
      applications
        .map((application) => application as unknown as ApplicationWithOptionalAnimal)
        .filter((application) => !!application.animalId && typeof application.animalId === 'object')
        .map((application) => ({
          applicationId: application.id,
          applicantName: resolveApplicantName(application),
          applicantEmail: resolveApplicantEmail(application),
          animalId: resolveAnimalId(application),
          animalName: resolveAnimalName(application),
          status: normalizeStatus(application.status),
          createdAt: application.createdAt,
          details: {
            housingType: application.housingType || '',
            housingSize: normalizeNumber(application.housingSize),
            hasAnimalExperience: normalizeBoolean(application.hasAnimalExperience),
            hasChildren: normalizeBoolean(application.hasChildren),
            hasAllergies: normalizeBoolean(application.hasAllergies),
            allergyDetails: application.allergyDetails || '',
            motivation: application.motivation || '',
            gdprConsent: normalizeBoolean(application.gdprConsent),
          },
        }));

    const notificationSnapshots = await getNotificationSnapshotsByApplicationIds(
      userId,
      'application-created',
      formattedApplications.map((application) => application.applicationId),
    );

    const applicationsWithNotifications: OrganizationApplicationResponse[] =
      formattedApplications.map((application) => ({
        ...application,
        notification: notificationSnapshots.get(application.applicationId) ?? null,
      }));

    res.status(200).json({ applications: applicationsWithNotifications });
  } catch {
    res.status(500).json({ message: 'Kunde inte hämta ansökningar' });
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const organization = await Organization.findById(userId).select('organization');

    if (!organization?.organization) {
      res.status(403).json({ message: 'Endast organisationer kan uppdatera ansökningar' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body as { status?: string };

    if (!status || !isUpdateableStatus(status)) {
      res.status(400).json({ message: 'Ogiltig status' });
      return;
    }

    const application = await Application.findById(id).populate({
      path: 'animalId',
      select: 'organizationOwner name',
    });

    if (!application) {
      res.status(404).json({ message: 'Ansökan hittades inte' });
      return;
    }

    const previousStatus = normalizeStatus(application.status);
    const populatedAnimal = application.animalId as PopulatedAnimal;
    if (
      !populatedAnimal ||
      typeof populatedAnimal !== 'object' ||
      populatedAnimal.organizationOwner !== organization.organization
    ) {
      res.status(403).json({ message: 'Du kan inte uppdatera denna ansökan' });
      return;
    }

    application.status = status;
    if (isClosedStatus(status)) {
      application.closedAt = application.closedAt ?? new Date();
    } else {
      application.closedAt = undefined;
    }
    await application.save();

    const nextStatus = normalizeStatus(application.status);
    if (previousStatus !== nextStatus) {
      void notifyApplicantAboutStatusChange(
        application as unknown as {
          id: string;
          userId: unknown;
          animalId: unknown;
          status?: string;
          animalNameSnapshot?: string;
        },
        previousStatus,
      );
    }

    res.status(200).json({
      applicationId: application.id,
      status: normalizeStatus(application.status),
    });
  } catch {
    res.status(500).json({ message: 'Kunde inte uppdatera ansökan' });
  }
};

export const getOrganisationContact = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const application = await Application.findOne({
      _id: req.params.id,
      userId,
      anonymizedAt: { $exists: false },
      status: { $in: ['Godkänd', 'approved'] },
    }).populate({ path: 'animalId', select: 'organizationOwner' });

    if (!application) {
      res.status(404).json({ message: 'Ansökan hittades inte eller är inte godkänd' });
      return;
    }

    const animal = application.animalId as PopulatedAnimal;
    const orgName = animal?.organizationOwner;

    if (!orgName) {
      res.status(404).json({ message: 'Kunde inte hitta organisation' });
      return;
    }

    const organisation = await Organization.findOne({ organization: orgName }).select(
      'email organization',
    );

    if (!organisation) {
      res.status(404).json({ message: 'Organisation hittades inte' });
      return;
    }

    res.status(200).json({
      name: organisation.organization,
      email: organisation.email,
    });
  } catch {
    res.status(500).json({ message: 'Något gick fel' });
  }
};
