'use strict';
module.exports = (sequelize, DataTypes) => {
  var usuarios = sequelize.define('usuarios', {
    usuario: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.ENUM('usuario', 'administrador')
  });

  usuarios.associate = (models) => {
    models.usuarios.hasMany(models.viajes);
  };

  return usuarios;
};
