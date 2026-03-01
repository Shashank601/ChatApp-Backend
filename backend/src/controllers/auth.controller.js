import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { IS_PROD } from '../config/env.js';

/**
 * POST /register
 */
export const registerController = asyncHandler(async (req, res) => {
    // console.log('URL:', req.originalUrl);
    // console.log('METHOD:', req.method);
    // console.log('HEADERS:', req.headers['content-type']);
    // console.log('BODY:', req.body);

    const { username, email, password } = req.body;
    const user = await authService.register({ username, email, password });
    res.status(201).json(user);
});




/**
 * POST /login
 */
export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });

    // Optional cookie
    res.cookie('token', data.token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: IS_PROD ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60
    });

    res.json(data);
});





/**
 * POST /logout
 */
export const logoutController = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
});

//[cookie options] In auth.controller.js the cookie is httpOnly but missing secure/sameSite. Fine for local dev, but you’ll want:
// secure: true in prod (https)
// sameSite: 'none' if cross-site frontends
