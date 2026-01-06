import express from 'express';
import {
  getLogin,
  handleLoginValidator,
  postLogin,
} from '../controllers/loginController.js';
import redirectIfAuthenticated from '../middleware/redirectIfAuthenticated.js';
import loginValidator from '../validators/loginValidator.js';

const loginRouter = express.Router();

loginRouter.get('/', redirectIfAuthenticated, getLogin);
loginRouter.post('/', loginValidator, handleLoginValidator, postLogin);

export default loginRouter;
