let cart = document.forms[0].cart.value;
localStorage.setItem('Cart', cart);
if (document.forms[0].buy.value == "no") {
	window.location.href = "http://localhost:3000/";
} else {
	window.location.href = "http://localhost:3000/viajes/compra";
}
