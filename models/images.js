'use strict';
module.exports = (sequelize, DataTypes) => {
  var images = sequelize.define('images', {
    image: DataTypes.STRING
  });
  images.associate = (models) => {
    models.images.belongsTo(models.viajes);
    models.images.hasOne(models.imagenPrincipal);
  };
  return images;
};