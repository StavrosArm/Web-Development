const uuid = require('uuid');

class Session {
  static generateSessionId() {
    return uuid.v4();
  }
}

module.exports = Session;
