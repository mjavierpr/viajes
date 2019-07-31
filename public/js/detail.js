btnSubmit.addEventListener('click', lStorage);

function lStorage() {
    let cart = localStorage.getItem("Cart") !== null ? JSON.parse(localStorage.getItem("Cart")) : [];
    let item = {
        viajeId: document.forms[0].idTravel.value,
        personas: document.forms[0].persons.value
    };
    cart.push(item);
    localStorage.setItem("Cart", JSON.stringify(cart));
    document.forms[0].submit();
}