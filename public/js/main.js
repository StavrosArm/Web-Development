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

function httpGetRequest(url,url1,callback){
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
            url:""
        });
        articlesSection.innerHTML = sectionHtmlContent;
    }else{
        console.log("Data not found")
    }

}

window.addEventListener('load', init);
function init(){
    httpGetRequest("https://wiki-ads.onrender.com/categories","https://wiki-ads.onrender.com/subcategories",handleResult)
}

