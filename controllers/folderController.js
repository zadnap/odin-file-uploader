import { PAGINATION } from '../config/pagination.js';
import { getFolderContent } from '../generated/prisma/sql/getFolderContent.js';
import { buildBreadcrumb } from '../lib/breadcrumb.js';
import { formatDate } from '../lib/date.js';
import { formatFileSize } from '../lib/fileSize.js';
import { computeMaxPage, computeOffset } from '../lib/pagination.js';
import { prisma } from '../lib/prisma.js';

const getFolderById = async (req, res) => {
  const userId = req.user.id;
  const folderId = req.params.id;

  const currentPage = Number(req.query.page) || 1;
  const offset = computeOffset(currentPage);
  const maxPage = await computeMaxPage(userId, folderId);

  const docs = await prisma.$queryRawTyped(
    getFolderContent(userId, folderId, PAGINATION.PAGE_SIZE, offset)
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
  });
};

export { getFolderById };
