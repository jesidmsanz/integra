const roles = require('../components/roles/network');
const users = require('../components/users/network');
const contacts = require('../components/contacts/network');
const smtp = require('../components/smtp/network');
const liquidationNewsTracking = require('../components/liquidation_news_tracking/network');

// JWT strategy
require('../utils/auth/strategies/jwt');

const routes = function (app) {
  const prefix = '/api';

  app.use(`${prefix}/roles`, roles);
  app.use(`${prefix}/users`, users);
  app.use(`${prefix}/contacts`, contacts);
  app.use(`${prefix}/smtp`, smtp);
  app.use(`${prefix}/liquidation_news_tracking`, liquidationNewsTracking);
};

module.exports = routes;
