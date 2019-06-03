const express = require('express');
const router = express.Router();
const travelsController = require('../controllers/travels');
const moment = require('moment');

// Página de inicio
router.get('/', async (req, res) => {
  // getTravels() nos devuelve un SELECT * FROM viaje
  let travels = await travelsController.getTravels();
  let userName = req.session.name;
  let isAdmin = (req.session.rol == "administrador" ? "admin" : null);
  res.render('home', {title: "Viajes", travels, userName, isAdmin});
});

// Página de detalle
router.get('/detalle/:id', async (req, res) => {
  let paramId = req.params.id;
  let dataTravel = await travelsController.getTravelId(paramId);
  let dateIni = moment(dataTravel.fecha_inicio).format('DD-MM-YY');
  let dateEnd = moment(dataTravel.fecha_fin).format('DD-MM-YY');
  res.render('travels/detail', {title: "Detalle", dataTravel, dateIni, dateEnd});
});

module.exports = router;
