const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const controller = require('../controller/indexController');

//

const router = Router();

//

// Passport Functions /////////////////////////////////////////////

passport.use(new LocalStrategy(controller.useLocalStrategy));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(controller.deserializeUser);

//_________________________________________________________________

//

// GET ////////////////////////////////////////////////////////////

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

//_________________________________________________________________

//

// POST ///////////////////////////////////////////////////////////

router.post('/sign-up', controller.insertUser);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
  })
);

module.exports = router;
