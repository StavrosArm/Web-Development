const Session = require('./session');

class SessionDAO {
  constructor() {
    this.sessions = {};
  }

  setSessionId(username) {
    const sessionId = Session.generateSessionId();
    this.sessions[username] = sessionId;
    return sessionId;
  }

  getSessionId(username) {
    return this.sessions[username];
  }

  validSession(username) {
    return this.sessions.hasOwnProperty(username);
    }
    
  updateSessionId(username, newSessionId) {
    this.sessions[username] = newSessionId;
  }
}

module.exports = new SessionDAO();
