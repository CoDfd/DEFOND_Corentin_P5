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
        displayCart(value);
        displayPrice(value);
        modifyQuantities(value);
        deleteItem(value);
        order();

        //envirronnement de test
        
        //fin de l'envirronnement de test

    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
        alert(`Erreur de requête API`);
    });

//Display function of the cart
function displayCart (canaps){
    //initializing the empty cart
    let emptyCart = true;
    let emptyMsgDisplay = false;
    //skim through the canaps    
    canaps.forEach(canap => {
        //Testing if there is not an existing cart for this canap
        if(localStorage.getItem(canap._id) != null){
            createArticlesCart(canap);
            if (emptyCart == true){
                emptyCart = false;
            }
        } 
    });
    //Display an empty cart if so
    if (emptyCart == true){
        let cart = document.getElementById(`cart__items`);
        let emptyMsg = document.createElement(`p`);
        emptyMsg.setAttribute(`id`,`emptyMessage`)
        emptyMsg.textContent = `Panier vide`;
        cart.appendChild(emptyMsg);
        emptyMsgDisplay = true;
    } else {
        //Case we have to remove the empty message
        if (emptyMsgDisplay == true){
            document.getElementById(`emptyMessage`).remove();
            emptyMsgDisplay = false;
        }
    }
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
                    quantity += parseInt(model.nombre);
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

//Modification of the quantities of items
function modifyQuantities (canaps){
    const cartTotal = document.getElementsByClassName(`cart__item`);
    //parcours du panier affiché
    for (let item of cartTotal) {
        //on récupère l'id et la couleur
        const itemId = item.dataset.id;
        const itemColor = item.dataset.color;
        //on écoute l'évennement de modification du champs value
        const inputQte = item.querySelector(`input[name='itemQuantity']`);
        inputQte.addEventListener('change',function(event){
            //Collecting the cart from local storage
            let cart = JSON.parse(localStorage.getItem(itemId));
            //Modification of the cart
            cart.forEach(model => {
                if(model.couleur === itemColor){
                    model.nombre = event.target.value;
                }
            });
            //Convert cart and add to local storage
            localStorage.setItem(itemId,`${JSON.stringify(cart)}`);
            //update total price
            displayPrice(canaps);
        });
    }    
}

//Deleting an item from the cart
function deleteItem (canaps){
    let cartTotal = document.getElementsByClassName(`cart__item`);
    //parcours du panier affiché
    for (let item of cartTotal) {
        //on récupère l'id et la couleur
        const itemId = item.dataset.id;
        const itemColor = item.dataset.color;
        //on écoute l'évennement de modification du champs value
        const itemDlt = item.querySelector(`.deleteItem`);
        itemDlt.addEventListener('click',function(){
            //Collecting the cart from local storage
            let cart = JSON.parse(localStorage.getItem(itemId));
            //Modification of the cart
            let shouldIDelete = 0;
            cart.forEach(model => {
                if(model.couleur === itemColor){
                    model.nombre = 0;
                }
                shouldIDelete += parseInt(model.nombre);
            });
            //if cart empty, delete cart
            if (shouldIDelete === 0){
                localStorage.removeItem(itemId);
            } else {
                //Convert cart and add to local storage
                localStorage.setItem(itemId,`${JSON.stringify(cart)}`);
            }
            //update cart and total price
            item.remove();
            if (cartTotal.length === 0){
                let cart = document.getElementById(`cart__items`);
                let emptyMsg = document.createElement(`p`);
                emptyMsg.setAttribute(`id`,`emptyMessage`)
                emptyMsg.textContent = `Panier vide`;
                cart.appendChild(emptyMsg);
            }
            displayPrice(canaps);
        });
    } 
}

//Checking the validity of the form
function checkForm (){
    //Initializing the return response
    let returnResponse = false;
    //while(returnResponse === false){
        //initializing the checks
        let checkFirstName = false;
        let checkLastName = false;
        let checkAddress = false;
        let checkCity = false;
        let checkEmail = false;
        //Check of the first name field
        const firstName = getInputValue(`firstName`);
        if(firstName.match(/^[A-Za-z'-]{2}[A-Za-z' -]+$/)){
            document.getElementById(`firstNameErrorMsg`).textContent = ` `;
            checkFirstName = true; 
        } else {
            document.getElementById(`firstNameErrorMsg`).textContent = `Veuillez entrer un prénom valide`;
            checkFirstName = false;
        }
        //Check of the last name field
        const lastName = getInputValue(`lastName`);
        if(lastName.match(/^[A-Za-z'-]{2}[A-Za-z' -]+$/)){
            document.getElementById(`lastNameErrorMsg`).textContent = ` `;
            checkLastName = true;
        } else {
            document.getElementById(`lastNameErrorMsg`).textContent = `Veuillez entrer un nom valide`;
            checkLastName = false;
        }
        //Check of the address field
        const address = getInputValue(`address`);
        if(address.match(/^.+[0-9]{5}$/)){
            document.getElementById(`addressErrorMsg`).textContent = ` `;
            checkAddress = true;
        } else {
            document.getElementById(`addressErrorMsg`).innerHTML = `Veuillez entrer une adresse de la forme <br> "18 rue de l'étoile 75001"`;
            checkAddress = false;
        }
        //Check of the city field
        const city = getInputValue(`city`);
        if(city.match(/^[A-Za-z][A-Za-z']+/)){
            document.getElementById(`cityErrorMsg`).textContent = ` `;
            checkCity = true;
        } else {
            document.getElementById(`cityErrorMsg`).textContent = `Veuillez entrer un nom de ville valide`;
            checkCity = false;
        }
        //Check of the email field
        const email = getInputValue(`email`);
        if(email.match(/^.+@.+[.][A-Za-z]+$/)){
            document.getElementById(`emailErrorMsg`).textContent = ` `;
            checkEmail = true;
        } else {
            document.getElementById(`emailErrorMsg`).textContent = `Veuillez entrer une adresse e-mail valide`;
            checkEmail = false;
        }
        //Calculating the response
        if(checkFirstName && checkLastName && checkAddress && checkCity && checkEmail){
            returnResponse = true;
        }
        console.log(returnResponse);
    //}
    return returnResponse;
}

//Collecting the data of the form
function getContact (contact){
    contact.firstName = getInputValue(`firstName`);
    console.log(`step`);
    contact.lastName = getInputValue(`lastName`);
    contact.address = getInputValue(`address`);
    contact.city = getInputValue(`city`);
    contact.email = getInputValue(`email`);
}

//Catch order
function order (){
    let contact = {}
    const orderBtn = document.getElementById('order');
    orderBtn.addEventListener('click',function(){
        if(checkForm()){
            getContact(contact);
            console.log(contact);
            localStorage.setItem(`contact`,JSON.stringify(contact));
            //getcart
        } else {
            alert(`Formulaire invalide ou incomplet`);
        }
        });
}

//Collecting the value option of an input
function getInputValue (selectId){
	/**On récupère l'élement html <input>*/
	var selectElmt = document.getElementById(selectId);
	/**On retourne le champs value*/
	return selectElmt.value;
}


//J'en suis à la ligne 339 : récupérer le cart sous forme d'array de string avec les product_id