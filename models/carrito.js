'use strict';
module.exports = (sequelize, DataTypes) => {
  var carrito = sequelize.define('carrito', {
    //viajeId: DataTypes.INTEGER(11),
    personas: DataTypes.INTEGER(3)
  });
  carrito.associate = (models) => {
    models.carrito.belongsTo(models.usuarios);
  };
  return carrito;
};