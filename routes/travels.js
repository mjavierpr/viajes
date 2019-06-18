const express = require('express');
const router = express.Router();
const travelsController = require('../controllers/travels');
const moment = require('moment');

// Página de inicio
router.get('/', async (req, res) => {
  // getTravels() nos devuelve un SELECT * FROM viajes
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

// Envía al formulario de add.hbs para insertar nuevo viaje
router.get('/crear-viaje', (req, res) => {
  if (req.session.rol == "administrador") {
    res.render('travels/add', {title: "Crear viaje"});
  }else {
    res.redirect('/');
  }
});

// Recibe los datos del formulario de add.hbs
router.post('/crear-viaje', async (req, res) => {
  // Manda esos datos (req.body) a addTravel() que inserta los datos (crea un nuevo registro o viaje) en la bbdd y luego muestra un mensaje de éxito a través de added.hbs
  let isCreated = await travelsController.addTravel(req.body);
  res.render('travels/added', {title: "Creación viaje", isCreated});
})

module.exports = router;
