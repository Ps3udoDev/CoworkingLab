'use strict';
const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const tagsSeeds = [
      {
        id: 1,
        name: 'Ropa y Accesorios',
        description: 'Se refiere a la categorización de contenido relacionado con la moda, incluyendo prendas de vestir, calzado, accesorios y joyas.',
        image_url: 'https://test-image/tag1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Deportes',
        description: 'Se refiere a la categorización de contenido relacionado con actividades deportivas, incluyendo noticias sobre deportes, resultados de partidos y eventos deportivos, entrenamiento y nutrición deportiva, entre otros.',
        image_url: 'https://test-image/tag2',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Conciertos',
        description: 'Se refiere a la categorización de contenido relacionado con eventos de música en vivo, incluyendo noticias sobre artistas, anuncios de próximos conciertos, reseñas de conciertos, entre otros.',
        image_url: 'https://test-image/tag3',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'Meet & Great',
        description: 'Se refiere a la categorización de contenido relacionado con eventos en los cuales los fans pueden conocer en persona a sus artistas, atletas o celebridades favoritas. Estos eventos suelen incluir sesiones de fotos y autógrafos con los artistas.',
        image_url: 'https://test-image/tag4',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: 'E-spor',
        description: 'Se refiere a la categorización de contenido relacionado con juegos electrónicos o videojuegos competitivos, incluyendo noticias sobre torneos, resultados de partidas, análisis de jugadores y equipos, entre otros.',
        image_url: 'https://test-image/tag5',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: 'Pop / Rock',
        description: 'Se refiere a la categorización de contenido relacionado con la música pop y rock, incluyendo noticias sobre artistas, reseñas de conciertos, análisis de canciones y videos musicales, entre otros.',
        image_url: 'https://test-image/tag6',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name: 'Tecnología',
        description: 'Se refiere a la categorización de contenido relacionado con avances y novedades tecnológicas, incluyendo noticias sobre productos electrónicos, reseñas de dispositivos y análisis de tecnología en general.',
        image_url: 'https://test-image/tag7',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name: 'Hogar y Decoración',
        description: 'Se refiere a la categorización de contenido relacionado con la decoración del hogar, incluyendo noticias sobre tendencias de diseño, ideas de decoración, consejos para el hogar, entre otros.',
        image_url: 'https://test-image/tag8',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        name: 'Abastecimiento',
        description: 'Se refiere a la categorización de contenido relacionado con el suministro de productos y servicios, incluyendo noticias sobre tendencias y estrategias de abastecimiento, análisis de proveedores, consejos de gestión de compras, entre otros.',
        image_url: 'https://test-image/tag9',
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
