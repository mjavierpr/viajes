let elem;
for (elem of document.getElementsByName('role')) {
    elem.addEventListener('change', handleChangeRole);
}
for (elem of document.getElementsByName('active')) {
    elem.addEventListener('change', handleChangeActive);
}
for (elem of document.getElementsByName('sendMail')) {
    elem.addEventListener('click', handleClickMail);
}

async function handleChangeRole(event) {
    let select = event.currentTarget;
    let id = select.className;
    let rolIdIni = document.getElementById("rol" + id);
    if (select.value == "administrador") {
        select.style.fontWeight = rolIdIni.value == "administrador" ? "normal" : "bold";
    }else {
        select.style.fontWeight = rolIdIni.value == "administrador" ? "bold" : "normal";
    }
    let response = await fetch('http://localhost:3000/usuarios/lista/cambiar-rol/' + id + '/' + select.value);
    let data = await response.text();
    if (data == "ok") {
        document.getElementById('msgSuccess').innerText = "Usuario " + document.getElementById('user' + id).value + " ahora tiene rol de " + select.value;
    }else {
        document.getElementById('msgError').innerText = "No se ha podido realizar el cambio";
    }
}

async function handleChangeActive(event) {
    let select = event.currentTarget;
    let id = select.className;
    let actIdIni = document.getElementById("act" + id);
    if (select.value == "true") {
        select.style.fontWeight = actIdIni.value == "true" ? "normal" : "bold";
    }else {
        select.style.fontWeight = actIdIni.value == "true" ? "bold" : "normal";
    }
    let response = await fetch('http://localhost:3000/usuarios/lista/cambiar-activo/' + id + '/' + select.value);
    let data = await response.text();
    if (data == "ok") {
        document.getElementById('msgSuccess').innerText = "Usuario " + document.getElementById('user' + id).value + " ahora está " + (select.value == "true" ? "activo" : "inactivo");
    }else {
        document.getElementById('msgError').innerText = "No se ha podido realizar el cambio";
    }
}

async function handleClickMail(event) {
    event.preventDefault();
    let click = event.currentTarget;
    let id = click.className;
    let mail = document.getElementById("mail" + id).value;
    let response = await fetch('http://localhost:3000/usuarios/lista/enviar-mail/' + mail);
    let data = await response.text();
    if (data == "ok") {
        document.getElementById('msgSuccess').innerText = "Usuario " + document.getElementById('user' + id).value + " ha recibido email de recuperación de contraseña";
    }else {
        document.getElementById('msgError').innerText = "No se ha podido enviar email";
    }
}

