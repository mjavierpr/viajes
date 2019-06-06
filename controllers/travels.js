// Este fichero tiene las consultas a la bbdd
const models = require('../models');  // conexión a la bbdd

// Devuelte todos los viajes (aunque si hay muchos debemos limitar la consulta SELECT * FROM viajes LIMIT 8 y hacer paginación)
async function getTravels() {
    let rows = await models.viajes.findAll();
    return rows;
}

// Devuelve un viaje por su id
async function getTravelId(id) {
    let row = await models.viajes.findByPk(id);
    return row;
}

// Añade un viaje y lo devuelve
async function addTravel(travel) {
    try {
        let viaje = await models.viajes.create(travel);
        return viaje;
    }catch(err) {
        return null;
    }
}

module.exports = {
    getTravels,
    getTravelId,
    addTravel
}
