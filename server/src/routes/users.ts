import express from 'express';
import { registerUser } from '../controllers/registerController';
import { loginUser } from '../controllers/loginController';
import { getCurrentUser, updateUserPreferences } from '../controllers/userController';
import { createAdminUser, deleteUser, getAllUsers } from '../controllers/adminUserController';
import authenticate from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { registerSchema, loginSchema, preferencesSchema } from '../schemas/userSchemas';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/create-admin', createAdminUser);
router.post('/register', validateRequest({ body: registerSchema }), registerUser);
router.post('/login', validateRequest({ body: loginSchema }), loginUser);
router.get('/me', authenticate, getCurrentUser);
router.get('/', requireAdmin, getAllUsers);
router.delete('/:id', requireAdmin, deleteUser);
router.put(
  '/preferences',
  authenticate,
  validateRequest({ body: preferencesSchema }),
  updateUserPreferences,
);

export default router;
