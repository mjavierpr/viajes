'use strict';
module.exports = (sequelize, DataTypes) => {
  var imagenes = sequelize.define('imagenes', {
    imagen: DataTypes.STRING
  });
  imagenes.associate = (models) => {
    models.imagenes.belongsTo(models.viajes);
    models.imagenes.hasOne(models.imagenPrincipal);
  };
  return imagenes;
};