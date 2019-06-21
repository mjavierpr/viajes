btnSubmit.addEventListener('click', validFields);

function validFields() {
	let fields = document.getElementsByClassName("fields");
	let arrFields = Array.prototype.slice.call(fields);
    let filled = arrFields.every(field => field.value.length > 0);
    let msg = "";
    if (filled) {
        let numFiles = document.getElementById("arrFiles").files.length;
        if (numFiles == 0) {
            msg = "* Debes seleccionar al menos una imagen";
        }else if (numFiles > 10) {
            msg = "* No puedes seleccionar más de 10 imágenes";
        }else {
            document.forms[0].submit();
        }
    }else {
        msg = "* No pueden haber campos vacíos";
    }
    document.getElementById('msgError').innerText = msg;
}

