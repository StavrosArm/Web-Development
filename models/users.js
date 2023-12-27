

const users = [
  { 
    id: 1,
    username: 'Armeniakos', 
    password: 'Istos1234', 
    sessionId: '', 
    favorites: []
    },
  { 
    id: 2, 
    username: 'Ioannou', 
    password: 'Istos4567', 
    sessionId: '', 
    favorites: [] 
  },
  { 
    id: 3, 
    username: 'MakisTsikos', 
    password: 'klarino', 
    sessionId: '', 
    favorites: [] 
  },
  { 
    id: 4, 
    username: 'EfiThodi', 
    password: 'Gidia', 
    sessionId: '' ,
    favorites: []
  },
  { 
    id: 5, 
    username: 'NtinosIsoufis', 
    password: 'NtigklaNtigkla', 
    sessionId: '', 
    favorites: [] 
  },
  { 
    id: 6, 
    username: 'a', 
    password: '1', 
    sessionId: '' , 
    favorites: []
  }
];

function getUser(username) {
  return users.find((user) => user.username === username);
}

function setSessionId(username, sessionID) {
  let user = users.find((user) => user.username === username);
  user.sessionId = sessionID;
}

function validSession(username, sessionID) {
  let user = users.find((user) => user.sessionId === sessionID)
  console.log('Username: ',user.username ,'SessionId',user.sessionId);
  if (user.username === username) 
  {
    return true;
  }else 
  {
    return false;
  }
}




module.exports = {
  getUser,
  setSessionId,
  validSession,
  
};

