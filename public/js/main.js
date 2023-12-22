const wikiads='https://wiki-ads.onrender.com';

let myHeaders = new Headers();
myHeaders.append('Accept','application/json')

let initObject ={
    method : 'GET',
    headers: myHeaders
}
/*
function handleFetch(url){
    

}
*/

function httpGetRequestIndex(url,url1,callback){
    fetch(url,initObject)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(categories =>{
        fetch(url1,initObject)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data =>callback(categories,data,null))
        .catch(error => {
            console.error('Fetch error:', error);
        });

    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

    
}

 function httpGetRequestCategorySubcategory(url,callback){
    fetch(url,initObject)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(ads=>callback(ads,null))
    .catch(error => {
        console.error('Fetch error:', error);
    });
 }


console.log("The data are :")

// Η μεταβλητή categories είναι οι 4 γενικές κατηγορίες αγγέλιων που προσφέρονται απ΄ό wiki ads και η μεταβλη΄τή 
// subcategories παριστάνει ένα array με τις υποκατήγοριες των αγγέλιων

function handleResult(categories,subcategories, err){
    if(err !== null){
        console.log(err)
    }
    if (subcategories!== null){
        let articlesTemplateScript = document.getElementById('categories-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("categories-articles");

        console.log(categories)
        console.log(subcategories)
         
        for(let category of categories){
            category.Subcategories = subcategories.filter(subcategory => (category.id == subcategory.category_id))
        }

        console.log(categories)


        let sectionHtmlContent =templates.articlesSection({
            categories : categories,
        });
        articlesSection.innerHTML = sectionHtmlContent;
    }else{
        console.log("Data not found")
    }

}

function handleCategoryResult(ads , err){
    if(err !== null){
        console.log(err)
    }
    if (ads!== null){
        let articlesTemplateScript = document.getElementById('adsOfSelectedCategory-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("ads-articles");

        console.log(ads)

        let sectionHtmlContent =templates.articlesSection({
            HeadingStr : "Αποτελέσματα αναζήτησης",
            ads : ads,
        });
        articlesSection.innerHTML = sectionHtmlContent;
    }else{
        console.log("Data not found")
    }
}

// Συνάρτηση που διαχειρίζεται τις αγγελίες των υποκατηγορίων 
function handleSubcategoryResult(subcategoryAds,err){
    if(err !== null){
        console.log(err)
    }
    if (subcategoryAds!== null){
        //Εμφάνιση των subcategoryAds αντικειμένου για debugging
        
        console.log(subcategoryAds)
        console.log(subcategoryAds.features)

        let articlesTemplateScript = document.getElementById('adsOfSelectedSubCategory-template').textContent;
        window.templates = {};
        window.templates.articlesSection = Handlebars.compile(articlesTemplateScript);

        let articlesSection = document.getElementById("subcategory-ads-articles");
        
        //Τα feature δίνονται ως strings. Τα κόβουμε όπου δούμε ερωτηματικό
        //Και δημιουργούμε ένα νέο αντικείμενο για κάθε αγγελία 
        subcategoryAds.forEach(function(subcategoryAds) {
            let featureArray = subcategoryAds.features.split(';');
            let featuresObject = {};
            featureArray.forEach(function(feature) {
              let keyValue = feature.split(':');
              let key = keyValue[0].trim();
              let value = keyValue[1] ? keyValue[1].trim() : '-';
              featuresObject[key] = value;
            });
            subcategoryAds.features = featuresObject;
          });

        let sectionHtmlContent =templates.articlesSection({
            //Εδώ βάζουμε ΄τα ορίσματα για το handlebar
            ads:subcategoryAds,
            HeadingStr:'Aποτελέσματα αναζήτησης: '
        });
        articlesSection.innerHTML = sectionHtmlContent;
    }else{
        console.log("Data not found")
    }
}


let urlString;
let queryString;
let params;
window.addEventListener('load', init);


function init(){
    // Ακολουθεί στα σχόλια ένας τρόπος παραλαβής του url
    urlString = window.location.href;
    console.log("Url : "+ urlString)

    // αρχικοποιήση μιας μεταβλητης που δέχεται τα query parameteres
    queryString = window.location.search;
    
     // χρησιμοποιούμε την URLSearchParams με σκοπό να μπορούμε να χρησιμοποιήσουμε τα params
    params = new URLSearchParams(queryString);   
    
    // τυπώνουμε το id της κατηγορίας για debugging

    if (params.size == 0){
        httpGetRequestIndex("https://wiki-ads.onrender.com/categories","https://wiki-ads.onrender.com/subcategories",handleResult)
    }else{
        if(urlString.includes("subcategory")){
            console.log("subcategory id : "+params.get('id')) 
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`,handleSubcategoryResult)
        }else{
            console.log("category id : "+params.get('id'))  
            httpGetRequestCategorySubcategory(`https://wiki-ads.onrender.com/ads?category=${params.get('id')}`,handleCategoryResult)
        }
    }
}

