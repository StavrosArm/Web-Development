const {getUser,validSession} = require('./users');

function removeSessionAndUsername(obj) {
    const { sessionId, username, ...newObj } = obj;
    return newObj;
  }

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
        }
    
        
        console.log(user.favorites, 'ValidSession')
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