'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationsImages extends Model {
    static associate(models) {
      PublicationsImages.belongsTo(models.Publications, { as: 'publications', foreignKey: 'publication_id' })
    }
  }
  PublicationsImages.init({
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
  return PublicationsImages;
};