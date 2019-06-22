window.addEventListener('load', () => btnSubmit.addEventListener('click', validFields));

function validFields() {
    let email = document.getElementsByName('email')[0].value;
    let msg = "";
    if (!validEmail(email)) {
        msg = "Email incorrecto";
    }
    if (msg != "") {
        document.getElementById('msgError').innerText = msg;
    }else {
        document.forms[0].submit();
    }
}
