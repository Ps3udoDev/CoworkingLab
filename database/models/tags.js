'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      //Tags.hasMany(models.PublicationsTypes, { as: 'publication_tags', foreignKey: 'tag_id' })
    }
  }
  Tags.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    desciption: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tags',
    tableName: 'tags',
    underscored: true,
    timestamps: true,
    scopes: {
      no_timestamps: { attributes: { exclude: ['created_at', 'updated_at'] } }
    }
  })
  return Tags
}