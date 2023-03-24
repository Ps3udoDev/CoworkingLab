'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationTags extends Model {
    static associate(models) {
      //PublicationTags.belongsTo(models.Publications, {})
    }
  }
  PublicationTags.init({
    tag_id: DataTypes.INTEGER,
    publication_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'publication-tags',
  });
  return PublicationTags
};