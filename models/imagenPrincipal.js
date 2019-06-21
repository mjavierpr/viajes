'use strict';
module.exports = (sequelize, DataTypes) => {
  var imagenPrincipal = sequelize.define('imagenPrincipal', {
  });
  imagenPrincipal.associate = (models) => {
    models.imagenPrincipal.belongsTo(models.viajes);
    models.imagenPrincipal.belongsTo(models.images);
  };
  return imagenPrincipal;
};