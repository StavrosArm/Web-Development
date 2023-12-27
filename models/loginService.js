const uuid = require('uuid');
const {getUser,setSessionId} = require('./users');

function login(req, res) {
    const{username,password}=req.body;
    console.log('Credentials: ',username , password);
    const user = getUser(username);

    if (!user) {
        res.status(404).send({error:'Δεν υπάρχει εγγεγραμμένος χρήστης, κάντε εγγραφή'})
    } else if (user.password !== password) {
        res.status(401).send({error:'Εσφαλμένος κωδικός πρόσβασης'})
    }
    else {
        const sessionId = uuid.v4();
        setSessionId(user.username,sessionId);
        console.log(user.sessionId);
        res.json({ success: true, sessionId, username });
    }
}

module.exports = { login };
