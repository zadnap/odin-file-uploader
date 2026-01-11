import { formatDate } from '../lib/date.js';
import { prisma } from '../lib/prisma.js';
import { formatFileSize } from '../lib/fileSize.js';

const getMyDocuments = async (req, res) => {
  const userId = req.user.id;

  const [folders, files] = await Promise.all([
    prisma.folder.findMany({
      where: {
        userId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    }),
    prisma.file.findMany({
      where: {
        userId,
        folderId: null,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    }),
  ]);

  const docs = [
    ...folders.map((f) => ({
      ...f,
      type: 'folder',
      author: f.user.username,
      createdAt: formatDate(f.createdAt),
      size: '',
    })),
    ...files.map((f) => ({
      ...f,
      type: 'file',
      author: f.user.username,
      createdAt: formatDate(f.createdAt),
      size: formatFileSize(f.size),
    })),
  ];

  res.render('index', { docs });
};

const getSharedWithMe = async (req, res) => {
  res.render('index');
};

export { getMyDocuments, getSharedWithMe };
