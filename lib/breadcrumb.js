import { prisma } from './prisma.js';

const buildBreadcrumb = async (folderId, userId, maxLevel = 3) => {
  const stack = [];

  let current = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    select: {
      id: true,
      name: true,
      parentId: true,
    },
  });

  if (!current) return [];

  while (current) {
    stack.push({
      name: current.name,
      url: `/folders/${current.id}`,
    });

    if (!current.parentId) break;

    current = await prisma.folder.findFirst({
      where: { id: current.parentId, userId },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });
  }

  let breadcrumb = stack.reverse();

  if (breadcrumb.length > maxLevel) {
    breadcrumb = breadcrumb.slice(breadcrumb.length - maxLevel);

    breadcrumb.unshift({
      name: '...',
      isEllipsis: true,
    });
  }

  return breadcrumb;
};

export { buildBreadcrumb };
