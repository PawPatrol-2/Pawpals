import express from 'express';
import { getCurrentUser, login, registerUser, createAdminUser, deleteUser, getAllUsers } from '../controllers/userController';
import authenticate from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { registerSchema, loginSchema } from '../schemas/userSchemas';
import { validateRequest } from '../middleware/validate';


const router = express.Router();



router.post('/create-admin', createAdminUser);
router.post('/register', validateRequest({ body: registerSchema}), registerUser)
router.post('/login', validateRequest({ body: loginSchema}), login);
router.get('/me', authenticate, getCurrentUser)
router.get("/", requireAdmin, getAllUsers);

router.delete("/:id", requireAdmin, deleteUser)



export default router;
