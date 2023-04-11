'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationTypes extends Model {
    static associate(models) {
      PublicationTypes.hasMany(models.Publications, { as: 'publications', foreignKey: 'publication_type_id' })
    }
  }
  PublicationTypes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'PublicationTypes',
    tableName: 'publication_types',
    underscored: true,
    timestamps: true,
    scopes: {
      no_timestamps: { attributes: { exclude: ['created_at', 'updated_at'] } }
    }
  });
  return PublicationTypes;
};
