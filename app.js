const express = require('express');
const path = require('node:path');
const indextRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const expressSession = require('express-session');
const { PrismaClient } = require('./generated/prisma');

// IMPPORTS _______________________________________________________

//

// APP CONFIG /////////////////////////////////////////////////////

const app = express();

const assetsPath = path.join(__dirname, 'public');

app.use(express.static(assetsPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  expressSession({
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day till cookie expires
    },
    secret: 'Cat',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use('/', indextRouter);
app.use('/', authRouter);

//

// SERVER START ///////////////////////////////////////////////////

//

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
