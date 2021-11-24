const express = require('express');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('../package.json');

const { secret } = config;

const app = express();

app.set('config', config);
app.set('pkg', pkg);
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

routes(app, (err) => {
  if (err) {
    throw err;
  }
  app.use(errorHandler);
});

module.exports = app;
