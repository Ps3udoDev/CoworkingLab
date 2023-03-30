'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationTags extends Model {
    static associate(models) {
      PublicationTags.belongsTo(models.Tags, { as: 'tags', foreignKey: 'tag_id' })
      PublicationTags.belongsTo(models.Publications, { as: 'publications', foreignKey: 'publication_id' })
    }
  }
  PublicationTags.init({
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    publication_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'PublicationTags',
    tableName: 'publication_tags',
    underscored: true,
    timestamps: true,
    scopes: {
      no_timestamps: { attributes: { exclude: ['created_at', 'updated_at'] } }
    }
  });
  return PublicationTags
};