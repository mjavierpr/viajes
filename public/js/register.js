btnSubmit.addEventListener('click', validFields);

function validFields() {
    let usuario = document.getElementsByName('usuario')[0].value;
    let email = document.getElementsByName('email')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let msg = "";
    if (usuario.length < 4) {
        msg = "El nombre de usuario tiene que tener al menos 6 caracteres";
    }else if (!validEmail(email)) {
        msg = "El email no tiene un formato correcto";
    }else if (password < 5) {
        msg = "La contraseña debe tener un tamaño mínimo de 5 caracteres";
    }else if (!validPassword(password)) {
        msg = "La contraseña debe tener al menos 1 número, una letra minúscula y una mayúscula";        
    }
    if (msg != "") {
        document.getElementById('msgError').innerText = '*' + msg;
    }else {
        document.forms[0].submit();
    }
}

function validEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validPassword(password) {
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    return re.test(password);
}
