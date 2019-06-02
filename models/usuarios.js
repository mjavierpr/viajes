'use strict';
module.exports = (sequelize, DataTypes) => {
  var usuarios = sequelize.define('usuario', {
    usuario: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.ENUM('usuario', 'administrador')
  });

  return usuarios;
};
