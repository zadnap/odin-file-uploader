import { PAGINATION } from '../config/pagination.js';
import { getFolderContent } from '../generated/prisma/sql/getFolderContent.js';
import { buildBreadcrumb } from '../lib/breadcrumb.js';
import { formatDate } from '../lib/date.js';
import { formatFileSize } from '../lib/fileSize.js';
import { computeMaxPage, computeOffset } from '../lib/pagination.js';
import { prisma } from '../lib/prisma.js';
import { validationResult } from 'express-validator';

const getFolderById = async (req, res) => {
  const userId = req.user.id;
  const folderId = req.params.id;
  const { page, sortBy, order } = req.query;

  const currentPage = Number(page) || 1;
  const offset = computeOffset(currentPage);
  const maxPage = await computeMaxPage(userId, folderId);

  const docs = await prisma.$queryRawTyped(
    getFolderContent(
      userId,
      folderId,
      PAGINATION.PAGE_SIZE,
      offset,
      sortBy,
      order
    )
  );

  const formattedDocs = docs.map((doc) => ({
    ...doc,
    createdAt: formatDate(doc.createdAt),
    size: doc.size ? formatFileSize(doc.size) : '',
  }));

  res.render('index', {
    docs: formattedDocs,
    breadcrumb: await buildBreadcrumb(folderId, userId),
    page: {
      current: currentPage,
      max: maxPage,
    },
    sortBy,
    order,
    currentFolderId: folderId,
  });
};

const handleFolderValidator = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map((err) => err.msg);

  return res.status(400).render('error', {
    title: 'Create folder failed',
    errorMessages,
  });
};

const postFolder = async (req, res) => {
  const { folder, parentId } = req.body;
  const userId = req.user.id;

  try {
    await prisma.folder.create({
      data: {
        name: folder,
        userId,
        parentId: parentId || null,
      },
    });

    return res.redirect(parentId ? `/folders/${parentId}` : '/documents');
  } catch {
    return res.status(400).render('error', {
      title: 'Create folder failed',
      errorMessages: ['Unable to create folder. Please try again.'],
    });
  }
};

export { getFolderById, handleFolderValidator, postFolder };
