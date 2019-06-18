const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Envía a formulario de register.hbs para registrar nuevo usuario
router.get('/registrar', (req, res) => {
  res.render('users/register', {title: "Registro", error: req.flash('error')});
});

// Recoge los datos del formulario de register.hbs
router.post('/registrar', async (req, res) => {
  let { usuario, email, password } = req.body;
  // Registro de nuevo usuario en la bbdd
  let msg = await usersController.register(usuario, email, password);
  if (msg == "") {
    // Envía email de confirmación y agrega clave a tabla claves
    msg = await usersController.emailConfirmation(usuario, email);
    if (msg == "") {
      res.render('users/confirmation', {title: "Confirmación", success: "Te hemos enviado un email de confirmación"});
      // res.redirect('/usuarios/login')
      // res.render('users/login_msg', {title: "Identificación", success: "Te has registrado correctamente"});
    }else {
      req.flash('error', msg);
      // res.redirect('/usuarios/registrar');
      res.render('users/register', {title: "Registro", usuario: usuario, email: email});
    }
  }else {
    req.flash('error', msg);
    // res.redirect('/usuarios/registrar');
    res.render('users/register', {title: "Registro", usuario: usuario, email: email});
  }
});

// Envía a formulario de login.hbs para loguearse
router.get('/login', (req, res) => {
  // si existe la sesión
  if (req.session.name) {
    res.redirect('/');
  }else {
    res.render('users/login_msg', {title: "Identificación", error: req.flash('errors')});
  }
});

// Recoge los datos del formulario de login.hbs
router.post('/login', async (req, res) => {
  let {email, password} = req.body;
  // Si el usuario tiene registro y está activo, devuelve el usuario y si no devuelve un mensaje de error
  let resReg = await usersController.checkRegister(email, password);
  if (typeof resReg === "object") {
      req.session.email = resReg.email;
      req.session.name = resReg.usuario;
      req.session.rol = resReg.rol;
      //req.session.logginDate = new Date();
      res.redirect('/');
  }else {
      req.flash('errors', resReg);
      //
      //
      // res.redirect('/usuarios/login');
      res.render('users/login_msg', {title: "Identificación", error: req.flash('errors'), email: email});
  }
});

// Muestra la información del usuario en data.hbs
router.get('/datos-usuario', async (req, res) => {
  let data = await usersController.getData(req.session.email);
  res.render('users/data', {title: "Datos usuario", data: data[0]});
});

// Cierra sesión Muestra la información del usuario en userdata.hbs
router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Recibe la confirmación de registro desde el email del usuario
router.get('/confirmar-email/:link', async (req, res) => {
  let paramLink = req.params.link;
  // Si la clave de confirmación existe, devuelve el usuario y si no null
  let userId = await usersController.existsKey(paramLink);
  if (userId) {
    let isSuccess = await usersController.userActive(userId);
    if (isSuccess) {
      // Borra la clave de la tabla claves
      await usersController.keyDelete(userId);
      res.render('users/confirmation', {title: "Confirmación registro", success: "Te has registrado correctamente"});
    }else {
      res.render('users/confirmation', {title: "Confirmación registro", error: "Error al confirmar registro"});
    }
  }else {
    res.render('users/confirmation', {title: "Confirmación registro", error: "Usuario no existe"});
  }
})

module.exports = router;
