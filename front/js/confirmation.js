//Collection of the webpage URL into a string
const urlOrderString = window.location.href;
//Converting the string into an URL
const urlOrder = new URL(urlOrderString);
//Collecting the id of the order
const orderId = urlOrder.searchParams.get('id');

//Display of order ID number
let OrderIdDisplay = document.getElementById(`orderId`);
OrderIdDisplay.innerHTML = `<br>` + orderId;

//Emptying the local storage
localStorage.clear();