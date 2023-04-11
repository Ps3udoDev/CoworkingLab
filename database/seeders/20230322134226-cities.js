'use strict'
const { Op } = require('sequelize');
const StatesServices = require('../../services/states.service');
const stateServices = new StatesServices()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const stateId = await stateServices.getStateOr404(1)
      const cities = [
        {
          id: '1',
          state_id: stateId.id,
          name: 'Catamayo',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          state_id: stateId.id,
          name: 'Loja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          state_id: stateId.id,
          name: 'Vilcabamba',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      await queryInterface.bulkInsert('cities', cities, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const citiesNames = [
      'Catamayo', 'Loja', 'Vilcabamba'
    ]
    try {
      await queryInterface.bulkDelete('cities', {
        name: {
          [Op.or]: citiesNames
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
}

