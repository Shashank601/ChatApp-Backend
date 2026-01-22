import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id; // extracted from JWT in auth middleware
    const user = await userService.getMe(userId);
    res.status(200).json(user);
});




export const searchUsersController = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const users = await userService.searchUsers(q, req.user.id);
  res.status(200).json(users);
});

