'use strict';
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('publications_types', [
        {
          id: '1',
          name: 'Entrevistas',
          description: 'test description',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          name: 'Test2',
          description: 'test description 2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, /* Sequelize */) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkDelete('publications_types', {
        name: {
          [Op.or]: ['Entrevistas']
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
