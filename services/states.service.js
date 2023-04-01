const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class StatesServices {
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

    const states = await models.States.scope('view_public').findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(states.count / (size ? size : states.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : states.count);
    const endIndex = startIndex + Number(size ? size : states.count);

    const results = page > totalPages ? [] : states.rows.slice(startIndex, endIndex)
    return {
      count: states.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createState(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newState = await models.States.create(obj, { transaction, fields: ['country_id', 'name'] })
      await transaction.commit()
      return newState
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async getStateOr404(id) {
    let state = await models.States.scope('view_public').findByPk(id, { raw: true })
    if (!state) throw new CustomError('Not found State', 404, 'Not Fount')
    return state
  }

  async getState(id) {
    let state = await models.States.scope('view_public').findByPk(id)
    if (!state) throw new CustomError('Not found State', 404, 'Not Fount')
    return state
  }

  async updateState(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let state = await models.States.findByPk(id)
      if (!state) throw new CustomError('Not fount State', 404, 'Not Found')
      let updateState = await state.update(obj, { transaction })
      await transaction.commit()
      return updateState
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeState(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let state = await models.States.findByPk(id)
      if (!state) throw new CustomError('Not found State', 404, 'Not Found')
      await state.destroy({ transaction })
      await transaction.commit()
      return state
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = StatesServices
