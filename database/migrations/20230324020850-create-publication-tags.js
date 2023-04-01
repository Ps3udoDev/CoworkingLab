'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('publication_tags', {
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          primaryKey: true,
          references: {
            model: 'tags',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        publication_id: {
          type: Sequelize.UUID,
          allowNull: false,
          foreignKey: true,
          primaryKey: true,
          references: {
            model: 'publications',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction });
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('publication_tags', { transaction });
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }

  }
};