import { Response } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

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
