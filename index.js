const express = require('express')
const path = require('path');
const { users } = require('./models/models');
const uuid = require('uuid');
const app = express()
const port = 8080

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Το get για την index.html , όπως στο φροντιστήριο το στέλνουμε με το /
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the index file')
    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

//To get για το subcategory 
app.get('/subcategory.html', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the subcategory file')
    res.sendFile('subcategory.html', options, function(err){
        console.log(err)
    })
})

//To get για το category 
app.get('/category.html', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the category file')
    res.sendFile('category.html', options, function(err){
        console.log(err)
    })
})

//Η σύνδεση του χρήστη , με το uuid. 
app.post('/submit', (req, res) => {

    const { username, password } = req.body;
    console.log('Credentials: ',username ,password);

    const user=users.find((u)=>u.username===username&&u.password===password);
      
    if (user) {
      const sessionId = uuid.v4();
      user.sessionId=sessionId;

      res.json({ success: true, sessionId ,username });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });






