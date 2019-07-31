btnSubmit.addEventListener('click', validFields);

function validFields() {
    let email = document.getElementsByName('email')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let msg = "";
    if (!validEmail(email)) {
        msg = "Email incorrecto";
    }else if (password.length < 1) {
    // }else if (password.length < 5 || !validPassword(password)) {
        msg = "Contraseña incorrecta";
    }
    if (msg != "") {
        document.getElementById('msgError').innerText = msg;
    }else {
        let cart = localStorage.getItem("Cart");
        document.forms[0].cartStorage.value = cart;
        document.forms[0].submit();
    }
}
