import express from 'express';
import { getIndex } from '../controllers/indexController.js';

const indexRouter = express.Router();

indexRouter.get(
  '/',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }
    next();
  },
  getIndex
);

export default indexRouter;
