import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
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
