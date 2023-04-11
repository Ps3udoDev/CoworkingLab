'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class States extends Model {
    static associate(models) {
      States.belongsTo(models.Countries, { as: 'country', foreignKey: 'country_id' })
      States.hasMany(models.Cities, { as: 'city', foreignKey: 'state_id' })
    }
  }
  States.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    country_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'States',
    tableName: 'states',
    underscored: true,
    timestamps: true,
    scopes: {
      view_public: {
        attributes: ['id', 'country_id', 'name', 'created_at', 'updated_at']
      },
      no_timestamps: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
    }
  });
  return States;
};