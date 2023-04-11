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
          name: 'Marcas y Tiendas',
          description: 'Se refieren a contenidos relacionados con marcas y tiendas, tales como anuncios de nuevos productos, promociones y descuentos, reseñas de productos o servicios, y noticias sobre la empresa.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          name: 'Artistas y Conciertos',
          description: 'Se refieren a contenidos relacionados con eventos musicales, tales como anuncios de próximos conciertos, reseñas de conciertos recientes, noticias sobre artistas y bandas, y comentarios sobre canciones y videos musicales.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '3',
          name: 'Torneos',
          description: 'Se refieren a contenidos relacionados con eventos deportivos o competitivos, tales como resultados de partidos, comentarios y análisis de juegos y jugadores, noticias sobre equipos y competiciones, y detalles sobre próximos eventos deportivos.',
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
