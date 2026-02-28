import express from 'express';
import { sendMessageController, deleteMessageController } from '../controllers/message.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, sendMessageController);
router.delete('/:id', verifyToken, deleteMessageController);

export default router;
