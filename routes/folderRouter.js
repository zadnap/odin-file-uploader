import express from 'express';
import {
  deleteFolder,
  getFolderById,
  handleFolderValidator,
  postFolder,
} from '../controllers/folderController.js';
import folderValidator from '../validators/folderValidator.js';

const folderRouter = express.Router();

folderRouter.get('/:id', getFolderById);
folderRouter.post('/', folderValidator, handleFolderValidator, postFolder);
folderRouter.post('/:id/delete', deleteFolder);

export default folderRouter;
