// Este fichero tiene las consultas a la bbdd
const CONN = require('../helpers/dbConnection');  // conexión a la bbdd

// Controlador que devuelve una promesa
function getTravels() {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM viaje', (error, rows) => {
            resolve(rows);
        })
    })
}

// Devuelve un viaje por su id
function getTravelId(id) {
    return new Promise((resolve, reject) => {
        CONN.query('SELECT * FROM viaje WHERE id = ?', [id], (err, row) => {
            resolve(row[0]);
        })
    })
}

module.exports = {
    getTravels,
    getTravelId
}
