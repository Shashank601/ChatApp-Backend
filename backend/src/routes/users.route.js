import express from 'express';
import { searchUsersController, getMe } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js'; // assumes you have auth middleware

const router = express.Router();

router.get('/me', verifyToken, getMe);

router.get('/search', verifyToken, searchUsersController);

export default router;