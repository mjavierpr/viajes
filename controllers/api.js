// conexión a la bbdd
const models = require('../models');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// devuelve los primeros 20 registros de la base de datos
async function getApiTravels(maxPrice, destiny) {
    let rows;
    if (maxPrice && destiny) {
        rows = await models.viajes.findAll({where: {precio: {[Op.lte]: maxPrice}}, destino: destiny}, {limit: 20});
    }else if (maxPrice) {
        rows = await models.viajes.findAll({where: {precio: {[Op.lte]: maxPrice}}}, {limit: 20});
    }else if (destiny) {
        rows = await models.viajes.findAll({where: {destino: {[Op.like]: destiny}}}, {limit: 20});     
    }else {
        rows = await models.viajes.findAll({limit: 20});
    }
    return rows;
}

// devuelve los primeros 20 registros de la base de datos
async function getApiTravelsAuthor(autor) {
    let rows;
    if (autor == "*") {
        rows = await models.viajes.findAll({include: [{model: models.usuarios}]}, {limit: 20});        
    }else {
        rows = await models.viajes.findAll({include: [{model: models.usuarios, where: {id: autor}}]}, {limit: 20});     
    }
    return rows;
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
    getApiTravels,
    getApiTravelsAuthor,
    addTravel
}