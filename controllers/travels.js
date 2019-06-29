const models = require('../models');

let travelsPerPage = 4;

async function getTravels(offset) {
    try {
        let travels = await models.viajes.findAll({
            include: [{
                model: models.imagenPrincipal,
                include: [
                    models.imagenes
                ]
            }],
            limit: travelsPerPage, offset: offset
        });
        return travels;
    }catch {
        return null;
    }
}

async function getTravel(id) {
    try {
        let travel = await models.viajes.findByPk(id, {
            include: [{
                model: models.imagenPrincipal,
                include: [
                    models.imagenes
                ]
            },
            {
                model: models.imagenes
            }
        ]
        });
        return travel;
    }catch {
        return null;
    }
}

async function addTravel(travel, userId, files) {
    try {
        let newImages = files.map(file => {
            return {"imagen": file.filename};
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

async function getImages(id) {
    try {
        let row = await models.imagenes.findAll({where: {viajeId: id}});
        return row;
    }catch {
        return null;
    }
}

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
    try {
        let newTravel = await models.viajes.update(
            {   ...travel,
                usuarioId: userId
            },
            { where: { id: travelId } }
        );
        // update no admite include
        let newImages = files.map(file => {
            return {"imagen": file.filename, "viajeId": travelId};
        });
        await models.imagenes.destroy({
             where: { viajeId: travelId }
        });
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
        // proceso interrumpido en la creación de viaje por lo que no se creó el registro de imagen principal
        if (row[0] == 0) {
            row = addMainImg(imgId, travelId);
        }      
        return row;
    }catch {
        return row;
    }
}

function travelNoMainImg(imgs, main) {
    newImgs = imgs.filter(img => img.imagen !== main);
    return newImgs;
}

async function pagination(page) {
    let pageN = Number(page);
    let totalTravels = await models.viajes.count();
    if(pageN == 1) {
        btnIni = null;
        btnBack = null;
        btnForw = pageN + 1;
        btnEnd = parseInt(totalTravels / travelsPerPage) + ((totalTravels % travelsPerPage) == 0 ? 0 : 1);
    }else if (pageN * travelsPerPage > totalTravels) {
        btnEnd = null;
        btnForw = null;
        btnBack = pageN - 1;
        btnIni = "1";
    }else {
        btnForw = pageN + 1;
        btnEnd = totalTravels / travelsPerPage + ((totalTravels % travelsPerPage) == 0 ? 0 : 1);
        btnBack = pageN - 1;
        btnIni = "Adelante &gt;";
    }
    return {btnIni, btnBack, page, btnForw, btnEnd};
}

async function isPage(page) {
    let totalTravels = await models.viajes.count();
    let lastPage = parseInt(totalTravels / travelsPerPage) + ((totalTravels % travelsPerPage) == 0 ? 0 : 1);
    return page <= lastPage;
}

module.exports = {
    travelsPerPage,
    getTravels,
    getTravel,
    addTravel,
    getImages,
    addMainImg,
    updateTravelNallImgs,
    updateTravelNmainImg,
    updateMainImg,
    travelNoMainImg,
    pagination,
    isPage
}
