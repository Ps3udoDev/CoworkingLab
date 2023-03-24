'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
        onDelete: 'RESTRICT'
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
        onDelete: 'RESTRICT'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('publication_tags');
  }
};