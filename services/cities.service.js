const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class CitiesCervices {
  constructor() {
  }

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { size, page } = query
    if (size && page) {
      options.size = size
      options.page = page
    }

    const { id } = query
    if (id) {
      options.where.id = id
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const cities = await models.Cities.scope('view_public').findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(cities.count / (size ? size : cities.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : cities.count);
    const endIndex = startIndex + Number(size ? size : cities.count);

    const results = page > totalPages ? [] : cities.rows.slice(startIndex, endIndex)
    return {
      count: cities.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createCity(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newCity = await models.Cities.create(obj, { transaction, fields: ['state_id', 'name'] })
      await transaction.commit()
      return newCity
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async getCityOr404(id) {
    let city = await models.Cities.scope('view_public').findByPk(id, { raw: true })
    if (!city) throw new CustomError('Not found City', 404, 'Not Fount')
    return city
  }

  async getCity(id) {
    let city = await models.Cities.scope('view_public').findByPk(id)
    if (!city) throw new CustomError('Not found City', 404, 'Not Fount')
    return city
  }

  async updateCity(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let city = await models.Cities.findByPk(id)
      if (!city) throw new CustomError('Not fount City', 404, 'Not Found')
      let updateCity = await city.update(obj, { transaction })
      await transaction.commit()
      return updateCity
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeCity(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let city = await models.Cities.findByPk(id)
      if (!city) throw new CustomError('Not found City', 404, 'Not Found')
      await city.destroy({ transaction })
      await transaction.commit()
      return city
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = CitiesCervices
