import express from 'express';
import {
  downloadFile,
  postFile,
  uploadSingleFile,
} from '../controllers/fileController.js';

const fileRouter = express.Router();

fileRouter.post('/', uploadSingleFile, postFile);
fileRouter.get('/:id/download', downloadFile);

export default fileRouter;
