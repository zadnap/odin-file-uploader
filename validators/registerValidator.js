import { body } from 'express-validator';
import { prisma } from '../lib/prisma.js';

const registerValidator = [
  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('Display name is required')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Display name must be under 50 characters'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 5, max: 20 })
    .withMessage('Username must be between 5 and 20 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .bail()
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (user) {
        throw new Error('Username already exists');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export default registerValidator;
