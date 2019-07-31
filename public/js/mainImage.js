btnSubmit.addEventListener('click', validImg);

function validImg() {
    let radios = document.getElementsByName("mainImgId");
    let long = radios.length, radCheck = false; i = 0;
    while (!radCheck && i < long) {
        if (radios[i].checked) {
            radCheck = true;
        }
        i++;
    }
    if (radCheck) {
        document.forms[0].submit();
    }else {
        document.getElementById('msgError').innerText = "* Selecciona una imagen";
    }
}
