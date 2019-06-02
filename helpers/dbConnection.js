// Este fichero tiene las conexiones a las bbdd
const MYSQL = require('mysql2');

const CONN = MYSQL.createConnection({
    host: 'localhost',
    user: 'javi',
    password: '1234',
    database: 'viajes',
});

module.exports = CONN;