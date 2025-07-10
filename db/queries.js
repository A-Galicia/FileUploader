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

module.exports = {
  insertUser,
  selectUserByName,
  selectUserById,
};
