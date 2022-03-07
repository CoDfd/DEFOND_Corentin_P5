/*//initialization of API request
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};*/


//Réacteur du programme

displayAll()
    .then((onResolved)=>{
        modifyQuantities();
        deleteItem();
        order();
    })
    .catch(function(err) {
        console.log(`Erreur d'affichage du panier`); // Une erreur est survenue
        alert(`Erreur d'affichage du panier`);
    });
    

//call API requests
async function getCanaps (){
    let catalogue;
    await fetch('http://localhost:3000/api/products/', {
        method: 'GET',
        headers: {
            "content-type" : "application/json",
        },
        redirect: 'follow'
    })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
        catalogue = value;
    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
        alert(`Erreur de requête API`);
    });
    return catalogue; 
}

async function getCanap (canapId){
    let canap;
    await fetch(`http://localhost:3000/api/products/${canapId}`, {
        method: 'GET',
        headers: {
            "content-type" : "application/json",
        },
        redirect: 'follow'
    })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
        canap = value;
    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
    });
    return canap;
}

//Display all
async function displayAll (){
    await displayCart();
    await displayPrice();
    //when the two previous functions are done, send back a Promise object that is resolved 
    return Promise.resolve();
}

//Display function of the cart
async function displayCart (){
    //initializing the empty cart
    let canaps = await getCanaps();
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
    /*//skim through the cart
    for (var i = 0; i < localStorage.length; i++) {
        //Testing if there is not an existing cart 
        if(localStorage.key(i) != null){
            let canap = getCanap(localStorage.key(i));
            createArticlesCart(canap);
            if (emptyCart == true){
                emptyCart = false;
            }
        }
    }*/
    //Display an empty cart message if so
    if (emptyCart == true){
        let cart = document.getElementById(`cart__items`);
        let emptyMsg = document.createElement(`p`);
        emptyMsg.setAttribute(`id`,`emptyMessage`)
        emptyMsg.textContent = `Panier vide`;
        cart.appendChild(emptyMsg);
        emptyMsgDisplay = true;
    } else {
        //Case we have to remove the empty cart message
        if (emptyMsgDisplay == true){
            document.getElementById(`emptyMessage`).remove();
            emptyMsgDisplay = false;
        }
    }
}

//Function to check if the cart is empty
function isCartEmpty (canaps){
    //initializing the empty cart
    let emptyCart = true;
    //skim through the canaps    
    canaps.forEach(canap => {
        //Testing if there is an existing cart for this canap
        if(localStorage.getItem(canap._id) != null){
            if (emptyCart == true){
                emptyCart = false;
            }
        } 
    });
    return emptyCart ; 
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
    //creation of the element
    let description = document.createElement(`div`);
    description.classList.add(`cart__item__content__description`);
    
    //setting of its content
    let name = document.createElement(`h2`);
    name.textContent = `${canap.name}`;
    let color = document.createElement(`p`);
    color.textContent = `${model.couleur}`;
    let price = document.createElement(`p`);
    price.textContent = `${canap.price}` + `,00 €`;

    //filling the element
    description.append(name,color,price);
    
    return description;
}

//createContentSettings
function createContentSettings (model){
    //creation of the element
    let settings = document.createElement(`div`);
    settings.classList.add(`cart__item__content__settings`);
    
    //setting of its content
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

    //filling the element
    settings.append(quantity,dlt);
    
    return settings;
}

//Display of the price of the total cart
 async function displayPrice (){
    let quantity = 0;
    let price = 0;
    //Collecting the informations of the cart
    for (var i = 0; i < localStorage.length; i++) {
        let cart = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let canap = await getCanap(localStorage.key(i));
        try {
            //collecting the informations of the cart to calculate the price
            cart.forEach(model => {
                if(model.nombre > 0){
                    quantity += parseInt(model.nombre);
                    price += model.nombre * canap.price ;
                }});
        } catch {
            //if the local storage outpu was not a cart, next in for
            continue;
        }
        
      }
    //Display of the total quantity and the total price
    let totalQuantity = document.getElementById(`totalQuantity`);
    let totalPrice = document.getElementById(`totalPrice`);
    totalQuantity.textContent = `${quantity}`;
    totalPrice.textContent = `${price}` + `,00`;
}

//Modification of the quantities of items
function modifyQuantities (){
    const cartTotal = document.getElementsByClassName(`cart__item`);
    //skimming through the diplaied cart
    for (let item of cartTotal) {
        //collecting id and color
        const itemId = item.dataset.id;
        const itemColor = item.dataset.color;
        //listening the event modification of the value field
        const inputQte = item.querySelector(`input[name='itemQuantity']`);
        inputQte.addEventListener('change',function(event){
            try {
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
                displayPrice();
            } catch {
                alert(`Impossible d'executer cette action`);
            }
        });
    }    
}

//Deleting an item from the cart
function deleteItem (){
    let cartTotal = document.getElementsByClassName(`cart__item`);
    //skimming through the displaied cart
    for (let item of cartTotal) {
        //collecting id and color
        const itemId = item.dataset.id;
        const itemColor = item.dataset.color;
        //listening the event of clicking on delete
        const itemDlt = item.querySelector(`.deleteItem`);
        itemDlt.addEventListener('click',function(){
            try {
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
                displayPrice();
            } catch {
                alert(`Impossible d'executer cette action`);
            }
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
    //}
    return returnResponse;
}

//Collecting the data of the form
function getContact (contact){
    contact.firstName = getInputValue(`firstName`);
    contact.lastName = getInputValue(`lastName`);
    contact.address = getInputValue(`address`);
    contact.city = getInputValue(`city`);
    contact.email = getInputValue(`email`);
}

//Catch order
async function order (){
    const canaps = await getCanaps();
    let contact = {}
    let products = [];
    const orderBtn = document.getElementById('order');
    orderBtn.addEventListener('click',function(event){
        event.preventDefault();
        if(checkForm()){
            getContact(contact);
            if (localStorage.length > 0){
// /!\ est-ce que je dois faire une fonction de check que l'array products est un array de string, et que ceux ci sont bien dans le catalogue?
                products = getCart();
                //localStorage.setItem(`order`,JSON.stringify(products));
            } else {
                alert(`Panier vide`);
            }
            //let orderToSend = {contact,products}
            //localStorage.setItem(`contact`,JSON.stringify(contact));
            sendOrder(contact,products);
        } else {
            alert(`Formulaire invalide ou incomplet`);
        }
        });
}

//get cart
function getCart (){
    //initializing the order array to return
    let order = [];
    //skim through the cart
    for (var i = 0; i < localStorage.length; i++) {
        try {
            order.push(localStorage.key(i));
        } catch {
            //if the local storage outpu was not a cart, next in for
            continue;
        }
    }
    //skim through the canaps    
    /*canaps.forEach(canap => {
        //Testing if there is an existing cart for this canap
        if(localStorage.getItem(canap._id) != null){
            order.push(canap._id);
        } 
    });*/
    return order;
}

//Collecting the value option of an input
function getInputValue (selectId){
	/**On récupère l'élement html <input>*/
	var selectElmt = document.getElementById(selectId);
	/**On retourne le champs value*/
	return selectElmt.value;
}

//Function that call the POST request
function sendOrder (contact, products){
    if(checkOrder(products)){
        let order = {contact,products}
        fetch("http://localhost:3000/api/products/order"  , {
            method: "POST",
            headers: {
                "content-type" : "application/json",
            },
            body : JSON.stringify(order),
            redirect: `follow`
        })
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(value) {
            let orderId = value.orderId;
            window.location.href= `./confirmation.html?id=${orderId}` ; 
        })
        .catch(function(err) {
            console.log(`Erreur`); // Une erreur est survenue
            alert(`Erreur de requête API`);
        });
    }
    else {
        alert('Erreur : la commande ne peut aboutir');
    }
}

//check order
async function checkOrder (products){
    let check = true;
    let catalogueId = [];
    const canaps = await getCanaps();
    canaps.forEach(canap => {
        catalogueId.push(canap._id);
    });
    /*products.forEach(product => {
        if(catalogueId.includes(product) === false){
            check = false;
            break;
        }
    });*/
    let i = 0;
    while (i < products.length){
        if(typeof(products[i]) === 'string' && catalogueId.includes(products[i])){
            i ++;
        } else {
            check = false;
            break;
        }
    }
    return check;
}
