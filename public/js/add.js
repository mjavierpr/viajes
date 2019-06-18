btnSubmit.addEventListener('click', validFields);

function validFields() {
	let fields = document.getElementsByTagName('input');
	let arrFields = Array.prototype.slice.call(fields);
	let filled = arrFields.every(field => field.value.length > 0);
    if (filled) {
        document.forms[0].submit();
    }else {
        document.getElementById('msgError').innerText = "* No pueden haber campos vacíos";
    }
}

