// conexión a la bbdd
const models = require('../models');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const travelsController = require('./travels');

// devuelve los primeros 20 registros de la base de datos
async function getApiTravels(maxPrice, destiny, autor) {
    let rows, query;
    if (maxPrice && destiny) {
        query = {where: {precio: {[Op.lte]: maxPrice}, destino: destiny}, limit: 20};
    }else if (maxPrice) {
        query = {where: {precio: {[Op.lte]: maxPrice}}, limit: 20};
    }else if (destiny) {
        query = {where: {destino: {[Op.like]: destiny}}, limit: 20};
    }else if (autor) {
		if (autor == "*") {
			query = {include: [{model: models.usuarios, attributes: {exclude: ['password']}}], limit: 20};
		}else {
			query = {include: [{model: models.usuarios, attributes: {exclude: ['password']}, where: {id: autor}}], limit: 20};
		}
	}else {
        query = {limit: 20};
    }
    rows = await travelsController.getTravels(query);
    return rows;
}

module.exports = {
    getApiTravels
}
