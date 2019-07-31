btnSubmit.addEventListener('click', buyTravels);
let prizes = document.getElementsByClassName("prize");
let arrPrizes = Array.prototype.slice.call(prizes).map(v => Number(v.innerText));
let total = arrPrizes.reduce((prev, cur) => prev + cur);
document.getElementById('total').innerText = total + " €";

function buyTravels() {
    if (document.forms[0].isSession == "yes") {
        window.location.href = "http://localhost:3000/viajes/compra";
    }else {
        window.location.href = "http://localhost:3000/usuarios/login/compra";
    }
}