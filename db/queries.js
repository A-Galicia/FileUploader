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

async function createFile(file, id) {
  const { filename, path, size } = file;
  const newfile = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      files: {
        create: {
          name: filename,
          size: size,
          path: path,
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

  console.log(files);

  return files;
}

async function createNestedFile(file, fileId, userId) {
  const { filename, path, size } = file;
  const newfile = await prisma.storage.update({
    where: {
      id: fileId,
      userId: userId,
    },
    data: {
      files: {
        create: {
          name: filename,
          size: size,
          path: path,
        },
      },
    },
  });
  console.log(newfile);
}

async function getFolderById(id) {
  const folder = await prisma.storage.findFirst({
    where: {
      id: id,
    },
  });

  return folder;
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
};
