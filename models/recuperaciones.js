'use strict';
module.exports = (sequelize, DataTypes) => {
  var recuperaciones = sequelize.define('recuperaciones', {
    clave: DataTypes.STRING
  });

  recuperaciones.associate = (models) => {
    models.recuperaciones.belongsTo(models.usuarios);
  };

  return recuperaciones;
};
