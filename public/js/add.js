btnSubmit.addEventListener('click', validFields);

function validFields() {
    let destiny = document.getElementsByName('destino')[0].value;
    let price = document.getElementsByName('precio')[0].value;
    let discount = document.getElementsByName('descuento')[0].value;
    let url_img = document.getElementsByName('ruta_imagen')[0].value;
    let date_ini = document.getElementsByName('fecha_inicio')[0].value;
    let date_end = document.getElementsByName('fecha_fin')[0].value;
    let descript = document.getElementsByName('descripcion')[0].value;
    let arrFields = [destiny, price, discount, url_img, date_ini, date_end, descript];
    let filled = arrFields.every(field => field.length > 0);
    if (filled) {
        document.forms[0].submit();
    }else {
        document.getElementById('msgError').innerText = "* No pueden haber campos vacíos";
    }
}
