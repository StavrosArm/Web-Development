const wikiads = 'https://wiki-ads.onrender.com';
const server = 'http://localhost:8080'
let myHeaders = new Headers();
myHeaders.append('Accept', 'application/json')
let urlString;
let queryString;
let params;
window.addEventListener('DOMContentLoaded', init);
let initObject = {
    method: 'GET',
    headers: myHeaders
}

function httpGetRequestIndex(url, url1, callback) {
    fetch(url, initObject)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(categories => {
            fetch(url1, initObject)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => callback(categories, data, null))
                .catch(error => {
                    console.error('Fetch error:', error);
                });

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });


}

function httpGetRequestCategorySubcategory(url, callback) {
    fetch(url, initObject)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(ads => callback(ads, null))
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


console.log("The data are :")

// Η μεταβλητή categories είναι οι 4 γενικές κατηγορίες αγγέλιων που προσφέρονται από wiki ads και η μεταβλητή 
// subcategories παριστάνει ένα array με τις υποκατήγοριες των αγγέλιων
function handleResult(categories, subcategories, err) {
    if (err !== null) {
        console.log(err)
    }
    if (subcategories !== null) {
        let articlesTemplateScript = document.getElementById('categories-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("categories-articles");

        console.log(categories)
        console.log(subcategories)

        for (let category of categories) {
            category.Subcategories = subcategories.filter(subcategory => (category.id == subcategory.category_id))
        }

        console.log(categories)


        let sectionHtmlContent = templates.articlesSection({
            categories: categories,
        });
        articlesSection.innerHTML = sectionHtmlContent;
    } else {
        console.log("Data not found")
    }

}

//Eδώ διαχειριζόμαστε τα αποτελέσματα που λαμβάνουμε απο το wikiads , για την κάθε 
//κατηγορία.
function handleCategoryResult(ads, err) {
    if (err !== null) {
        console.log(err)
    }
    if (ads !== null) {
        let articlesTemplateScript = document.getElementById('adsOfSelectedCategory-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("ads-articles");

        console.log(ads)

        let sectionHtmlContent = templates.articlesSection({
            ads: ads,
        });
        articlesSection.innerHTML = sectionHtmlContent;
        //Eδώ δημιουργούμε τις καρδιές για τα αγαπημένα , καθώς πρέπει να έχουν ερθει όλες 
        //Οι αγγελίες για να βάλουμε κουμπί για αγαπημένα.
        createEventListeners();
    } else {
        console.log("Data not found")
    }
}

// Συνάρτηση που διαχειρίζεται τις αγγελίες των υποκατηγορίων 
function handleSubcategoryResult(subcategoryAds, err) {
    if (err !== null) {
        console.log(err)
    }
    if (subcategoryAds !== null) {
        //Εμφάνιση των subcategoryAds αντικειμένου για debugging
        console.log(subcategoryAds)
        console.log(subcategoryAds.features)

        let articlesTemplateScript = document.getElementById('adsOfSelectedSubCategory-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("subcategory-ads-articles");

        //Τα feature δίνονται ως strings. Τα κόβουμε όπου δούμε ερωτηματικό
        //Και δημιουργούμε ένα νέο αντικείμενο για κάθε αγγελία 
        subcategoryAds.forEach(function (subcategoryAds) {
            let featureArray = subcategoryAds.features.split(';');
            let featuresObject = {};
            featureArray.forEach(function (feature) {
                let keyValue = feature.split(':');
                let key = keyValue[0].trim();
                let value = keyValue[1] ? keyValue[1].trim() : '-';
                featuresObject[key] = value;
            });
            subcategoryAds.features = featuresObject;
        });

        let sectionHtmlContent = templates.articlesSection({
            //Εδώ βάζουμε τα ορίσματα για το handlebar
            ads: subcategoryAds,
            HeadingStr: 'Aποτελέσματα αναζήτησης: '
        });
        articlesSection.innerHTML = sectionHtmlContent;
        //Eδώ δημιουργούμε τις καρδιές για τα αγαπημένα , καθώς πρέπει να έχουν ερθει όλες 
        //Οι αγγελίες για να βάλουμε κουμπί για αγαπημένα.
        createEventListeners();
    } else {
        console.log("Data not found")
    }
}

//H σύνδεση του χρήστη , που γίνεται triggered με submit στην φόρμα.
//Στέλνουμε το username και το password , και αναλόγως καλούμε την failedConnection ή
//succesfulConnection
function connect_user(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const userData = {
        username: username,
        password: password
    };
    const jsonUserData = JSON.stringify(userData);

    fetch(`${server}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonUserData
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errorData => Promise.reject({ status: res.status, message: errorData.message }));
            }
            return res.json();
        })
        .then(data => succesfulConnection(data))
        .catch(err => failedConnection(err));
}

function httpGetFavoriteForUser(UserSession){

    let jsonUserSession=JSON.stringify(UserSession);

    fetch(`${server}/listOfFavorites`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            
        },
        body:jsonUserSession
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json()
    })
    .then(data=>handleFavorites(data))
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function handleFavorites(data){
    console.log(data.favorites);
    if (!data.success) {
        console.log('Δεν βρέθηκαν τα δεδομένα.')
    }else{
        let header2=document.querySelector('.main-content>h2');
        header2.textContent=`Aγαπημένες αγγελίες του χρήστη ${data.username}`
        let favorites_template = document.getElementById('favorites-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(favorites_template);

        let articlesSection = document.getElementById("ads-articles");

        

        let sectionHtmlContent = templates.articlesSection({
            favorites: data.favorites,
        });
        articlesSection.innerHTML = sectionHtmlContent;
    } 
}

//Aν λάβουμε 200 ΟΚ , εμφανίζουμε καλωσόρισες ${username}
function succesfulConnection(data) {
    if (data.success) {
        console.log(data);

        window.sessionId=data.sessionId;
        window.username=data.username;
        
        let myLink=document.getElementById('fav');
        myLink.href=`favorite-ads.html?username=${window.username}&sessionId=${window.sessionId}`

        console.log(window.sessionId);

        const signIn = document.getElementById('sign-in');
        signIn.style.display = 'none';

        //Oποιοδήποτε error δημιουργήθηκε όταν πήγαμε να κάνουμε προσθήκη στα 
        //αγαπημένα χωρίς 
        //να έχουμε συνδεθεί , το εξαφανίζουμε 
        const errorFavorites=document.getElementsByClassName('errorFavorites');
        console.log(errorFavorites);
        for (let i = 0; i < errorFavorites.length; i++) {
            errorFavorites[i].textContent = '';
        }

        const welcome = document.getElementById('welcome');
        welcome.textContent = `Καλωσόρισες, ${data.username}!`;
    } 
}

//Άμα έχουμε 401 ,σημαίνει ότι ο χρήστης πληκτρολόγησε λάθος κωδικό 
//(ο χρήστης υπάρχει αλλά δεν ταιριάζει ο κωδικός 
//που έχει ο σέρβερ) ή άμα έχουμε 404 σημαίνει ότι δεν υπάρχει τέτοιος χρήστης.

function failedConnection(err) {
    console.error('HTTP Status Code: ', err.status);
    const errorMessage = document.getElementById('not-registered');
    errorMessage.style.display='block';
    if (err.status === 404) {
        errorMessage.textContent = 'Δεν υπάρχει εγγεγραμμένος χρήστης';
    } else if (err.status === 401) {
        errorMessage.textContent = 'Εσφαλμένος κωδικός πρόσβασης';
    } else {
        errorMessage.textContent = 'Σφάλμα';
    }
}

//Όλα τα κουμπιά που δημιουργούνται δυναμικά με handlebars , ονομάζονται heart1,heart2...heartN 
//και ανήκουν σε μία κλάση favoriteButton.Μόλις φορτωθούν απο το wikiads , όλες οι αγγελίες 
//μέσω class name τα παίρνουμε και δημιουργούμε event listeners στις εικόνες , που έχουν 
//ξεχωριστό id η καθεμία για να γίνεται η εναλλαγή του χρώματος, καθώς και η προσθήκη με βάση 
//το id της αγγελίας.
function createEventListeners(){
        const addFavorites = document.getElementsByClassName('favoriteButton');
        console.log(addFavorites);
        console.log(addFavorites.length);
        const favoriteButtonsArray = Array.from(addFavorites);
        favoriteButtonsArray.forEach(button => {
            button.addEventListener('click', function () {
                const adId = button.querySelector('img').id;
                favorites(adId);
            });
        });    
}

//Εδώ στέλνουμε τα δεδομένα στον server για αποθήκευση.
//το adId είναι το αντίστοιχο id για κάθε καρδιά που δημιουργήσαμε 
//To στέλνουμε σε μια συνάρτηση και μας γυρνάει ένα αντικείμενο.
//Έπειτα κάνουμε fetch στον server , και άμα πληροί τις προύποθέσεις 
//Ο server κάνει προσθήκη στα αγαπημένα και εμείς εμφανίζουμε καρδιά
//Αλλιώς εμφανίζουμε σφάλμα για σύνδεση χρήστη , το οποίο θα εξαφανιστεί μόνο αν συνδεθεί κάποιος.
function favorites(adId){
    const correspondingAdd = adId.match(/\d+/);
    console.log(correspondingAdd[0]);

    const data=favoriteArticle(correspondingAdd[0]);
    const jsonData = JSON.stringify(data);

    fetch('/addToFavorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                heartImage = document.getElementById(`${adId}`);
                if (heartImage.src.endsWith('/heart.png')) {
                    heartImage.src = '../png/heart_red.png';
                } else {
                    heartImage.src = '../png/heart.png';
                }
            }
        })
        .catch(error => {
            console.log(`error${correspondingAdd}`)
            let errorMessage=document.getElementById(`error${correspondingAdd}`)
            errorMessage.textContent='Συνδεθείτε για προσθήκη στα αγαπημένα';
            
            console.error('ΗΤΤΡ:', error.message);            
        });
    
}

//Mε βάση ποιά καρδιά πατήθηκε , διαλέγουμε και την αντίστοιχη 
//αγγελία και δημιουργούμε ένα αντικείμενο με τα χαρακτηριστικά που
//ζητώνται , τα οποία θα σταλούν στον server.
function favoriteArticle(index) {

    let section = document.getElementById('ads-articles');
    const selected = document.getElementById(index);

    const id=index;
    const titleElement=selected.querySelector('header h1');
    const paragraphElement = selected.querySelector('p');
    const costElement=selected.querySelector('p+span')
    const imgElement = selected.querySelector('header>img');

    const data = {
        id: id,
        title: titleElement.textContent.trim(),
        description: paragraphElement.textContent.trim(),
        cost: costElement.textContent.trim(),
        imgSrc: imgElement.getAttribute('src').trim(),
        username:window.username,
        sessionId:window.sessionId,
    };
    
    console.log(data);
    return data;

}


//Η init μας , που εκτελείται στο onload.
function init() {
    // Ακολουθεί στα σχόλια ένας τρόπος παραλαβής του url
    urlString = window.location.href;
    console.log("Url : " + urlString)

    // αρχικοποιήση μιας μεταβλητης που δέχεται τα query parameteres
    queryString = window.location.search;

    // χρησιμοποιούμε την URLSearchParams με σκοπό να μπορούμε να χρησιμοποιήσουμε τα params
    params = new URLSearchParams(queryString);

    // τυπώνουμε το id της κατηγορίας για debugging

    if (params.size == 0) {
        httpGetRequestIndex("https://wiki-ads.onrender.com/categories", "https://wiki-ads.onrender.com/subcategories", handleResult)
    } else if((urlString.includes("subcategory"))||(urlString.includes("category"))) {
        if (urlString.includes("subcategory")) {
            console.log("subcategory id : " + params.get('id'))
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`, handleSubcategoryResult)
        } else {
            console.log("category id : " + params.get('id'))
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`, handleCategoryResult)
        }
    }
    else{
        console.log('username ',params.get('username'),' session id' ,params.get('sessionId'));
        let UserSession={username:params.get('username'),sessionId:params.get('sessionId')}
        console.log(UserSession);
        httpGetFavoriteForUser(UserSession);
    }


    //Όταν στείλει τα δεδομένα ο χρήστης για σύνδεση , καλούμε την connect user.
    document.getElementById('registrationForm').addEventListener('submit', connect_user);

}







