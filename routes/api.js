const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');
const usersController = require('../controllers/users');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Devuelve viajes en formato json
router.get('/', async (req, res) => {
    let maxPrice = req.query.maxPrecio;
    let destiny = req.query.destino;
    let autor = req.query.autor;
    let dataApi = await apiController.getApiTravels(maxPrice, destiny, autor);
    res.send(dataApi);
});

// Crea viaje con los datos json recibidos
router.post('/', async (req, res) => {
    let travel = req.body, isCreated = false;
    // Si el usuario tiene registro, devuelve el usuario y si no null
    let user = await usersController.checkRegister(travel.email, travel.password);
    if (user) {
        isCreated = await usersController.addTravel(travel);
    }
    res.send(isCreated ? 'Viaje creado correctamente' : 'No se ha podido crear viaje');
});

// Información de la Api
router.get('/info', async (req, res) => {
    res.render('api/info', { title: "Api info" });
});

module.exports = router;
