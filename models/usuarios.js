'use strict';
module.exports = (sequelize, DataTypes) => {
  var usuarios = sequelize.define('usuarios', {
    usuario: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: {
      type: DataTypes.ENUM('usuario', 'administrador'),
      defaultValue: 'usuario'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  });

  usuarios.associate = (models) => {
    models.usuarios.hasMany(models.viajes);
  };

  usuarios.associate = (models) => {
    models.usuarios.hasOne(models.claves);
  };

  return usuarios;
};
