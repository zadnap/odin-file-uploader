import { PAGINATION } from '../config/pagination.js';
import { prisma } from './prisma.js';

const computeMaxPage = async (userId, parentId = null) => {
  const [totalFolders, totalFiles] = await Promise.all([
    prisma.folder.count({
      where: { userId, parentId },
    }),
    prisma.file.count({
      where: { userId, folderId: parentId },
    }),
  ]);
  const totalDocs = totalFolders + totalFiles;
  const maxPage = Math.ceil(totalDocs / PAGINATION.PAGE_SIZE);

  return maxPage;
};

const computeOffset = (currentPage) => {
  return (currentPage - 1) * PAGINATION.PAGE_SIZE;
};

export { computeMaxPage, computeOffset };
