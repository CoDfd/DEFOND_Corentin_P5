//Collection of the webpage URL into a string
const urlProductString = window.location.href;
//Converting the string into an URL
const urlProduct = new URL(urlProductString);
//Collecting the id of the product
const idProduct = urlProduct.searchParams.get('id');

//Initialization of the colors array
let colorsProduct = [];

//initialization of API request
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//call API request
fetch(`http://localhost:3000/api/products/${idProduct}`, requestOptions)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
        displayImgProduct(value);
        displayInfoProduct(value);
        displayColorsProduct(value);
        colorsProduct = value.colors;
        addToCart(value);
    })
    .catch(function(err) {
        console.log(`Erreur`); // Une erreur est survenue
        alert(`Erreur de requête API`);
    });

//Display of the image of the product
function displayImgProduct (canap){
    let img = document.createElement(`img`);
    img.setAttribute(`src`,`${canap.imageUrl}`);
    img.setAttribute(`alt`,`${canap.altTxt}`);
    document.querySelector('div.item__img').appendChild(img);
}

//Display of the informations of the product
function displayInfoProduct (canap){
    document.getElementById(`title`).innerText = canap.name;
    document.getElementById(`price`).innerText = canap.price;
    document.getElementById(`description`).innerText = canap.description;
}

//Filling the colors options
function displayColorsProduct (canap){
    let colorsOption = document.getElementById(`colors`);
    const colors = canap.colors ;
    let options = colors.map(color => {
        let option = document.createElement('option');
        option.setAttribute(`value`,color);
        option.textContent = color;
        return option;
    });
    colorsOption.append(...options);
}

//Add to Cart : add in the local storage the item to cart. Does not return anything
function addToCart (canap){
    const btn = document.getElementById('addToCart');
    btn.addEventListener('click',function(){
        modifyCart(canap);
        });
}

//Modify/add the cart in the local storage
function modifyCart (canap) {
    //Collecting existing cart (if not, creating it) and emptying local storage
    let cart = collectCart(canap);
    console.log(cart);
    //Collecting data to add to cart
    const color = getSelectValue('colors');
    const number = parseInt(getInputValue('quantity'));
    //Modification of the cart
    cart.forEach(model => {
        if(model.couleur == color){
            model.nombre += number;
        }
    });
    //Convert cart and add to local storage
    localStorage.setItem(`${canap._id}`,`${JSON.stringify(cart)}`);
}

//Collecting existing cart of an identified item in local storage (if not, creating it) and emptying local storage
function collectCart (canap){
    //Initialization of the cart
    let cart = [];
    //Testing if there is not an existing cart for this canap
    if(localStorage.getItem(canap._id) == null){
        //Set up empty cart
        canap.colors.forEach(color => {
            let model = {
                couleur : color,
                nombre : 0,
            };
            cart.push(model);                
        });
    } else {
        //collecting the existing cart in the local storage, then emptying it
        cart = JSON.parse(localStorage.getItem(`${canap._id}`));
        localStorage.removeItem(`${canap._id}`);
    }
    return cart;
    console.log(cart);
}

//Collecting the value option of a select
function getSelectValue (selectId){
	/**On récupère l'élement html <select>*/
	var selectElmt = document.getElementById(selectId);
	/**
	selectElmt.options correspond au tableau des balises <option> du select
	selectElmt.selectedIndex correspond à l'index du tableau options qui est actuellement sélectionné
	*/
	return selectElmt.options[selectElmt.selectedIndex].value;
}

//Collecting the value option of an input
function getInputValue (selectId){
	/**On récupère l'élement html <input>*/
	var selectElmt = document.getElementById(selectId);
	/**On retourne le champs value*/
	return selectElmt.value;
}

