'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    static associate(models) {
      Publications.belongsTo(models.Users, { as: 'user', foreignKey: 'user_id' })
      Publications.belongsTo(models.PublicationTypes, { as: 'publication_type', foreignKey: 'publication_type_id' })
      Publications.belongsTo(models.Cities, { as: 'cities', foreignKey: 'city_id' })
      Publications.hasMany(models.PublicationsImages, { as: 'images', foreignKey: 'publication_id' })
      Publications.belongsToMany(models.Users, { as: 'same_vote', foreignKey: 'publication_id' , through: models.Votes})
      Publications.belongsToMany(models.Users, { as: 'votes', foreignKey: 'publication_id' , through: models.Votes})
      Publications.belongsToMany(models.Tags, { as: 'filtered_tags', foreignKey: 'publication_id' , through: models.PublicationsTags})
      Publications.belongsToMany(models.Tags, { as: 'tags', foreignKey: 'publication_id' , through: models.PublicationsTags})
      Publications.addScope('votes_count', {
        attributes: ['id', 'user_id', 'publication_type_id', 'city_id', 'title', 'description', 'content', 'reference_link', 'created_at', 'updated_at'],
        include: [
          {
            model: models.PublicationsImages,
            as: 'images'
          },
          {
            model: models.Users,
            as: 'user',
            attributes: ['first_name', 'last_name', 'image_url']
          },
          {
            model: models.PublicationTypes,
            as: 'publication_type'
          },
          {
            model: models.Tags,
            as: 'tags',
            through: {
              attributes: []
            }
          }
        ]
      })
    }
  }
  Publications.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    publication_type_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    reference_link: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: 'Publications',
    tableName: 'publications',
    underscored: true,
    timestamps: true,
    scopes: {
      view_public: {
        attributes: ['id'],
      },
      no_timestamps: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
    }
  });
  return Publications
}