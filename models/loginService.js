const uuid = require('uuid');
const {getUser,setSessionId} = require('./users');

//Παίρνουμε το username και το password , και ελέγχουμε τα credentials του χρήστη 
//Στην περίπτωση που υπάρχει το username , αλλά είναι λάθος το password , στέλνουμε 
//401 , για unauthorized access . Αντίστοιχα , αν έχουμε λάθος username , στέλνουμε 404 γιατί δεν
//υπάρχει ο χρήστης. Στην περίπτωση που υπάρχει , του δίνουμε ένα μοναδικό αναγνωριστικό μέσω της uuid
//Και το στέλνουμε στον client.
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
