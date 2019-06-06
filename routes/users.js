const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Envía a formulario de register.hbs para registrar nuevo usuario
router.get('/registrar', (req, res) => {
  res.render('user/register', {title: "Registro", error: req.flash('error')});
});

// Recoge los datos del formulario de register.hbs
router.post('/registrar', async (req, res) => {
  let {usuario, email, password} = req.body;
  // Registro de nuevo usuario en la bbdd
  let msgRegister = await usersController.register(usuario, email, password);
  if (msgRegister == "") {
    // res.redirect('/usuarios/login')
    res.render('user/login_msg', {title: "Identificación", success: "Te has registrado correctamente"});
  }else {
    req.flash('error', msgRegister);
    res.redirect('/usuarios/registrar');
  }
})

// Envía a formulario de login.hbs para loguearse
router.get('/login', (req, res) => {
  // si existe la sesión
  if (req.session.name) {
    res.redirect('/');
  }else {
    res.render('user/login_msg', {title: "Registro", error: req.flash('errors')});
  }
})

// Recoge los datos del formulario de login.hbs
router.post('/login', async (req, res) => {
  let {email, password} = req.body;
  // Si el usuario tiene registro, devuelve el usuario y si no null
  let user = await usersController.checkRegister(email, password);
  if (user) {
      req.session.email = user.email;
      req.session.name = user.usuario;
      req.session.rol = user.rol;
      req.session.logginDate = new Date();
      res.redirect('/');
  }else {
      req.flash('errors', 'Usuario no encontrado');
      res.redirect('/usuarios/login');
  }
});

// Muestra la información del usuario en data.hbs
router.get('/datos-usuario', async (req, res) => {
  let data = await usersController.getData(req.session.email);
  res.render('user/data', {title: "Datos usuario", data: data[0]});
});

// Cierra sesión Muestra la información del usuario en userdata.hbs
router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Envía al formulario de add.hbs para insertar nuevo viaje
router.get('/crear-viaje', (req, res) => {
  if (req.session.rol == "administrador") {
    res.render('user/add', {title: "Crear viaje"});
  }else {
    res.redirect('/');
  }
});

// Recoge los datos del formulario de add.hbs
router.post('/crear-viaje', async (req, res) => {
  // Manda esos datos (req.body) a addTravel() que inserta los datos (crea un nuevo registro o viaje) en la bbdd y luego muestra un mensaje de éxito a través de added.hbs
  let isCreated = await usersController.addTravel(req.body);
  res.render('user/added', {title: "Creación viaje", isCreated});
})

module.exports = router;
