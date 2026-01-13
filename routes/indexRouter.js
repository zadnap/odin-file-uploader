import express from 'express';
import { getMyDocuments } from '../controllers/indexController.js';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.redirect('/documents');
});

indexRouter.get(
  '/documents',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }
    next();
  },
  getMyDocuments
);

export default indexRouter;
