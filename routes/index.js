const { Router } = require('express');

//

const router = Router();

//

// GET ////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  if (req.isAuthenticated) res.send('home');
  else res.redirect('/login');
});

//_________________________________________________________________

//

// POST ///////////////////////////////////////////////////////////

module.exports = router;
