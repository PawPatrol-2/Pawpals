import express from 'express';
import { registerOrganization } from '../controllers/organisationController';
import { loginUser } from '../controllers/loginController';
import authenticate from '../middleware/auth';
import { getCurrentUser } from '../controllers/userController';
import { loginSchema } from '../schemas/userSchemas';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/register', registerOrganization);
router.post('/login', validateRequest({ body: loginSchema }), loginUser);
router.get('/me', authenticate, getCurrentUser);

export default router;
