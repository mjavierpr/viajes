'use strict';
module.exports = (sequelize, DataTypes) => {
  var usuarios = sequelize.define('usuarios', {
    usuario: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.ENUM('usuario', 'administrador'),
    activo: DataTypes.BOOLEAN
  });

  usuarios.associate = (models) => {
    models.usuarios.hasMany(models.viajes);
  };

  usuarios.associate = (models) => {
    models.usuarios.hasOne(models.claves);
  };


  return usuarios;
};
