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
        /*value.forEach(canap => {
            console.log(JSON.parse(localStorage.getItem(canap._id)));
        });*/
        displayCart(value);
        displayPrice(value);
        //modifyQuantity(value);
        //deleteItem(value);
    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
    });

//Display function of the cart
function displayCart (canaps){
    canaps.forEach(canap => {
        //Testing if there is not an existing cart for this canap
        if(localStorage.getItem(canap._id) != null){
            createArticlesCart(canap);
        }  
    });
}

//createArticlesCart : créer les articles et les insère dans un container
function createArticlesCart (canap){
    let containeritems = document.getElementById('cart__items');
    cart = JSON.parse(localStorage.getItem(canap._id));
    cart.forEach(model => {
        if(model.nombre > 0){
            let article = document.createElement(`article`);
            article.classList.add(`cart__item`);
            article.setAttribute(`data-id`,`${canap._id}`);
            article.setAttribute(`data-color`,model.couleur);
            const img = createImg(canap);
            const content = createContent(canap,model);
            article.append(img, content);
            containeritems.appendChild(article);
        }});
}

//CreateImg : doit retourner un élément complet image
function createImg (canap){
    let div = document.createElement(`div`);
    div.classList.add(`cart__item__img`);
    let img = document.createElement(`img`);
    img.setAttribute(`src`,`${canap.imageUrl}`);
    img.setAttribute(`alt`,`${canap.altTxt}`);
    div.appendChild(img);
    return div;
}

//createContent : doit retourner un élément complet content
function createContent (canap,model){
    let content = document.createElement(`div`);
    content.classList.add(`cart__item__content`);
    const description = createContentDescription(canap,model);
    const settings = createContentSettings(model);
    content.append(description, settings);
    return content;
}

//createContentDescription
function createContentDescription (canap,model){
    //création de l'élément
    let description = document.createElement(`div`);
    description.classList.add(`cart__item__content__description`);
    
    //création du contenu
    let name = document.createElement(`h2`);
    name.textContent = `${canap.name}`;
    let color = document.createElement(`p`);
    color.textContent = `${model.couleur}`;
    let price = document.createElement(`p`);
    price.textContent = `${canap.price}` + `,00 €`;

    //Remplissage de l'élément
    description.append(name,color,price);
    
    return description;
}


//createContentSettings
function createContentSettings (model){
    //création de l'élément
    let settings = document.createElement(`div`);
    settings.classList.add(`cart__item__content__settings`);
    
    //création du contenu
    let quantity = document.createElement(`div`);
    quantity.classList.add(`cart__item__content__settings__quantity`)
        let qte = document.createElement(`p`);
        qte.textContent = `Qté : `;
        let input = document.createElement(`input`);
        input.classList.add(`itemQuantity`);
        input.setAttribute(`type`,`number`);
        input.setAttribute(`name`,`itemQuantity`);
        input.setAttribute(`min`,`1`);
        input.setAttribute(`max`,`100`);
        input.setAttribute(`value`,`${model.nombre}`);
    quantity.append(qte,input);

    let dlt = document.createElement(`div`);
    dlt.classList.add(`cart__item__content__settings__delete`);
        let supprimer = document.createElement(`p`);
        supprimer.classList.add(`deleteItem`);
        supprimer.textContent = `Supprimer`;
    dlt.appendChild(supprimer);

    //Remplissage de l'élément
    settings.append(quantity,dlt);
    
    return settings;
}

//Display of the price of the total cart
function displayPrice (canaps){
    let quantity = 0;
    let price = 0;
    //collecting the informations of all the carts to calculate the total quantity and the total price
    canaps.forEach(canap => {
        //Testing if there is not an existing cart for this canap
        if(localStorage.getItem(canap._id) != null){
            let cart = JSON.parse(localStorage.getItem(canap._id));
            //collecting the informations of the cart to calculate the price
            cart.forEach(model => {
                if(model.nombre > 0){
                    quantity += model.nombre;
                    price += model.nombre * canap.price ;
                }});
            
        }  
    });
    //Display of the total quantity and the total price
    let totalQuantity = document.getElementById(`totalQuantity`);
    let totalPrice = document.getElementById(`totalPrice`);
    totalQuantity.textContent = `${quantity}`;
    totalPrice.textContent = `${price}` + `,00`;
}