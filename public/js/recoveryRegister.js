btnSubmit.addEventListener('click', validFields);

function validFields() {
    let password = document.getElementsByName('password')[0].value;
    let password2 = document.getElementsByName('password2')[0].value;
    let msg = "";
    if (password < 5) {
        msg = "La contraseña debe tener un tamaño mínimo de 5 caracteres";
    }else if (!validPassword(password)) {
        msg = "La contraseña debe tener al menos 1 número, una letra minúscula y una mayúscula";
    }else if (password !== password2) {
        msg = "Las contraseñas no coinciden";    
    }
    if (msg !== "") {
        document.getElementById('msgError').innerText = msg;
    }else {
        document.forms[0].submit();
    }
}
