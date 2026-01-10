import { validationResult, matchedData } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const getLogin = async (req, res) => {
  res.render('login', { oldData: {}, errors: {} });
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

const handleLoginValidator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      oldData: { username: req.body.username },
      errors: errors.mapped(),
    });
  }
  next();
};

const postLogin = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render('login', {
        oldData: { username: req.body.username },
        errors: {
          auth: {
            msg: info?.message,
          },
        },
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};

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

const postLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  });
};

export {
  redirectIfAuthenticated,
  getLogin,
  handleLoginValidator,
  postLogin,
  getRegister,
  handleRegisterValidator,
  postRegister,
  postLogout,
};
