import express from 'express';
import {
  deleteFile,
  downloadFile,
  postFile,
  uploadSingleFile,
} from '../controllers/fileController.js';

const fileRouter = express.Router();

fileRouter.post('/', uploadSingleFile, postFile);
fileRouter.get('/:id/download', downloadFile);
fileRouter.post('/:id/delete', deleteFile);

export default fileRouter;
