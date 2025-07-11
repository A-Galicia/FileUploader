const { Router } = require('express');
const auth = require('../authMiddleware');
const controller = require('../controller/indexController');

//

const router = Router();

//

// GET ////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  if (req.isAuthenticated) res.redirect('/home');
  else res.redirect('/login');
});

router.get('/home', auth.isAuth, controller.getHome);

router.get('/folder/:id', auth.isAuth, controller.getFolder);

//_________________________________________________________________

//

// POST ///////////////////////////////////////////////////////////

router.post('/folder', controller.createFolder);

module.exports = router;
