import express from 'express';
import { getRegister } from '../controllers/registerController.js';

const registerRouter = express.Router();

registerRouter.get('/', getRegister);

export default registerRouter;
