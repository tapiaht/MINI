const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  ruta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('bug', 'mejora', 'nuevo', 'otro'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'),
    allowNull: false,
    defaultValue: 'media',
  },
  estado: {
    type: DataTypes.ENUM('nuevo', 'en_progreso', 'resuelto', 'cerrado'),
    allowNull: false,
    defaultValue: 'nuevo',
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Feedback;
