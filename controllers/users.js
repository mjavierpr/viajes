// Este fichero tiene las consultas a la bbdd
const models = require('../models');  // conexión a la bbdd
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

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
            try {
                let newUser = await models.usuarios.create(user);
                resolve(newUser ? "" : "* No se ha podido cear nuevo usuario en la base de datos");
            }catch (error) {
                resolve("* Error al crear nuevo usuario en la base de datos");
            }
        }else {
            resolve(msg);
        }
    });
}

// Comprueba si el usuario tiene registro en la bbdd. Si lo tiene devuelve el usuario y si no null
function checkRegister(email, password) {
    return new Promise( async(resolve, reject) => {
        let row = await models.usuarios.findAll({where: {email: email}});
        if (row.length === 0) {
            resolve(null);
        }else {
            // Compara contraseña introducida con la contraseña de la bbdd
            bcrypt.compare(password, row[0].password, (err, match) => {
                resolve( match ? row[0].dataValues : null);
            })
        }
    })
}

async function validateMsg(usuario, email, password) {
    let msg = "";
    if (usuario.length < 4) {
        msg = "El nombre de usuario tiene que tener al menos 4 caracteres";
    }else if (!validEmail(email)) {
        msg = "El email no tiene un formato correcto";
    }else if (await existsUser(usuario)) {
        msg = "El nombre de usuario ya existe";
    }else if (await existsEmail(email)) {
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

// const sequelize = require('sequelize');
// async function existsField(fieldName, fieldValue) {
//     let row = sequelize.query(`SELECT * FROM usuarios WHERE ${fieldName} = ${fieldValue}`);
//     return (row.length > 0 ? true : false);
// }

async function existsUser(user) {
    let row = await models.usuarios.findAll({where: {usuario: user}});
    return (row.length > 0 ? true : false);
}

async function existsEmail(email) {
    let row = await models.usuarios.findAll({where: {email: email}});
    return (row.length > 0 ? true : false);
}

// Devuelve los datos del usuario
async function getData(email) {
    let row = await models.usuarios.findAll({where: {email: email}});
    return row;
}

// Añade un viaje y lo devuelve
async function addTravel(travel) {
    try {
        let newTravel = await models.viajes.create(travel);
        return newTravel ? true : null;
    }catch(err) {
        return null;
    }
}

module.exports = {
    checkRegister,
    register,
    getData,
    addTravel
}
