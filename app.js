const express = require('express');
const path = require('node:path');
const indextRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const passport = require('passport');

// IMPPORTS _______________________________________________________

//

// APP CONFIG /////////////////////////////////////////////////////

const app = express();

const assetsPath = path.join(__dirname, 'public');

app.use(express.static(assetsPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indextRouter);
app.use('/', authRouter);

//

// SERVER START ///////////////////////////////////////////////////

//

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
