const {getUser,validSession} = require('./users');

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

function updateFavorites(req,res){
    const data=req.body;
    
    const sessionID = data.sessionId;
    const username=data.username;

    if (!username || !sessionID) {
        return res.status(400).json({ error: 'H σύνδεση έληξε' });
    }

    const NewFavoritesData=removeSessionAndUsername(data);
    const user=getUser(username);

    if(validSession(username, sessionID)){
        
        if(!user.favorites.some(favorite => favorite.id === NewFavoritesData.id)){
            user.favorites.push(NewFavoritesData);
            console.log(user.favorites, ` Οι αγαπημένες αγγελίες του χρήστη ${user.username}`)
        }
        else
        {
            console.log('Υπάρχει ήδη στα αγαπημένα')
        }
    
        
        
        res.status(200).json({ success: true, message: 'OK' });

    }
    else
    {
        res.status(401).send({error:'Συνδεθείτε για προσθήκη αγαπημένων'})
    }

}

module.exports={
    updateFavorites,
}