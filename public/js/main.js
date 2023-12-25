const wikiads = 'https://wiki-ads.onrender.com';
const server = 'http://localhost:8080'
let myHeaders = new Headers();
myHeaders.append('Accept', 'application/json')


let initObject = {
    method: 'GET',
    headers: myHeaders
}
/*
function handleFetch(url){
    

}
*/

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
            HeadingStr: "Αποτελέσματα αναζήτησης",
            ads: ads,
        });
        articlesSection.innerHTML = sectionHtmlContent;
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
            //Εδώ βάζουμε ΄τα ορίσματα για το handlebar
            ads: subcategoryAds,
            HeadingStr: 'Aποτελέσματα αναζήτησης: '
        });
        articlesSection.innerHTML = sectionHtmlContent;
        createEventListeners();
    } else {
        console.log("Data not found")
    }
}

//H σύνδεση του χρήστη , που γίνεται triggered με submit στην φόρμα.
function connect_user(event) {
    //σταματάμε την φόρμα απο την υποβολή 
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    //Παίρνουμε τις τιμές και κάνουμε print για λόγους debugging.
    console.log('Username:', username);
    console.log('Password:', password);

    //Φτιάχνουμε το json και το στέλνουμε στον server.
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
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const signIn=document.getElementById('sign-in');

            console.log(data.success);
            //Ο server μας γυρνάει ένα success ανάλογα με τι έγινε
            //Άμα είναι true , παίρνει το username , και εμφανίζει κατάλληλο κείμενο 
            //Καλωσόρισες
            if (data.success){
                signIn.style.display='none';
                
                const welcome=document.getElementById('welcome')
                welcome.textContent=`Kαλωσόρισες, ${data.username}!`
            }
            //Άμα είναι false , εμφανίζει ένα μήνυμα ότι δεν έχετε εγγραφεί ως χρήστης
            else{
                const not_regi=document.getElementById('not-registered');
                not_regi.style.display = 'block';
            }
        })
        .catch(err => {
            console.error('Error: ', err);
        })
}


//Eίναι το onclick , για τα favorites. μόλις πατάς την καρδιά 
//αλλάζει σε κόκκινη , και καλεί την συνάρτηση που γράφει στον server ποιά αγγελία 
//πάτησε.
function favorites(adId){
    heartImage=document.getElementById(`${adId}`);
     
    console.log(`${adId}`)
    if (heartImage.src.endsWith('/heart.png')) {
        heartImage.src = '../png/heart_red.png';
        //Eδώ θα μπει το fetch και ο έλεγχος για σύνδεση.
        //sendFavoritesToServer(adId);
      } else {
        heartImage.src = '../png/heart.png';
      }

    
}

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


let urlString;
let queryString;
let params;
window.addEventListener('DOMContentLoaded', init);


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
    } else {
        if (urlString.includes("subcategory")) {
            console.log("subcategory id : " + params.get('id'))
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`, handleSubcategoryResult)
        } else {
            console.log("category id : " + params.get('id'))
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`, handleCategoryResult)
        }
    }

    //Όταν στείλει τα δεδομένα ο χρήστης για σύνδεση , καλούμε την connect user.
    document.getElementById('registrationForm').addEventListener('submit', connect_user);

}




