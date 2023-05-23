const path = require('path');
const express = require('express');
const { csrfSync } = require('csrf-sync');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const insultRoutes = require('./routes/insult.route');
const db = require('./data/database');

require('dotenv').config();

let port = 5000;

if (process.env.PORT) {
  port = process.env.PORT;
}

const app = express();
const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    if (req.body['CSRFToken'] || req.query['CSRFToken']) {
      return req.body['CSRFToken'] || req.query['CSRFToken'];
    }
    return req.headers['x-csrf-token'];
  },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrfSynchronisedProtection);

app.use(addCsrfTokenMiddleware);

app.use('/insults', insultRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

db()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
