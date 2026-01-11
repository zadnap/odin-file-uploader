import express from 'express';
import { getFolderById } from '../controllers/folderController.js';

const folderRouter = express.Router();

folderRouter.get('/:id', getFolderById);

export default folderRouter;
