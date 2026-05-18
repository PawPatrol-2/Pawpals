import { Response } from 'express';
import User from '../models/User';
import Organization from '../models/Organisation';
import { AuthenticatedRequest } from '../middleware/auth';
import { handleControllerError } from './controllerError';

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Saknar giltig token' });
    }

    const user = await User.findById(userId).select('email username role');
    if (user) {
      return res.status(200).json({
        user: {
          id: user._id.toString(),
          email: user.email,
          fullname: user.username,
          role: user.role,
        },
      });
    }

    const organization = await Organization.findById(userId).select('email organization role');
    if (organization) {
      return res.status(200).json({
        user: {
          id: organization._id.toString(),
          email: organization.email,
          username: organization.organization,
          organisationsnamn: organization.organization,
          role: organization.role,
        },
      });
    }

    return res.status(404).json({ message: 'Användare hittades inte' });
  } catch (error: unknown) {
    return handleControllerError(res, error, 'Något gick fel');
  }
};

export const updateUserPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Saknar giltig token' });
    }

    const {
      preferredAnimalType,
      preferredMaxAge,
      preferredPersonality,
      housingType,
      preferredChildFriendly,
    } = req.body;

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
      return res.status(404).json({ message: 'Användare hittades inte' });
    }

    return res.status(200).json({ message: 'Preferenser sparade!', preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Något gick fel', error });
  }
};
