const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const travelsController = require('./travels');

// devuelve los primeros 20 registros de la base de datos
async function getApiTravels(maxPrice, destiny, limit = 10, offset = 0) {
    limit = Number(limit);
    limit = limit > 10 ? 10 : limit;
    offset = Number(offset);
    offset = offset > await models.viajes.count() ? 0 : offset;
    let rows, condition;
    if (maxPrice && destiny) {
        condition = {precio: {[Op.lte]: maxPrice}, destino: {[Op.substring]: destiny}};
    }else if (maxPrice) {
        conditio = {precio: {[Op.lte]: maxPrice}};
    }else if (destiny) {
        condition = {destino: {[Op.substring]: destiny}};
    }else if (limit) {
        condition = {};
	}else {
        return null;
    }
    rows = await travelsController.getTravels(offset, limit, condition);
    return rows;
}

module.exports = {
    getApiTravels
}
