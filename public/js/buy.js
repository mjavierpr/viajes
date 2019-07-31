let prizes = document.getElementsByClassName("prize");
let arrPrizes = Array.prototype.slice.call(prizes).map(v => Number(v.innerText));
let total = arrPrizes.reduce((prev, cur) => prev + cur);
document.getElementById('total').innerText = total + " €";
