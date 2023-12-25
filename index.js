const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the file')
    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

app.get('/subcategory.html', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the subcategory file')
    res.sendFile('subcategory.html', options, function(err){
        console.log(err)
    })
})

app.get('/category.html', function(req, res){

    var options = {
        root: path.join(__dirname, 'public','html')
    }

    console.log('Sending the category file')
    res.sendFile('category.html', options, function(err){
        console.log(err)
    })
})







