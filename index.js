const express = require('express')
const path = require('path');
const { login, loginMongo } = require('./models/loginService');
const { updateFavorites, updateFavoritesMongo } = require('./models/addFavoritesService');
const {returnFavorites,returnFavoritesMongo} = require('./models/favoritesRetrievalService');
// const users = require('./models/userDAO.js')
// users.addUsers();
const app = express()
const port = 8080
const { MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config();
const uri =process.env.MONGODB_URI;
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let userInput;
rl.question('Θέλετε να τρέξει με  MongoDB , γράψτε 1 για ναι , 0 για όχι: ', (answer) => {
  userInput = answer;
  rl.close();
});


//O κώδικας που ακολουθεί μέχρι το run είναι απο το Atlas για σύνδεση με την βάση 
//Που δίνεται στο connect.

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

if(userInput===1){
  run().catch(console.dir);
}

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

app.get('/favorite-ads.html', (req, res) => {

    const options = {
      root: path.join(__dirname, 'public', 'html')
    };
    res.sendFile('favorite-ads.html', options, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('Error sending HTML file');
      } else {
        console.log('HTML file sent successfully');
      }
    });
});

app.post('/listOfFavorites',(req,res)=>{

  if (userInput==1){
    returnFavoritesMongo(req,res,client);
  }else{
    returnFavorites(req,res);
  }
});


//Η σύνδεση του χρήστη ,καλούμε την loginService , η οποία κάνει έλεγχο ,
//και γυρνάει εκείνη τα κατάλληλα μηνύματα. 
app.post('/submit', (req, res) => {

 if(userInput==1){
  loginMongo(req,res,client);
  }
  else
  {
    login(req, res, client ,userInput);
  }
    
  
  
});

//Η προσθήκη στα αγαπημένα μέσω της updateFavorites
app.post('/addToFavorites',(req,res)=> {
  if(userInput==1){
    updateFavoritesMongo(req,res,client);
  }
  else
  {
    updateFavorites(req,res);
  }

})


app.get('/favorite-ads.html', (req, res) => {

    const options = {
      root: path.join(__dirname, 'public', 'html')
    };
    res.sendFile('favorite-ads.html', options, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('Error sending HTML file');
      } else {
        console.log('HTML file sent successfully');
      }
    });

  });


 

