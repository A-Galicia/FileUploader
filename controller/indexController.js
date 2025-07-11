const db = require('../db/queries');
const bcrypt = require('bcryptjs');

const multer = require('multer');
const upload = multer();

//

// Passport Functions /////////////////////////////////////////////

async function useLocalStrategy(username, password, done) {
  try {
    const user = await db.selectUserByName(username);

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

async function deserializeUser(id, done) {
  try {
    const user = await db.selectUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
}

//_________________________________________________________________

//

// Database Control ///////////////////////////////////////////////

async function insertUser(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.insertUser(req.body.username, hashedPassword);
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function createFolder(req, res) {
  try {
    await db.createFolder(req.user.id, req.body.name);
  } catch (err) {
    console.log(err);
  }

  res.redirect('/home');
}

async function getHome(req, res) {
  try {
    const folders = await db.getAllFolders(req.user.id);
    const files = await db.getAllFiles(req.user.id);

    res.render('home', { folders: folders, files: files });
  } catch (err) {
    console.log(err);
  }
}

async function getFolder(req, res) {
  try {
    const files = await db.getNestedFiles(req.params.folderId);
    const folder = await db.getFolderById(req.params.folderId);

    res.render('folder', { folder: folder, files: files });
  } catch (err) {
    console.log(err);
  }
}

async function uploadFile(req, res) {
  try {
    await db.createFile(req.file, req.user.id);

    res.redirect('/home');
  } catch (err) {
    console.log(err);
  }
}

async function uploadNestedFile(req, res) {
  try {
    await db.createNestedFile(req.file, req.params.folderId, req.user.id);

    res.redirect(`/folder/${req.params.folderId}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  insertUser,
  useLocalStrategy,
  deserializeUser,
  createFolder,
  getHome,
  getFolder,
  uploadFile,
  uploadNestedFile,
};
