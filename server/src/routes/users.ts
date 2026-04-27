import express from 'express';
import { getCurrentUser, login, registerUser, createAdminUser, deleteUser, getAllUsers } from '../controllers/userController';
import validateRegister from '../middleware/validateRegister';
import authenticate from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = express.Router();



router.post('/create-admin', createAdminUser);
router.post('/login', login);
router.post('/register', validateRegister, registerUser)
router.get('/me', authenticate, getCurrentUser)
router.get("/", requireAdmin, getAllUsers);

router.delete("/:id", requireAdmin, deleteUser)



export default router;
