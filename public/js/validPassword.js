function validPassword(password) {
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    return re.test(password);
}

