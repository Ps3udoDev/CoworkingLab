const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class CountriesService {

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

    const countries = await models.Countries.scope('view_public').findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(countries.count / (size ? size : countries.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : countries.count);
    const endIndex = startIndex + Number(size ? size : countries.count);

    const results = page > totalPages ? [] : countries.rows.slice(startIndex, endIndex)
    return {
      count: countries.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createCountry({ name }) {
    const transaction = await models.sequelize.transaction()
    try {
      let newCountry = await models.Countries.create({
        name
      }, { transaction })

      await transaction.commit()
      return newCountry
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getCountryOr404(id) {
    let country = await models.Countries.findByPk(id, { raw: true })
    if (!country) throw new CustomError('Not found Country', 404, 'Not Found')
    return country
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getCountry(id) {
    let country = await models.Countries.findByPk(id)
    if (!country) throw new CustomError('Not found Country', 404, 'Not Found')
    return country
  }

  async updateCountry(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Countries.findByPk(id)

      if (!country) throw new CustomError('Not found Country', 404, 'Not Found')

      let updatedCountry = await country.update(obj, { transaction })

      await transaction.commit()

      return updatedCountry
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeCountry(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Countries.findByPk(id)

      if (!country) throw new CustomError('Not found Country', 404, 'Not Found')

      await country.destroy({ transaction })

      await transaction.commit()

      return country
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = CountriesService