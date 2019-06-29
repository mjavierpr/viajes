const models = require('../models');  // conexión a la bbdd
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const emailUtils = require('../utils/email');
const Server = 'http://localhost:3000';

function register(usuario, email, password) {
    return new Promise(async (resolve, reject) => {
        let msg = await validateMsg(usuario, email, password);
        if (msg == "") {
            try {
                // La liberería bcrypt nos encripta la contraseña. Le indicamos las rondas de encriptación
                let hash = await bcrypt.hash(password, SALT_ROUNDS);
                let newUser = await models.usuarios.create({
                    usuario,
                    password: hash,
                    email
                    // campos rol y activo tienen valores por defecto
                }, {
                        include: [models.confirmaciones]
                    });
                resolve(newUser ? "" : "No se ha podido cear nuevo usuario en la base de datos");
            } catch (error) {
                resolve("Error al crear nuevo usuario en la base de datos");
            }
        } else {
            resolve(msg);
        }
    });
}

function checkRegister(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let row = await models.usuarios.findAll({ where: { email: email } });
            if (row.length === 0) {
                resolve("Usuario no encontrado");
            } else {
                // usuario confirmado
                if (row[0].activo) {
                    // Compara contraseña introducida con la contraseña de la bbdd
                    bcrypt.compare(password, row[0].password, (err, match) => {
                        resolve(match ? row[0].dataValues : "La contraseña es incorrecta");
                    })
                } else {
                    resolve("Usuario pendiente de confirmar");
                }
            }
        } catch {
            resolve("Se ha producido un error");
        }
    });
}

async function validateMsg(usuario, email, password) {
    let msg = "";
    if (usuario.length < 4) {
        msg = "El nombre de usuario tiene que tener al menos 4 caracteres";
    } else if (!validEmail(email)) {
        msg = "El email no tiene un formato correcto";
    } else if (await existsUser(usuario)) {
        msg = "El nombre de usuario ya existe";
    } else if (await existsEmail(email)) {
        msg = "El email ya existe";
    } else if (password < 5) {
        msg = "La contraseña debe tener un tamaño mínimo de 5 caracteres";
    } else if (!validPassword(password)) {
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
    let row = await models.usuarios.findAll({ where: { usuario: user } });
    return (row.length > 0 ? true : false);
}

async function existsEmail(email) {
    let row = await models.usuarios.findAll({ where: { email: email } });
    return (row.length > 0 ? true : false);
}

async function getUser(email) {
    try {
        let user = await models.usuarios.findAll({ where: { email: email } });
        return user;
    } catch {
        return null;
    }
}

async function emailConfirmation(email) {
    try {
        let keyLink = emailUtils.generateKeylink();
        let msg = await emailUtils.sendEmail(email, 'confirmation', 'Viajes - Confirmación', "Pincha este enlace", Server + '/usuarios/confirmar-email/' + keyLink);
        if (msg) {
            let user = await models.usuarios.findAll({ where: { email: email } });
            let userId = user[0].id;
            msg = await models.confirmaciones.create({
                usuarioId: userId, clave: keyLink
            });
        }
        return msg ? "" : "Se ha producido un error";
    } catch {
        return "Error al tratar de enviar email de confirmación";
    }
}

async function existsKeyConfirmation(key) {
    try {
        let row = await models.confirmaciones.findAll({ where: { clave: key } });
        return (row.length ? row : null);
    } catch {
        return "Error al acceder a la base de datos";
    }
}

async function activateUser(userId) {
    try {
        let user = await models.usuarios.update(
            { activo: '1' },
            { where: { id: userId } }
        );
        // Borra la clave de la tabla confirmaciones
        await models.confirmaciones.destroy({ where: { usuarioId: userId } });
        return (user.length ? true : false);
    } catch {
        return false;
    }
}

async function emailRecovery(email) {
    let msg = "";
    try {
        let keyLink = emailUtils.generateKeylink();
        let newMail = await emailUtils.sendEmail(email, 'recovery', 'Viajes - Recuperación', "Pincha este enlace", Server + '/usuarios/recuperar-datos/cambiar-consigna/' + keyLink);
        if (newMail) {
            let user = await models.usuarios.findAll({ where: { email: email } });
            if (user.length) {
                let userId = user[0].id;
                let newKey = await models.recuperaciones.create({
                    usuarioId: userId,
                    clave: keyLink
                });
                if (!newKey) {
                    msg = "Error al acceder a la base de datos";
                }
            } else {
                msg = "El email no existe en la base de datos";
            }  
        }else {
            msg = "Error al enviar email";
        }
    } catch {
        msg = "Se ha producido un error";
    }
    return msg;
}

async function existsKeyRecovery(key) {
    try {
        let row = await models.recuperaciones.findAll({ where: { clave: key } });
        return (row.length ? row : null);
    } catch {
        return "Error al acceder a la base de datos";
    }
}

function updatePassword(userId, newPass) {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hash(newPass, SALT_ROUNDS);
            let user = await models.usuarios.update(
                { password: hash },
                { where: { id: userId } }
            );
            // Borra la clave de la tabla confirmaciones
            await models.recuperaciones.destroy({ where: { usuarioId: userId } });
            resolve(user ? "" : "No se ha podido cambiar la contraseña");
        } catch {
            resolve("Error al cambiar la contraseña");
        }
    });
}

async function getUsers() {
    try {
        let users = await models.usuarios.findAll();
        return users;
    } catch {
        return null;
    }
}

function usersMap(users) {
    return users.map(user => {
        return {id: user.id, usuario: user.usuario, email: user.email,
          selectAdmin: user.rol == "administrador" ? "selected" : "",
          selectUser: user.rol == "usuario" ? "selected" : "",
          selectActiv: user.activo == true ? "selected" : "",
          selectInactiv: user.activo == false ? "selected" : "",
          rolIni: user.rol,
          actIni: user.activo,
        }
      }
    );
}

async function changeRol(userId, newRole) {
    try {
        await models.usuarios.update(
            { rol: newRole},
            { where: { id: userId } }
        );
        return 'ok';
    }catch {
        return null;
    }
}

async function changeActive(userId, newActiv) {
    try {
        await models.usuarios.update(
            { activo: newActiv},
            { where: { id: userId } }
        );
        return 'ok';
    }catch {
        return null;
    }
}

async function emailRecovery2(email) {
    try {
        msg = await emailRecovery(email);
        return msg == "" ? 'ok' : null;
    }catch {
        return null;
    }
}

module.exports = {
    checkRegister,
    register,
    getUser,
    emailConfirmation,
    existsKeyConfirmation,
    existsKeyRecovery,
    activateUser,
    emailRecovery,
    updatePassword,
    getUsers,
    usersMap,
    changeRol,
    changeActive,
    emailRecovery2
}
