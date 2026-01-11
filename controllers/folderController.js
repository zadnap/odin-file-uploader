import { formatDate } from '../lib/date.js';
import { formatFileSize } from '../lib/fileSize.js';
import { prisma } from '../lib/prisma.js';

const getFolderById = async (req, res) => {
  const folderId = req.params.id;

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: {
      children: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      files: {
        select: {
          id: true,
          name: true,
          size: true,
          mimeType: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  const folderItems = [
    ...folder.children.map((f) => ({
      ...f,
      type: 'folder',
      author: f.user.username,
      createdAt: formatDate(f.createdAt),
      size: '',
    })),
    ...folder.files.map((f) => ({
      ...f,
      type: f.mimeType,
      author: f.user.username,
      createdAt: formatDate(f.createdAt),
      size: formatFileSize(f.size),
    })),
  ];

  res.render('index', { docs: folderItems, breadcrumb: [] });
};

export { getFolderById };
