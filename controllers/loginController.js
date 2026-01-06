import { validationResult } from 'express-validator';
import passport from 'passport';

const getLogin = async (req, res) => {
  res.render('login', { oldData: {}, errors: {} });
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

export { getLogin, handleLoginValidator, postLogin };
