const CONN = require('../helpers/dbConnection');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Registra un nuevo usuario en la bbdd
function register(usuario, email, password) {
    return new Promise( async(resolve, reject) => {
        let msg = validateMsg(usuario, email, password);
        if (msg == "") {
            // La liberería bcrypt nos encripta la contraseña. Le indicamos las rondas de encriptación
            let hash = await bcrypt.hash(password, SALT_ROUNDS);
            let user = {
                usuario,
                password: hash,
                email
            }
            CONN.query('INSERT INTO usuarios SET ?', [user], (err, row) => {
                if (err) {
                    msg = "Error al insertar usuario en la base de datos";
                }
                resolve(msg);
            });
        }else {
            resolve(msg);
        }
    });
}

// Comprueba si el usuario tiene registro en la bbdd. Si lo está devuelve el usuario y si no null
function checkRegister(email, password) {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
            if (row.length === 0) {
                resolve(null);
            }else {
                // Compara contraseña introducida con la contraseña de la bbdd
                bcrypt.compare(password, row[0].password, (err, match) => {
                    resolve( match ? row[0] : null);
                })
            }
        })
    })
}

async function validateMsg(usuario, email, password) {
    let msg = "";
    if (usuario.length < 4) {
        msg = "El nombre de usuario tiene que tener al menos 4 caracteres";
    }else if (!validEmail(email)) {
        msg = "El email no tiene un formato correcto";
    }else if (await existsField('usuario', usuario)) {
        msg = "El nombre de usuario ya existe";
    }else if (await existsField('email', email)) {
        msg = "El email ya existe";
    }else if (password < 5) {
        msg = "La contraseña debe tener un tamaño mínimo de 5 caracteres";
    }else if (!validPassword(password)) {
        msg = "La contraseña debe tener al menos 1 número, una letra minúscula y una mayúscula";
    }
    return msg;
}

function validEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
}

function validPassword(password) {
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    return re.test(password);
}

function existsField(fieldName, fieldValue) {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM usuarios WHERE ' + fieldName + ' = ?', [fieldValue], (err, row) => {
            resolve (row.length > 0 ? true: false);
        });
    });
}

// Devuelve los datos del usuario
function getData(email) {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
            resolve(row);
        })
    })
}

// Devuelve el rol del usuario
function isAdmin(email) {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
            resolve(row[0].rol == "administrador" ? true: null);
        })
    })
}

// Añade un viaje y lo devuelve
function addTravel(travel) {
    return new Promise((resolve, reject) => {
        CONN.query("INSERT INTO viaje SET ?", [travel], (error, rowNew) => {
            // CONN.query("SELECT * FROM viaje WHERE id = ?", [rowNew.insertId], (error, rowIns) => {
            resolve (error ? null : true);
        });
    })
}

module.exports = {
    checkRegister,
    register,
    getData,
    isAdmin,
    addTravel
}
