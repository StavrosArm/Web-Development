class User {
    constructor(username, password) {
      this.username = username;
      this.password = password;
      this.sessionId = '';
      this.favorites = [];
    }
  }
  
  module.exports = User;
  