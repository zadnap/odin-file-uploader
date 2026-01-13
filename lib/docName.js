import path from 'path';
import { prisma } from './prisma.js';

const getUniqueFileName = async ({ originalName, userId, folderId }) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);

  let fileName = originalName;
  let counter = 1;

  while (true) {
    const existed = await prisma.file.findFirst({
      where: {
        name: fileName,
        userId,
        folderId,
      },
    });

    if (!existed) break;

    fileName = `${baseName} (${counter})${ext}`;
    counter++;
  }

  return fileName;
};

const getUniqueFolderName = async ({ originalName, userId, parentId }) => {
  const baseName = originalName.trim();

  let folderName = baseName;
  let counter = 1;

  while (true) {
    const existed = await prisma.folder.findFirst({
      where: {
        name: folderName,
        userId,
        parentId: parentId || null,
      },
    });

    if (!existed) break;

    folderName = `${baseName} (${counter})`;
    counter++;
  }

  return folderName;
};

export { getUniqueFileName, getUniqueFolderName };
