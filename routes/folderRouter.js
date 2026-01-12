import express from 'express';
import {
  getFolderById,
  handleFolderValidator,
  postFolder,
} from '../controllers/folderController.js';
import folderValidator from '../validators/folderValidator.js';

const folderRouter = express.Router();

folderRouter.get('/:id', getFolderById);
folderRouter.post('/', folderValidator, handleFolderValidator, postFolder);

export default folderRouter;
