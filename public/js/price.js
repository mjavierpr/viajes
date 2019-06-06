putDot("precio");
putDot("descuento");
function putDot(classname) {
    let elems = document.getElementsByClassName(classname);
    for (elem of elems) {
        let price = elem.innerText;
        if (price.length > 3) {
            price = price.slice(0, 1) + '.' + price.slice(1);
        }
        elem.innerText = price + " €";
    }
}
