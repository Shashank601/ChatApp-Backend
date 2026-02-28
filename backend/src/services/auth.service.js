import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import bcrypt from 'bcryptjs';


export async function register({ username, email, password }) {
    if (!username || !email || !password) {
        const err = new Error('username, email and password are required');
        err.statusCode = 400;
        throw err;
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail || existingUsername) {
        const err = new Error('Email or Username already registered');
        err.statusCode = 409;
        throw err;
    }

    const user = await User.create({ username, email, password });

    const token = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
}




export async function login({ email, password }) {
    if (!email || !password) {
        const err = new Error('email and password are required');
        err.statusCode = 400;
        throw err;
    }

    // 1. fetching user by email
    const user = await User.findOne({ email });
    if (!user) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    // 2. copare hashed pwd
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    // 3. create jwt 
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // 4. return token with user data
    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
}






/**
 * Logs out the user.
 * Note: Stateless JWT → server does nothing; controller deletes cookie.
 */
async function logoutUser() {
    // No need, its controller layer job
}
