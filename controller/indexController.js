require('dotenv').config();
const db = require('../db/queries');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const fetch = require('node-fetch');

const multer = require('multer');
const upload = multer();

const cloudinary = require('cloudinary').v2;

// Cloudinary /////////////////////////////////////////////////////

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//_________________________________________________________________

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
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: 'auto',
      },
      (error, result) => {
        console.log(error);
      }
    );

    await db.createFile(
      req.file,
      req.user.id,
      result.secure_url,
      result.public_id
    );

    res.redirect('/home');
  } catch (err) {
    console.log(err);
  }
}

async function uploadNestedFile(req, res) {
  try {
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: 'auto',
        public_id: req.file.originalname,
      },
      (error, result) => {
        console.log(error);
      }
    );

    await db.createNestedFile(
      req.file,
      req.params.folderId,
      req.user.id,
      result.secure_url,
      result.public_id
    );

    res.redirect(`/folder/${req.params.folderId}`);
  } catch (err) {
    console.log(err);
  }
}

async function deleteFolder(req, res) {
  try {
    await db.deleteFolder(req.params.id);

    res.redirect('/home');
  } catch (err) {
    console.log(err);
  }
}

async function ShowFile(req, res) {
  try {
    const file = await db.getFileById(req.params.fileId);
    const folder = await db.getFolderById(req.params.folderId);

    res.render('file', { folder: folder, file: file });
  } catch (err) {
    console.log(err);
  }
}

async function deleteFile(req, res) {
  try {
    await db.getFileById(req.params.id);
    await db.deleteFile(req.params.id);

    cloudinary.uploader.destroy(file.publicId, function (error, result) {
      if (error) {
        console.log(error);
      }
    });

    res.redirect('/home');
  } catch (err) {
    console.log(err);
  }
}

async function downloadFile(req, res) {
  try {
    const folderId = req.params.folderId;
    const fileId = req.params.fileId;

    const file = await db.getFileById(fileId);
    filepath = `./uploads/${file.name}`;
    await fetch(file.path).then((res) => {
      res.body.pipe(fs.createWriteStream(filepath));
    });

    // Waits for fetch to enter file into ./uploads before sending to client
    await setTimeout(() => {
      res.download(filepath);
    }, 1);
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
  deleteFolder,
  ShowFile,
  deleteFile,
  downloadFile,
};
