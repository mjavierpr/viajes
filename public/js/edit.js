window.addEventListener('load', () => {
	btnSubmit.addEventListener('click', validFields);
	document.getElementsByName("newOrChoose")[0].addEventListener('change', disableOrNot);
	document.getElementsByName("newOrChoose")[1].addEventListener('change', disableOrNot);
});

function validFields() {
	let fields = document.getElementsByClassName("fields");
	let arrFields = Array.prototype.slice.call(fields);
    let filled = arrFields.every(field => field.value.length > 0);
    let msg = "";
    if (filled) {
		document.forms[0].submit();
    }else {
        msg = "* No pueden haber campos vacíos";
    }
    document.getElementById('msgError').innerText = msg;
}

function disableOrNot() {
	if (document.getElementsByName("newOrChoose")[0].checked) {
		arrFiles.disabled = true;
	}else {
		arrFiles.disabled = false;
	}
}
