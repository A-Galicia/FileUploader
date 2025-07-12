const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function insertUser(username, password) {
  await prisma.user.create({
    data: {
      name: username,
      password: password,
    },
  });
}

async function createFolder(id, fileName) {
  const folder = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      storage: {
        create: {
          name: fileName,
        },
      },
    },
  });
}

async function selectUserByName(username) {
  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });

  return user;
}

async function selectUserById(id) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  return user;
}

async function getAllFolders(id) {
  const folders = await prisma.storage.findMany({
    where: {
      userId: id,
    },
  });

  return folders;
}

async function getAllFiles(id) {
  const files = await prisma.file.findMany({
    where: {
      userId: id,
    },
  });
  return files;
}

async function createFile(file, id, url, public_id) {
  const { originalname, size } = file;
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      files: {
        create: {
          name: originalname,
          size: size,
          path: url,
          publicId: public_id,
        },
      },
    },
  });
}

async function getNestedFiles(id) {
  const files = await prisma.file.findMany({
    where: {
      storageId: id,
    },
  });

  return files;
}

async function createNestedFile(file, fileId, userId, url, public_id) {
  const { originalname, size } = file;
  await prisma.storage.update({
    where: {
      id: fileId,
      userId: userId,
    },
    data: {
      files: {
        create: {
          name: originalname,
          size: size,
          path: url,
          publicId: public_id,
        },
      },
    },
  });
}

async function getFolderById(id) {
  const folder = await prisma.storage.findFirst({
    where: {
      id: id,
    },
  });

  return folder;
}

async function deleteFolder(id) {
  await prisma.file.deleteMany({
    where: {
      storageId: id,
    },
  });

  await prisma.storage.deleteMany({
    where: {
      id: id,
    },
  });
}

async function getFileById(id) {
  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  return file;
}

async function deleteFile(id) {
  await prisma.file.deleteMany({
    where: {
      id: id,
    },
  });
}

module.exports = {
  insertUser,
  selectUserByName,
  selectUserById,
  createFolder,
  getAllFolders,
  getAllFiles,
  createFile,
  getNestedFiles,
  createNestedFile,
  getFolderById,
  deleteFolder,
  getFileById,
  deleteFile,
};
