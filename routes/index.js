const { Router } = require('express');
const auth = require('../authMiddleware');
const controller = require('../controller/indexController');

const multer = require('multer');

// Storing the files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e3);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//

const router = Router();

//

// GET ////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  if (req.isAuthenticated) res.redirect('/home');
  else res.redirect('/login');
});

router.get('/home', auth.isAuth, controller.getHome);

router.get('/folder/:folderId/:fileId', auth.isAuth, controller.ShowFile);

router.get('/folder/:folderId', auth.isAuth, controller.getFolder);

//_________________________________________________________________

//

// POST ///////////////////////////////////////////////////////////

router.post('/folder', controller.createFolder);

router.post('/upload', upload.single('file'), controller.uploadFile);

router.post(
  '/nested_upload/:folderId',
  upload.single('file'),
  controller.uploadNestedFile
);

router.post('/delete/folder/:id', controller.deleteFolder);

module.exports = router;
