const expressSession = require('express-session');
const fileStore = require('session-file-store');

function createSessionStore() {
  const FileStore = fileStore(expressSession);

  const store = new FileStore();

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
