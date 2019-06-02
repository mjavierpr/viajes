// Este fichero tiene las consultas a la bbdd
const models = require('../models');  // conexión a la bbdd

// Controlador que devuelve una promesa
async function getTravels() {
    let rows = await models.viajes.findAll();
    return rows;
}

// Devuelve un viaje por su id
async function getTravelId(id) {
    let row = await models.viajes.findByPk(id);
    return row;
}

module.exports = {
    getTravels,
    getTravelId
}
