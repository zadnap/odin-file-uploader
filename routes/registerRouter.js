import express from 'express';
import {
  getRegister,
  handleRegisterValidator,
  postRegister,
} from '../controllers/registerController.js';
import redirectIfAuthenticated from '../middleware/redirectIfAuthenticated.js';
import registerValidator from '../validators/registerValidator.js';

const registerRouter = express.Router();

registerRouter.get('/', redirectIfAuthenticated, getRegister);
registerRouter.post(
  '/',
  registerValidator,
  handleRegisterValidator,
  postRegister
);

export default registerRouter;
