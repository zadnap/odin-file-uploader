import { prisma } from '../lib/prisma.js';
import { upload } from '../config/multer.js';
import { getUniqueFileName } from '../lib/docName.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

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

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `odin-file-uploader/${userId}`,
          resource_type: 'auto',
          public_id: uniqueName,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    await prisma.file.create({
      data: {
        name: uniqueName,
        size: file.size,
        mimeType: file.mimetype,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
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
  try {
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

    const response = await fetch(file.url);

    if (!response.ok || !response.body) {
      return res.status(500).render('error', {
        title: 'Download File Failed',
        errorMessages: ['Failed to fetch file from storage'],
      });
    }

    const stream = Readable.fromWeb(response.body);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.name)}"`
    );
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.size);

    stream.pipe(res);
  } catch {
    res.status(500).render('error', {
      title: 'Download File Failed',
      errorMessages: ['Unexpected error occurred'],
    });
  }
};

export { uploadSingleFile, postFile, downloadFile };
