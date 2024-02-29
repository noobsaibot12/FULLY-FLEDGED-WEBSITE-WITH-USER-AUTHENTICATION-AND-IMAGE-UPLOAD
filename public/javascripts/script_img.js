const search_form = document.getElementById('search_form');
const search_box = document.getElementById('search_box');
const search_result = document.getElementById('search_result');
const show_more_btn = document.getElementById('show_more_btn');

let api_key = 'JcWoG5FLj_gwb5FcmL-gaUKu9o54COhS5iX4_LNLukU';

let keyword = '';

let page = 1;

async function search_images(){
    keyword = search_box.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${api_key}&per_page=12`;
    const responce = await fetch(url);
    const data = await responce.json();
    if(page === 1){
        search_result.innerHTML = "";
    }
    const results = data.results;
    results.map((result) => {
        const image = document.createElement('img');
        image.src = result.urls.small;
        const image_link = document.createElement('a');
        image_link.href = result.links.html;
        image_link.target = '_blank';

        image_link.appendChild(image);
        search_result.appendChild(image_link);

        show_more_btn.style.display ='block';
    })
}

search_form.addEventListener("submit",(e) => {
    e.preventDefault();
    page = 1;
    search_images();
})

show_more_btn.addEventListener("click", ()=>{
    page++;
    search_images();
})