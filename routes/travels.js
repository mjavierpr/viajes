const express = require('express');
const router = express.Router();
const moment = require('moment');
const uploads = require('../config/multer.js');
const travelsController = require('../controllers/travels');
const {isAdmin} = require("../middlewares/isAdmin");

// Página de inicio
router.get('/', async (req, res) => {
  // getTravels() nos devuelve un SELECT * FROM viajes
  let travels = await travelsController.getTravels();
  if (travels) {
    let userName = req.session.name;
    let isAdmin = (req.session.rol == "administrador" ? "admin" : null);
    res.render('home', {title: "Viajes", travels, userName, isAdmin});
  }else {
    res.render('home', {title: "Viajes", error: "No hay viajes para mostrar"});
  }
});

// Página de detalle
router.get('/detalle/:id', async (req, res) => {
  let paramId = req.params.id;
  let travel = await travelsController.getTravel(paramId);
  if (travel) {
    let dateIni = moment(travel.fecha_inicio).format('DD-MM-YY');
    let dateEnd = moment(travel.fecha_fin).format('DD-MM-YY');
    res.render('travels/detail', {title: "Detalle", travel, dateIni, dateEnd});
  }else {
    res.render('travels/detail', {title: "Detalle", error: "No es posible mostrar detalle"});
  }
});

// Envía al formulario de add.hbs para insertar nuevo viaje
router.get('/crear-viaje', isAdmin, (req, res) => {
  res.render('travels/add', {title: "Crear viaje"});
});

// Recibe los datos del formulario de add.hbs
router.post('/crear-viaje', isAdmin, uploads.array('imgFiles', 10), async (req, res) => {
  let {destino, precio, descuento, fecha_inicio, fecha_fin, descripcion} = req.body;
  if (req.files.length) {
    // Manda los datos (req.body) a addTravel() que inserta un nuevo registro (o viaje) en la bbdd y luego muestra un mensaje a través de added.hbs
    let travel = await travelsController.addTravel(req.body, req.session.userId, req.files);
    if (travel) {
      res.redirect('/viaje/' + travel.id + "/imagen-principal");
    }else {
      res.render('travels/add', {title: "Creación viaje", error: "Error al insertar viaje", destino, precio, descuento, fecha_inicio, fecha_fin, descripcion});
    }
  }else {
    res.render('travels/add', {title: "Creación viaje", error: "No has seleccionado ningún archivo de imagen", destino, precio, descuento,fecha_inicio, fecha_fin, descripcion});
  }
});

router.get('/viaje/:id/imagen-principal', isAdmin, async (req, res) => {
  let travelId = req.params.id;
  let images = await travelsController.getImages(travelId);
  if (images) {
    res.render('travels/added', {title: "Creación viaje", images, travelId});
  }else {
    res.render('travels/added', {title: "Creación viaje", error: "* Error al obtener imágenes"});
  }
});

router.post('/imagen-principal', isAdmin, async (req, res) => {
  let {mainImgId, travelId} = req.body;
  let mainImg = await travelsController.addMainImg(mainImgId, travelId);
  if (mainImg) {
    res.render('travels/addAgain', {title: "Creación viaje"});
  }else {
    res.render('travels/addAgain', {title: "Creación viaje", error: "Error al asignar imagen principal"});
  }
});

module.exports = router;
