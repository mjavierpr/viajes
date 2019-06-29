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
    let {maxPrice, destiny, limite, inicio} = req.query;
    let dataApi = await apiController.getApiTravels(maxPrice, destiny, limite, inicio);
    if (dataApi) {
        res.send(dataApi);
    }else {
        res.send("Error ocurred");
    }
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

router.get('/info', async (req, res) => {
    res.render('api/info', { title: "Api info" });
});

module.exports = router;
