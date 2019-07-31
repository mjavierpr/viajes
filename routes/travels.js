const express = require('express');
const router = express.Router();
const moment = require('moment');
const uploads = require('../config/multer.js');
const travelsController = require('../controllers/travels');
const {isAdmin} = require("../middlewares/isAdmin");

router.get('/', async (req, res) => {
  res.redirect('/p/1');
});

router.get('/p/:page?', async (req, res) => {
  let page = req.params.page, travelsPerPage = travelsController.travelsPerPage, offset = 0, msg = null;
  if (page) {
    page = Number(page);
    if (await travelsController.isPage(page)) {
      offset = page * travelsPerPage - travelsPerPage;
    } else {
      req.flash('error', "La página " + req.params.page + " no existe");
      res.redirect('/p/1');
    }
  } else {
    res.redirect('/p/1');
  }
  let travels = await travelsController.getTravels(offset);
  if (travels) {
    let userName = req.session.name;
    let isAdmin = (req.session.rol == "administrador" ? "admin" : null);
    let pagination = await travelsController.pagination(page);
    let itemsCart = userName ? await travelsController.itemsCart(req.session.userId) : null;
    res.render('home', {title: "Viajes", travels, userName, isAdmin, msg: req.flash('error'), pagination, itemsCart});
  } else {
    res.render('home', {title: "Viajes", error: "No hay viajes para mostrar"});
  }
});

router.get('/detalle/:id', async (req, res) => {
  let travelId = req.params.id;
  let travel = await travelsController.getTravel(travelId);
  if (travel) {
    let userName = req.session.name;
    let dateIni = moment(travel.fecha_inicio).format('DD-MM-YY');
    let dateEnd = moment(travel.fecha_fin).format('DD-MM-YY');
    let mainImg = travel.imagenPrincipal.imagene.imagen;
    let imgs = travelsController.travelNoMainImg(travel.imagenes, mainImg);
    let itemsCart = userName ? await travelsController.itemsCart(req.session.userId) : null;;
    let editTravel = req.session.rol == "administrador" ? true : null;
    res.render('travels/detail', {title: "Detalle", travel, imgs, dateIni, dateEnd, editTravel, error2: req.flash('error'), success: req.flash('info'), itemsCart});
  } else {
    res.render('travels/detail', {title: "Detalle", error: "No es posible mostrar detalle"});
  }
});

router.get('/crear-viaje', isAdmin, (req, res) => {
  let userName = req.session.name;
  res.render('travels/add', {title: "Crear viaje", userName});
});

router.post('/crear-viaje', isAdmin, uploads.array('imgFiles', 10), async (req, res) => {
  let {destino, precio, descuento, fecha_inicio, fecha_fin, descripcion} = req.body;
  if (req.files.length) {
    let travel = await travelsController.addTravel(req.body, req.session.userId, req.files);
    if (travel) {
      res.redirect('/viaje/' + travel.id + "/imagen-principal");
    } else {
      res.render('travels/add', {title: "Creación viaje", error: "Error al insertar viaje", destino, precio, descuento, fecha_inicio, fecha_fin, descripcion});
    }
  } else {
    res.render('travels/add', {title: "Creación viaje", error: "No has seleccionado ningún archivo de imagen", destino, precio, descuento,fecha_inicio, fecha_fin, descripcion});
  }
});

router.get('/viaje/:id/imagen-principal', isAdmin, async (req, res) => {
  let travelId = req.params.id;
  let images = await travelsController.getImages(travelId);
  if (images) {
    res.render('travels/added', {title: "Creación viaje", images, travelId});
  } else {
    res.render('travels/added', {title: "Creación viaje", error: "Error al obtener imágenes"});
  }
});

router.post('/viaje/imagen-principal', isAdmin, async (req, res) => {
  let {mainImgId, travelId} = req.body;
  let mainImg = await travelsController.addMainImg(mainImgId, travelId);
  if (mainImg) {
    res.render('travels/addAgain', {title: "Creación viaje"});
  } else {
    res.render('travels/addAgain', {title: "Creación viaje", error: "Error al asignar imagen principal"});
  }
});

router.get('/editar-viaje/:id', async (req, res) => {
  let travelId = req.params.id;
  let travel = await travelsController.getTravel(travelId);
  let {destino, precio, descuento, fecha_inicio, fecha_fin, descripcion} = travel;
  if (travel) {
    dateIni = new Date(fecha_inicio).toISOString().slice(0, 10);
    dateEnd = new Date(fecha_fin).toISOString().slice(0, 10);
    let userName = req.session.name;
    res.render('travels/edit', {title: "Editar viaje", userName, dateIni, dateEnd, destino, precio, descuento, descripcion, travelId});
  } else {
    res.render('travels/detail', {title: "Detalle", error: "No es posible editar viaje"});
  }
});

router.post('/editar-viaje', isAdmin, uploads.array('imgFiles', 10), async (req, res) => {
  let {newOrChoose, travelId} = req.body, travel;
  if (newOrChoose == "new") {
    travel = await travelsController.updateTravelNallImgs(req.body, req.session.userId, travelId, req.files);
  } else {
    travel = await travelsController.updateTravelNmainImg(req.body, req.session.userId, travelId);
  }
  if (travel) {
    if (newOrChoose == undefined) {
      res.render('travels/edited', {title: "Editar viaje"});
    } else {
      res.redirect('/viaje/' + travelId + "/imagenes/" + newOrChoose);
    }
  } else {
    res.render('travels/editEnd', {title: "Editar viaje", error: "Error al actualizar viaje"});
  }
});

router.get('/viaje/:id/imagenes/:newOrChoose', isAdmin, async (req, res) => {
  let travelId = req.params.id;
  let images = await travelsController.getImages(travelId);
  if (images) {
    res.render('travels/edited', {title: "Editar viaje", images, travelId, newOrChoose: req.params.newOrChoose});
  } else {
    res.render('travels/edited', {title: "Editar viaje", error: "Error al obtener imágenes"});
  }
});

router.post('/viaje/imagenes', isAdmin, async (req, res) => {
  let {mainImgId, travelId} = req.body;
  let mainImg = await travelsController.updateMainImg(mainImgId, travelId);
  if (mainImg) {
    res.render('travels/editEnd', {title: "Editar viaje"});
  } else {
    res.render('travels/editEnd', {title: "Editar viaje", error: "Error al asignar imagen principal"});
  }
});

router.get('/viajes/carrito', async (req, res) => {
  let userName = req.session.name;
  if (userName) {
    let cart = await travelsController.getCartFromDb(req.session.userId);
    if (cart.length) {
      res.render('travels/cart', {title: "Carrito", cart, userName, isSession: "yes"});
    } else {
      res.render('travels/cart', {title: "Carrito", msg: "No tienes ningún viaje en el carrito"});
    }
  } else {
    res.render('travels/cartjs');
  }
});

router.post('/viajes/carrito', async (req, res) => {
  if (req.body.cart !== "") {
    let cart = await travelsController.getCartFromStorage(JSON.parse(req.body.cart));
    res.render('travels/cart', {title: "Carrito", cart, userName, isSession: "no"});
  } else {
    res.render('travels/cart', {title: "Carrito", msg: "No tienes ningún viaje en el carrito"});
  }
});

router.post('/viajes/agregar-carrito', async (req, res) => {
  if (req.session.name) {
    let {idTravel, persons} = req.body;
    let addCart = await travelsController.addCart(idTravel, persons, req.session.userId);
    if (addCart) {
      req.flash('info', "Viaje añadido correctamente");
      res.redirect('/detalle/' + idTravel);
    } else {
      req.flash('error', "No se ha podido añadir al carrito");
      res.redirect('/detalle/' + idTravel);
    }
  } else {
    req.flash('info', "Viaje añadido correctamente");
    res.redirect('/detalle/' + req.body.idTravel);
  }
});

router.get('/viajes/compra', async (req, res) => {
  let userName = req.session.name;
  if (userName) {
    let cart = await travelsController.getCartFromDb(req.session.userId);
    if (cart.length) {
      res.render('travels/buy', {title: "Compra", cart, userName});
    } else {
      res.render('travels/cart', {title: "Carrito", msg: "No tienes ningún viaje en el carrito"});
    }
  } else {
    res.render('users/login', {title: "Identificación"});
  }
});

module.exports = router;
