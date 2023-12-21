const wikiads='https://wiki-ads.onrender.com';

fetch(`${wikiads}/categories`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Categories:', data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

fetch(`${wikiads}/subcategories`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`)
        }
        return res.json();
    })
    .then(subcategories=>{
        console.log('Subacategories:',subcategories);
    })



