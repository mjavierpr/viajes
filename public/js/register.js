btnSubmit.addEventListener('click', validFields);

function validFields() {
    let usuario = document.getElementsByName('usuario')[0].value;
    let email = document.getElementsByName('email')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let password2 = document.getElementsByName('password2')[0].value;
    let msg = "";
    if (usuario.length < 4) {
        msg = "El nombre de usuario tiene que tener al menos 6 caracteres";
    }else if (!validEmail(email)) {
        msg = "El email no tiene un formato correcto";
    }else if (password < 5) {
        msg = "La contraseña debe tener un tamaño mínimo de 5 caracteres";
    }else if (!validPassword(password)) {
        msg = "La contraseña debe tener al menos 1 número, una letra minúscula y una mayúscula";
    }else if (password !== password2) {
        msg = "Las contraseñas no coinciden";    
    }
    if (msg != "") {
        document.getElementById('msgError').innerText = '*' + msg;
    }else {
        document.forms[0].submit();
    }
}
