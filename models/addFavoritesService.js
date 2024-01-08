const UserDAO = require('./userDAO'); 
const SessionDAO = require('./sessionDAO'); 


//Δεν θέλουμε μέσα στα αγαπημένα να υπάρχουν το username και το session , οπότε τα αφαιρουμε
function removeSessionAndUsername(obj) {
    const { sessionId, username, ...newObj } = obj;
    return newObj;
  }

//αρχικά λαμβάνουμε τα δεδομένα και ελέγχουμε αν είναι έγκυρη η σύνδεση.
//Στην περίπτωση που είναι , αφαιρούμε το username και το password
//Ελέγχουμε και πάλι ότι αυτό το sessionId αντιστοιχεί στον συγκεκριμένο user 
//Στην περίπτωση που αντιστοιχεί , κάνουμε έλεγχο ότι δεν υπάρχει ήδη η αγγελία και προχωράμε 
//στην προσθήκη της , στέλνοντας κατάλληλη απόκριση.

function updateFavorites(req, res, client, flag) {
  const data = req.body;

  const sessionID = data.sessionId;
  const username = data.username;

  if (!username || !sessionID) {
    return res.status(400).json({ error: 'H σύνδεση έληξε' });
  }

  const NewFavoritesData = removeSessionAndUsername(data);


  const user = UserDAO.getUser(username);

  if (SessionDAO.validSession(username, sessionID)) {

    if (!user.favorites.some(favorite => favorite.id === NewFavoritesData.id)) {
      user.favorites.push(NewFavoritesData);
      UserDAO.updateUserFavorites(username, user.favorites);

      userFROMdao = UserDAO.getUser(username);
      console.log(userFROMdao.favorites, ` Οι αγαπημένες αγγελίες του χρήστη  ${user.username}`)
    }
    else {
      console.log('Υπάρχει ήδη στα αγαπημένα')
    }
    res.status(200).json({ success: true, message: 'OK' });

  }
  else {
    res.status(401).send({ error: 'Συνδεθείτε για προσθήκη αγαπημένων' })
  }





}

//Ξεκινάμε να κάνουμε την ίδια δουλειά για την MongoDB.
//Αρχικά πρέπει να πάρουμε τα δεδομένα και να τα,ελέγξουμε όπως και στην παραπάνω περίπτωση , ώστε 
// να αφαιρέσουμε το username και το sessionId.  

//Aντίστοιχα ψάχνουμε στην Mongo αν είναι έγκυρο το sessionID και αν δεν υπάρχει ήδη στα αγαπημένα , 
//Το κάνουμε push στην βάση.Στέλνουμε 200 ΟΚ αν υπάρχει ήδη στην βάση , ή αν προστέθηκε με επιτυχία.
function updateFavoritesMongo(req, res, client) {
    const data = req.body;
    const sessionID = data.sessionId;
    const username = data.username;
  
    const NewFavoritesData = removeSessionAndUsername(data);
  
    if (!username || !sessionID) {
      return res.status(400).json({ error: 'H σύνδεση έληξε' });
    }
  
    const database = client.db('Rent&Buy');
    const collection = database.collection('Users');
  
    collection
      .findOne({ username, sessionId: sessionID })
      .then((existingUser) => {
        if (!existingUser) {
          return res.status(401).json({ error: 'Συνδεθείτε για προσθήκη αγαπημένων' });
        }
  
        if (!existingUser.favorites.some((favorite) => favorite.id === NewFavoritesData.id)) {
          collection
            .updateOne(
              { username, sessionId: sessionID },
              { $push: { favorites: NewFavoritesData } }
            )
            .then(() => {
              console.log(`Προστέθηκε αγγελία στα αγαπημένα του χρήστη ${username}`);
              res.status(200).json({ success: true, message: 'OK' });
            })
            .catch((error) => {
              console.error('Error:', error);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        } else {
          console.log('Υπάρχει ήδη στα αγαπημένα');
          res.status(200).json({ success: true, message: 'OK' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  

module.exports={
    updateFavorites,
    updateFavoritesMongo
}