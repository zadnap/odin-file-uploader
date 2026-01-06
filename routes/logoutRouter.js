import express from 'express';
import { postLogout } from '../controllers/logoutController.js';

const logoutRouter = express.Router();

logoutRouter.post('/', postLogout);

export default logoutRouter;
