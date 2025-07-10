const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//

const router = Router();

//

// GET ////////////////////////////////////////////////////////////

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

//_________________________________________________________________

//

// POST ///////////////////////////////////////////////////////////

module.exports = router;
