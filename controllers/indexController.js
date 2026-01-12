import { formatDate } from '../lib/date.js';
import { prisma } from '../lib/prisma.js';
import { formatFileSize } from '../lib/fileSize.js';
import { computeMaxPage, computeOffset } from '../lib/pagination.js';
import { getDocuments } from '../generated/prisma/sql/index.js';
import { PAGINATION } from '../config/pagination.js';

const getMyDocuments = async (req, res) => {
  const userId = req.user.id;
  const { page, sortBy, order } = req.query;

  const currentPage = Number(page) || 1;
  const offset = computeOffset(currentPage);
  const maxPage = await computeMaxPage(userId);

  const docs = await prisma.$queryRawTyped(
    getDocuments(userId, PAGINATION.PAGE_SIZE, offset, sortBy, order)
  );

  const formattedDocs = docs.map((doc) => ({
    ...doc,
    createdAt: formatDate(doc.createdAt),
    size: doc.size ? formatFileSize(doc.size) : '',
  }));

  res.render('index', {
    docs: formattedDocs,
    breadcrumb: null,
    page: {
      current: currentPage,
      max: maxPage,
    },
    sortBy,
    order,
    currentFolderId: null,
  });
};

const getSharedWithMe = async (req, res) => {
  res.render('index');
};

export { getMyDocuments, getSharedWithMe };
