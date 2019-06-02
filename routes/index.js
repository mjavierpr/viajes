const express = require('express');
const router = express.Router();
const travelsController = require('../controllers/travels');

// Página de inicio
router.get('/', async (req, res) => {
  // getTravels() nos devuelve un SELECT * FROM viaje
  let travels = await travelsController.getTravels();
  let userName = req.session.name;
  let userAdmin = req.session.admin;
  res.render('home', {title: "Viajes", travels, userName, userAdmin});
});

// Página de detalle
router.get('/detalle/:id', async (req, res) => {
  let paramId = req.params.id;
  let dataTravel = await travelsController.getTravelId(paramId);
  res.render('travels/detail', {title: "Detalle", dataTravel});
});

module.exports = router;
