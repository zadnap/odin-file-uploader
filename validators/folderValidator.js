import { body } from 'express-validator';

const folderValidator = [
  body('parentId')
    .optional({ values: 'falsy' })
    .isUUID()
    .withMessage('Invalid parent folder id'),
  body('folder')
    .trim()
    .notEmpty()
    .withMessage('Folder name is required')
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage('Folder name must be between 1 and 100 characters')
    .bail()
    .custom((value) => {
      if (/^[\W_]+$/u.test(value)) {
        throw new Error('Folder name is invalid');
      }
      return true;
    }),
];

export default folderValidator;
