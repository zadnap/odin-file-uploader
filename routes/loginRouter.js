import express from 'express';
import { getLogin } from '../controllers/loginController.js';

const loginRouter = express.Router();

loginRouter.get('/', getLogin);

export default loginRouter;
