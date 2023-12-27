const express = require('express')
const path = require('path');
const { login } = require('./models/loginService');
const { updateFavorites } = require('./models/addFavoritesService');
const {returnFavorites} = require('./models/favoritesRetrievalService');
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
    returnFavorites(req,res);
});


//Η σύνδεση του χρήστη ,καλούμε την loginService , η οποία κάνει έλεγχο ,
//και γυρνάει εκείνη τα κατάλληλα μηνύματα. 
app.post('/submit', (req, res) => {
    login(req, res);
});

//Η προσθήκη στα αγαπημένα μέσω της updateFavorites
app.post('/addToFavorites',(req,res)=> {
    updateFavorites(req,res);
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




