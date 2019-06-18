'use strict';
module.exports = (sequelize, DataTypes) => {
  var claves = sequelize.define('claves', {
    clave: DataTypes.STRING
  });

  claves.associate = (models) => {
    models.claves.belongsTo(models.usuarios);
  };

  return claves;
};
