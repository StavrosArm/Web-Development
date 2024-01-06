const User = require('./user');

class UserDAO {
  constructor() {
    this.users = [];
    this.addUsers(); 
  }

  addUsers() {
    this.addUser('Armeniakos','Istos1234')
    this.addUser('Ioannou','Istos3456')
    this.addUser('MakisTsikos', 'klarino');
    this.addUser('EfiThodi', 'Gidia');
    this.addUser('NtinosIsoufis', 'NtigklaNtigkla');
    this.addUser('a', '1');
  }

  addUser(username, password) {
    const newUser = new User(username, password);
    this.users.push(newUser);
    return newUser;
  }

  updateUserFavorites(username, newFavorites) {
    const userIndex = this.users.findIndex((user) => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].favorites = newFavorites;
      return true; 
    }
    return false; 
}

  getUser(username) {
    return this.users.find((user) => user.username === username);
  }

}

module.exports = new UserDAO();

