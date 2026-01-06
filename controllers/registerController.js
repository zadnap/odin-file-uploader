import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const getRegister = async (req, res) => {
  res.render('register', { oldData: {}, errors: {} });
};

const handleRegisterValidator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      oldData: req.body,
      errors: errors.mapped(),
    });
  }
  next();
};

const postRegister = async (req, res, next) => {
  try {
    const { displayName, username, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        displayName,
        username,
        password: hashedPassword,
      },
    });

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
};

export { getRegister, handleRegisterValidator, postRegister };
