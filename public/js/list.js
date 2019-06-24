window.addEventListener('load', () => {
    let elem;
    for (elem of document.getElementsByName('rol')) {
        elem.addEventListener('change', handleChangeRole);
    }
    for (elem of document.getElementsByName('activo')) {
        elem.addEventListener('change', handleChangeActive);
    }
    for (elem of document.getElementsByClassName('chkbox')) {
        elem.addEventListener('change', handleChangeMail);
    }
    btnSubmit.addEventListener('click', sendForm);
});

function handleChangeRole(event) {
    let select = event.currentTarget;
    let rolIdIni = document.getElementById("rol" + select.className);
    if (select.value == "administrador") {
        select.style.fontWeight = rolIdIni.value == "administrador" ? "normal" : "bold";
    }else {
        select.style.fontWeight = rolIdIni.value == "administrador" ? "bold" : "normal";
    }
}

function handleChangeActive(event) {
    let select = event.currentTarget;
    let actIdIni = document.getElementById("act" + select.className);
    let sendMail = document.getElementById("mail" + select.className);
    if (select.value == "true") {
        select.style.fontWeight = actIdIni.value == "true" ? "normal" : "bold";
        sendMail.style.hidden = "true";
    }else {
        select.style.fontWeight = actIdIni.value == "true" ? "bold" : "normal";
        sendMail.style.display = "false";
    }
}

function handleChangeMail(event) {
    let chkbox = event.currentTarget;
    chkbox.value = chkbox.checked ? "send" : "no";
}

function sendForm() {
    document.forms[0].submit();
}
