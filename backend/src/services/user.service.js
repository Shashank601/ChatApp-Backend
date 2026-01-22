
import User from '../models/User.model.js';

/**
 * Get current user profile
 * @param {string} userId - extracted from JWT
 * @returns {Promise<Object>} - { id, username, email }
 */
export async function getMe(userId) {
  const user = await User.findById(userId).lean(); // lean() returns plain object we basically removed mongoose obj means no overhead

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };
}

;

export async function searchUsers(query, currentUserId) {
  if (!query) {
    const err = new Error('Search query is required');
    err.statusCode = 400;
    throw err;
  }

  return User.find({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }).select('_id username email');
};



