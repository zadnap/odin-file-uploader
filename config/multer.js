import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, uploadDir);
  },
  filename: (req, file, done) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    done(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, done) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      done(
        new Error(
          `File type "${file.mimetype}" is not supported.
          Allowed file types: PDF, JPG, PNG, DOC, DOCX.`
        )
      );
    } else {
      done(null, true);
    }
  },
});

export { upload };
