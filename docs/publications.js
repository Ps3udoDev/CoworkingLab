'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    static associate(models) {
      Publications.belongsTo(models.Users, { as: 'user', foreignKey: 'user_id' })
      Publications.belongsTo(models.PublicationsTypes, { as: 'publication_types', foreignKey: 'publication_type_id' })
    }
  }
  Publications.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    publication_type_id: DataTypes.INTEGER,
    title:{
      type: DataTypes.STRING,
    },
    description:{
      type: DataTypes.STRING,
    },
    content:{
      type: DataTypes.TEXT,
    },
    reference_link:{
      type: DataTypes.TEXT,
    },
  },{
    sequelize,
    modelName: 'Publications',
    tableName: 'publications',
    underscored: true,
    timestamps: true,
    scopes:{
      view_public: {
        attributes: ['id', 'user_id', 'publication_type_id', 'description', 'content', 'reference_link']
      },
      no_timestamps: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
    }
  });
  return Publications
}