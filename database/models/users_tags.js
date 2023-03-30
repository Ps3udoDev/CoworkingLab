'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersTags extends Model {
    static associate(models) {
      UsersTags.belongsTo(models.Tags, { as: 'tags', foreignKey: 'tag_id' })
      UsersTags.belongsTo(models.Users, { as: 'users', foreignKey: 'user_id' })
    }
  }
  UsersTags.init({
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'UsersTags',
    tableName: 'users_tags',
    underscored: true,
    timestamps: true,
    scopes: {
      no_timestamps: { attributes: { exclude: ['created_at', 'updated_at'] } }
    }
  });
  return UsersTags;
};