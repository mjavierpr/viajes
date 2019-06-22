'use strict';
module.exports = (sequelize, DataTypes) => {
  var confirmaciones = sequelize.define('confirmaciones', {
    clave: DataTypes.STRING
  });

  confirmaciones.associate = (models) => {
    models.confirmaciones.belongsTo(models.usuarios);
  };

  return confirmaciones;
};
