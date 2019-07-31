let cart = localStorage.getItem("Cart");
let elemForm = document.getElementById("dynForm");
elemForm.cart.value = cart;
elemForm.submit();