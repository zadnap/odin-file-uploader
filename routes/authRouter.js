import express from 'express';
import {
  getLogin,
  getRegister,
  handleLoginValidator,
  handleRegisterValidator,
  postLogin,
  postLogout,
  postRegister,
  redirectIfAuthenticated,
} from '../controllers/authController.js';
import registerValidator from '../validators/registerValidator.js';
import loginValidator from '../validators/loginValidator.js';

const authRouter = express.Router();

authRouter.get('/register', redirectIfAuthenticated, getRegister);
authRouter.post(
  '/register',
  registerValidator,
  handleRegisterValidator,
  postRegister
);

authRouter.get('/login', redirectIfAuthenticated, getLogin);
authRouter.post('/login', loginValidator, handleLoginValidator, postLogin);

authRouter.post('/logout', postLogout);

export default authRouter;
