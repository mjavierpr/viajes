if (document.getElementById('numCart').innerText == "") {
	let cart = localStorage.getItem("Cart");
    cart = cart !== null && cart !== "undefined" ? JSON.parse(localStorage.getItem("Cart")) : [];
    let num = cart.length;
    document.getElementById('numCart').innerText = num;
}

