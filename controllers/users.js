// Este fichero tiene las consultas a la bbdd
const models = require('../models');  // conexión a la bbdd
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const CONN = require('../helpers/dbConnection');

// Registra un nuevo usuario en la bbdd
function register(usuario, email, password) {
    return new Promise( async(resolve, reject) => {
        let msg = await validateMsg(usuario, email, password);
        if (msg == "") {
            // La liberería bcrypt nos encripta la contraseña. Le indicamos las rondas de encriptación
            let hash = await bcrypt.hash(password, SALT_ROUNDS);
            let user = {
                usuario,
                password: hash,
                email,
                rol: 'usuario'
            }
                // await models.usuarios.Create(user);
                //sequelize.query(`INSERT INTO usuarios VALUES (${usuario}, ${hash}, ${email}, rol: "usuario"`);
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

// Comprueba si el usuario tiene registro en la bbdd. Si lo tiene devuelve el usuario y si no null
function checkRegister(email, password) {
    return new Promise((resolve, reject) => {
        let row = models.usuarios.findAll({where: {email: email}});
        if (row.length === 0) {
            resolve(null);
        }else {
            // Compara contraseña introducida con la contraseña de la bbdd
            bcrypt.compare(password, row[0].password, (err, match) => {
                resolve( match ? row[0] : null);
            });
        }
    });
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
async function getData(email) {
    let row = await models.usuarios.findAll({where: {email: email}});
    return row;
}

// Devuelve el rol del usuario
async function isAdmin(email) {
    let row = await models.usuarios.findAll({where: {email: email}});
    return (row[0].rol == "administrador" ? true: null);
}

// Añade un viaje y lo devuelve
async function addTravel(travel) {
    try {
        await models.viajes.Create(travel);
        return null;
    }catch(err) {
        return true;
    }
}

module.exports = {
    checkRegister,
    register,
    getData,
    isAdmin,
    addTravel
}
