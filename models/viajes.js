'use strict';
module.exports = (sequelize, DataTypes) => {
  var viajes = sequelize.define('viajes', {
    destino: DataTypes.STRING,
    precio: DataTypes.DECIMAL(6,0),
    descuento: DataTypes.DECIMAL(6,0),
    ruta_imagen: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    descripcion: DataTypes.STRING,
  });

  return viajes;
};
