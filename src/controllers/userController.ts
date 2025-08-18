import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

// Interface for user data
interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

// Interface for JWT payload
interface JWTPayload {
  id: string;
  email: string;
}

// Register user function
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        created_at: newUser.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Login user function
export const loginUser = async (req: Request, res: Response) => {
  console.log('🔍 LOGIN ENDPOINT CALLED');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    const { email, password } = req.body;
    console.log('📧 Email:', email);
    console.log('🔑 Password provided:', !!password);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    console.log('🔍 Looking up user in database...');
    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('📊 Database query result:', userResult.rows.length, 'users found');

    if (userResult.rows.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const user: User = userResult.rows[0];
    console.log('✅ User found:', user.id);

    // Compare password
    console.log('🔐 Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      console.log('❌ Password invalid');
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    console.log('✅ Password valid, creating JWT...');
    // Create JWT payload
    const payload: JWTPayload = {
      id: user.id,
      email: user.email
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '8h'
    });

    console.log('✅ JWT created, sending response...');
    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Protected route example - get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // The user data is already attached to req.user by the auth middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Get user data from database
    const userResult = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get current user's profile (protected route)
export const getMe = async (req: Request, res: Response) => {
  try {
    // The user data is already attached to req.user by the auth middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Get user data from database
    const userResult = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.status(200).json({
      message: 'Current user profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}; 