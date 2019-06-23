// Este fichero tiene las consultas a la bbdd
const models = require('../models');  // conexión a la bbdd

// Devuelte todos los viajes (aunque si hay muchos debemos limitar la consulta SELECT * FROM viajes LIMIT 8 y hacer paginación)
async function getTravels() {
    try {
        let travels = await models.viajes.findAll({
            include: [{
                model: models.imagenPrincipal,
                include: [
                    models.imagenes
                ]
            }]
        });
        return travels;
    }catch(err) {
        return null;
    }
}

// Devuelve un viaje por su id
async function getTravel(id) {
    try {
        let travel = await models.viajes.findByPk(id, {
            include: [{
                model: models.imagenPrincipal,
                include: [
                    models.imagenes
                ]
            }]
        });
        return travel;
    }catch {
        return null;
    }
}

// Añade un viaje y lo devuelve
async function addTravel(travel, userId, files) {
    try {
        let newImages = files.map(file => {
            return {"image": file.filename};
        });
        let newTravel = await models.viajes.create(
            { ...travel,
                usuarioId: userId,
                imagenes: newImages
            },
            { include: [models.imagenes] }
        );
        return newTravel ? newTravel : null;
    }catch {
        return null;
    }
}

// Devuelve imágenes por la id de viaje
async function getImages(id) {
    try {
        let row = await models.imagenes.findAll({where: {viajeId: id}});
        return row;
    }catch {
        return null;
    }
}

// Añade imagen principal a la tabla imagenPrincipal
async function addMainImg(imgId, travelId) {
    try {
        let row = await models.imagenPrincipal.create({
            imageneId: imgId,
            viajeId: travelId
        });
        return row;
    }catch {
        return null;
    }
}

async function updateTravelNallImgs(travel, userId, travelId, files) {


    console.log("-------travelid", travelId);
    try {
        let newTravel = await models.viajes.update(
            {   ...travel,
                usuarioId: userId
            },
            { where: { id: travelId } }
        );
            console.log("---", newTravel);

        // update no admite include
        let newImages = files.map(file => {
            return {"image": file.filename, "viajeId": travelId};
        });
        await models.imagenes.destroy({
             where: { viajeId: travelId }
        });

        console.log("---", newImages);

        await models.imagenes.bulkCreate( newImages );
        return (newTravel ? newTravel : null);
    } catch {
        return null;
    }
}

async function updateTravelNmainImg(travel, userId, travelId) {
    try {
        let newTravel = await models.viajes.update(
            { ...travel,
                usuarioId: userId,
            },
            { where: { id: travelId } }
        );
        return (newTravel ? newTravel : null);
    } catch {
        return null;
    }
}

async function updateMainImg(imgId, travelId) {
    try {
        let row = await models.imagenPrincipal.update(
            { imageneId: imgId },
            { where: { viajeId: travelId } }
        );
        return row;
    }catch {
        return null;
    }
}

module.exports = {
    getTravels,
    getTravel,
    addTravel,
    getImages,
    addMainImg,
    updateTravelNallImgs,
    updateTravelNmainImg,
    updateMainImg
}
