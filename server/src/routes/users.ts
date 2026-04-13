import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/userController';
import { registerUser } from '../controllers/userController'
import validateRegister from '../middleware/validateRegister';


router.post('/login', loginUser)
router.post('/register', validateRegister, registerUser)



export default router;
