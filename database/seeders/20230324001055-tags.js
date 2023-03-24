'use strict';
const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const tagsSeeds = [
      {
        id: 1,
        name: 'tag 1',
        description: 'description tag1',
        image_url: 'url tag1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'tag 2',
        description: 'description tag2',
        image_url: 'url tag2',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'tag 3',
        description: 'description tag3',
        image_url: 'url tag3',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'tag 4',
        description: 'description tag5',
        image_url: 'url tag4',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    try {
      await queryInterface.bulkInsert('tags', tagsSeeds, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const tagsName = [
      'tag 1', 'tag 2', 'tag 3', 'tag 4'
    ]
    try {
      await queryInterface.bulkDelete('tags', {
        name:{
          [Op.or]: tagsName
        }
      }, {transaction})
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
