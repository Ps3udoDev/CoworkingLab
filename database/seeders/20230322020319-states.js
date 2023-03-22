'use strict';
const { Op } = require('sequelize');
const CountriesService = require('../../services/countries.service')
const countrieServices = new CountriesService()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const countryId = await countrieServices.getCountryOr404(1)
      const states = [
        {
          id: '1',
          country_id: countryId.id,
          name: 'Loja',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          country_id: countryId.id,
          name: 'Quito',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          country_id: countryId.id,
          name: 'Cuenca',
          created_at: new Date(),
          updated_at: new Date()
        },
      ]
      await queryInterface.bulkInsert('states', states, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const statesNames = [
      'Loja', 'Quito', 'Cuenca'
    ]
    try {
      await queryInterface.bulkDelete('states', {
        name: {
          [Op.or]: statesNames
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
