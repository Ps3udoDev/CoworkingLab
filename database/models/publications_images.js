'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications_Images extends Model {
    static associate(models) {
      Publications_Images.belongsTo(models.Publications, { as: 'publications', foreignKey: 'publication_id' })
    }
  }
  Publications_Images.init({
    publication_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'PublicationsImages',
    tableName: 'publications_images',
    underscored: true,
    timestamps: true,
    scopes: {
      no_timestamps: { attributes: { exclude: ['created_at', 'updated_at'] } }
    }
  });
  return Publications_Images;
};