# Viajes

This project was generated with [express-generator] (https://expressjs.com/en/starter/generator.html)

## Server
	
Run `node ./bin/www` for a dev server and navigate to `http://localhost:3000/`.

## Config email

You have to edit the file config/email.js and set your config email. Example:
let logInfo = {
    service: 'Gmail',
    auth: {
        user: 'myemail@gmail.com',
        pass: '1234'
    },
    tls: {rejectUnauthorized: false},
}
let emailInfo = {
    from: 'myemail@gmail.com',
    headers: {}
}

## Config dabatabes

You can change config data in config/database.js or leave it. Example:
  development: {
    username: 'myusername',
    password: '1234',
    database: 'viajeros',
    host: 'localhost',
    dialect: "mysql",
  },
This app uses the following MySQL databases:
viajes - usuarios - imagenes - imagenPrincipal - claves - confirmaciones - recuperaciones - carrito
