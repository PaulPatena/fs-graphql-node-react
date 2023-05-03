const authResolver = require('./auth');
const bookingsResolver = require('./booking');
const eventResolver = require('./events');

module.exports = {
  ...authResolver,
  ...bookingsResolver,
  ...eventResolver
};
