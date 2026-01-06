import express from 'express';
import { getIndex } from '../controllers/indexController.js';

const indexRouter = express.Router();

indexRouter.get('/', getIndex);

export default indexRouter;
