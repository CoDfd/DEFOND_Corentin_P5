//initialization of API request
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//call API request
fetch('http://localhost:3000/api/products/', requestOptions)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
        afficheProduct(value);
    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
        alert(`Erreur de requête API`);
    });

//Display of products : inside request
function afficheProduct (canaps){
    let displayCatalogue = document.getElementById('items');
    canaps.forEach(canap => {
        let canapArticle = createArticle(canap);
        displayCatalogue.appendChild(canapArticle);  
    });
}

//Function that creates the HTML structure of each sofa article
function createArticle (canap){
    let article = document.createElement(`article`);
    const img = createImg(canap);
    const name = createName(canap);
    const description = createDescription(canap); 
    article.append(img, name, description);

    const link = createLink (canap);
    link.appendChild(article);

    return link;
}

//Function that creates the HTML img element of each sofa
function createImg (canap){
    let img = document.createElement(`img`);
    img.setAttribute(`src`,`${canap.imageUrl}`);
    img.setAttribute(`alt`,`${canap.altTxt}`);
    return img;
}

//Function that creates the HTML name element of each sofa
function createName (canap){
    let name = document.createElement(`h3`);
    name.classList.add(`productName`);
    name.textContent = `${canap.name}`;
    return name;
}

//Function that creates the HTML description element of each sofa
function createDescription (canap){
    let description = document.createElement(`p`);
    description.classList.add(`productDescription`);
    description.textContent = `${canap.description}`;
    return description;
}

//Function that creates the HTML link element of each sofa
function createLink (canap){
    let link = document.createElement(`a`);
    link.setAttribute(`href`,`./product.html?id=${canap._id}`);
    return link;
}

