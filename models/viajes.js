'use strict';
module.exports = (sequelize, DataTypes) => {
  var viajes = sequelize.define('viajes', {
    destino: DataTypes.STRING,
    precio: DataTypes.DECIMAL(6, 0),
    descuento: DataTypes.DECIMAL(6, 0),
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    descripcion: DataTypes.STRING
  });
  viajes.associate = (models) => {
    models.viajes.belongsTo(models.usuarios);
    models.viajes.hasMany(models.images);
    models.viajes.hasOne(models.imagenPrincipal);
  };
  return viajes;
};