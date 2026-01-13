import { prisma } from '../lib/prisma.js';
import { upload } from '../config/multer.js';
import { getUniqueFileName } from '../lib/fileName.js';

const uploadSingleFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).render('error', {
        title: 'Upload File Failed',
        errorMessages: [err.message],
      });
    }
    next();
  });
};

const postFile = async (req, res) => {
  try {
    const { parentId } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).render('error', {
        title: 'Upload File Failed',
        errorMessages: ['No file uploaded'],
      });
    }

    const file = req.file;

    const uniqueName = await getUniqueFileName({
      originalName: file.originalname,
      userId,
      folderId: parentId || null,
    });

    await prisma.file.create({
      data: {
        name: uniqueName,
        size: file.size,
        mimeType: file.mimetype,
        path: file.path,
        userId,
        folderId: parentId || null,
      },
    });

    res.redirect(parentId ? `/folders/${parentId}` : '/documents');
  } catch {
    res.status(500).render('error', {
      title: 'Upload File Failed',
      errorMessages: ['Please try again'],
    });
  }
};

const downloadFile = async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) {
    return res.status(404).render('error', {
      title: 'Download File Failed',
      errorMessages: ['File does not exist'],
    });
  }

  res.download(file.path, file.name);
};

export { uploadSingleFile, postFile, downloadFile };
