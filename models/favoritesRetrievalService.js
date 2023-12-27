const {getUser,validSession}=require('./users');

function returnFavorites(req,res){
    const data=req.body;
    const username=data.username;
    const sessionId=data.sessionId;

    const user=getUser(username);
    if(validSession(username,sessionId)){
        const favorites=user.favorites;
        console.log(favorites);
        res.json({success:true,  favorites , username});
    }else{
        res.status(401).send({error:'Δεν υπάρχει ο αντίστοιχος χρήστης'})
    }

}

module.exports={
    returnFavorites,
};