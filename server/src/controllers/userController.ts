import { Response } from 'express';
import User from '../models/User';
import Organization from '../models/Organisation';
import { AuthenticatedRequest } from '../middleware/auth';
import { handleControllerError } from './controllerError';
import type { UserPreferences, UserResponse, OrganisationResponse } from '../types/user';
import logger from '../utils/logger'

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response<{ user: UserResponse | OrganisationResponse } | { message: string }>) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      logger.warn('getCurrentUser called without valid token')
      return res.status(401).json({ message: 'Saknar giltig token' });
    }

    const user = await User.findById(userId).select('email username role preferences');
    if (user) {
      console.log('DEBUG: reached user found block')
      logger.info({ userId }, 'User fetched successfully')
      return res.status(200).json({
        user: {
          id: user._id.toString(),
          email: user.email,
          fullname: user.username,
          role: user.role,
          preferences: user.preferences,
        },
      });
    }

    const organization = await Organization.findById(userId).select('email organization role');
    if (organization) {
      logger.info({ userId }, 'Organisation fetched successfully')
      return res.status(200).json({
        user: {
          id: organization._id.toString(),
          email: organization.email,
          username: organization.organization,
          organisationsnamn: organization.organization,
          role: organization.role as 'adopter' | 'organization' | 'admin',
        },
      });
    }
    logger.warn({ userId }, 'getCurrentUser: user not found')
    return res.status(404).json({ message: 'Användare hittades inte' });
  } catch (error: unknown) {
    return handleControllerError(res, error, 'Något gick fel');
  }
};

export const updateUserPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      logger.warn('updateUserPreferences called without valid token')
      return res.status(401).json({ message: 'Saknar giltig token' });
    }

    const {
      preferredAnimalType,
      preferredMaxAge,
      preferredPersonality,
      housingType,
      preferredChildFriendly,
    } = req.body as UserPreferences;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        preferences: {
          preferredAnimalType,
          preferredMaxAge,
          preferredPersonality,
          housingType,
          preferredChildFriendly,
        },
      },
      { new: true },
    ).select('preferences');

    if (!user) {
      logger.warn({ userId }, 'updatePreferences: user not found')
      return res.status(404).json({ message: 'Användare hittades inte' });
    }
    logger.info({ userId }, 'User preferences updated')
    return res.status(200).json({ message: 'Preferenser sparade!', preferences: user.preferences });
  } catch (error) {
    logger.error({ err: error}, 'updateUserPreferences failed')
    res.status(500).json({ message: 'Något gick fel', error });
  }
};
