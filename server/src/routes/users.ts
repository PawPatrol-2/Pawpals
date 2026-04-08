import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/userController';
import { registerUser } from '../controllers/userController'


router.post('/login', loginUser)
router.post('/register', registerUser)



export default router;
