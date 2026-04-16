import express from 'express';
const router = express.Router();
import { getCurrentUser, login, registerUser } from '../controllers/userController';
import validateRegister from '../middleware/validateRegister';
import authenticate from '../middleware/auth';


router.post('/login', login);
router.post('/register', validateRegister, registerUser)
router.get('/me', authenticate, getCurrentUser)



export default router;
