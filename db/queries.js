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
  console.log('in all files');
  const files = await prisma.file.findMany({
    where: {
      userId: id,
    },
  });
  console.log(files);
  return files;
}

module.exports = {
  insertUser,
  selectUserByName,
  selectUserById,
  createFolder,
  getAllFolders,
  getAllFiles,
};
