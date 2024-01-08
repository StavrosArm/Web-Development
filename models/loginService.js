const uuid = require('uuid');
const UserDAO = require('./userDAO'); 
const SessionDAO = require('./sessionDAO'); 


//Παίρνουμε το username και το password , και ελέγχουμε τα credentials του χρήστη 
//Στην περίπτωση που υπάρχει το username , αλλά είναι λάθος το password , στέλνουμε 
//401 , για unauthorized access . Αντίστοιχα , αν έχουμε λάθος username , στέλνουμε 404 γιατί δεν
//υπάρχει ο χρήστης. Στην περίπτωση που υπάρχει , του δίνουμε ένα μοναδικό αναγνωριστικό μέσω της uuid
//Και το στέλνουμε στον client.
function login(req, res ,client,flag) {
    const{username,password}=req.body;
    console.log('Credentials: ',username , password);

 
    const userVer = UserDAO.getUser(username);

    // console.log(userVer);

    if (!userVer) {
        res.status(404).send({error:'Δεν υπάρχει εγγεγραμμένος χρήστης, κάντε εγγραφή'})
    } else if (userVer.password !== password) {
        res.status(401).send({error:'Εσφαλμένος κωδικός πρόσβασης'})
    }
    else {
        const sessionId=SessionDAO.setSessionId(userVer.username);
        // console.log(sessionId);
        // console.log(username);
        res.json({ success: true, sessionId, username });
    }

}

function loginMongo(req, res, client) {
    const { username, password } = req.body;
    console.log('Credentials: ', username, password);
  
    const database = client.db('Rent&Buy');
    const collection = database.collection('Users');
  
    collection
      .findOne({ username })
      .then((existingUser) => {
        console.log(existingUser);
        if (!existingUser) {
          res.status(404).send({ error: 'Δεν υπάρχει εγγεγραμμένος χρήστης, κάντε εγγραφή' });
        } else if (existingUser.password !== password) {
          res.status(401).send({ error: 'Εσφαλμένος κωδικός πρόσβασης' });
        } else {
          const sessionId = uuid.v4();
          setSessionIdMongo(username, sessionId, collection)
            .then(() => {
              console.log(existingUser.sessionId);
              res.json({ success: true, sessionId, username: existingUser.username });
            })
            .catch((error) => {
              console.error('Error setting sessionId:', error);
              res.status(500).send({ error: 'Internal Server Error' });
            });
        }
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
      });
  }
  

async function setSessionIdMongo(username, sessionId, collection) {
    try {
      const result = await collection.updateOne(
        { username },
        { $set: { sessionId } }
      );
  
      if (result.modifiedCount === 1) {
        console.log(`SessionId set for user ${username}`);
      } else {
        console.log(`User ${username} not found`);
      }
    } catch (error) {
      console.error('Error setting sessionId:', error);
      throw error; 
    }
  }

module.exports = { login ,loginMongo };
