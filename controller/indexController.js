const db = require('../db/queries');
const bcrypt = require('bcryptjs');

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

module.exports = {
  insertUser,
  useLocalStrategy,
  deserializeUser,
};
