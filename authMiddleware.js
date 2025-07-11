function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).render('401');
  }
}

module.exports = {
  isAuth,
};
