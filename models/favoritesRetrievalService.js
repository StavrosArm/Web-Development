const UserDAO = require('./userDAO'); 
const SessionDAO = require('./sessionDAO'); 

function returnFavorites(req,res,client){
    const data=req.body;
    const username=data.username;
    const sessionId=data.sessionId;

    const user=UserDAO.getUser(username);
    if(SessionDAO.validSession(username,sessionId)){
        const favorites=user.favorites;
        console.log(favorites);
        res.json({success:true,  favorites , username});
    }else{
        res.status(401).send({error:'Δεν υπάρχει ο αντίστοιχος χρήστης'})
    }

}

//H ίδια λογική αλλά για την Mongo , ψάχνουμε τον χρήστη και το sessionID , και γυρνάμε τις αγαπημένες αγγελίες 
//και τις στέλνουμε πίσω στον server.

function returnFavoritesMongo(req, res, client) {
    const data = req.body;
    const username = data.username;
    const sessionId = data.sessionId;
  
    const database = client.db('Rent&Buy');
    const collection = database.collection('Users');
  
    collection
      .findOne({ username, sessionId })
      .then((user) => {
        if (!user) {
          res.status(401).send({ error: 'Δεν υπάρχει ο αντίστοιχος χρήστης' });
        } else {
          const favorites = user.favorites;
          console.log(favorites);
          res.json({ success: true, favorites, username });
        }
      })
      .catch((error) => {
        console.error('Error :', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  
module.exports={
    returnFavorites,
    returnFavoritesMongo
};