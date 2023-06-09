const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class PublicationTypesServices {
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

    options.distinct = true

    const publicationTypes = await models.PublicationTypes.findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(publicationTypes.count / (size ? size : publicationTypes.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : publicationTypes.count);
    const endIndex = startIndex + Number(size ? size : publicationTypes.count);

    const results = page > totalPages ? [] : publicationTypes.rows.slice(startIndex, endIndex)
    return {
      count: publicationTypes.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createPublicationType(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newPublicationType = await models.PublicationTypes.create({
        name: obj.name,
        description: obj.description
      }, { transaction })
      await transaction.comit()
      return newPublicationType
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  //Return Instance if we do not converted to json (or raw:true)
  async getPublicationTypeOr404(id) {
    let publicationType = await models.PublicationTypes.findByPk(id, { raw: true })
    if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
    return publicationType
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublicationType(id) {
    let publicationType = await models.PublicationTypes.findByPk(id)
    if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
    return publicationType
  }

  async updatePublicationType(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let publicationType = await models.PublicationTypes.findByPk(id)
      if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
      let updatePublicationType = await publicationType.update(obj, { transaction })
      await transaction.commit()
      return updatePublicationType
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removePublicationType(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let publicationType = await models.PublicationTypes.findByPk(id)
      if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
      await publicationType.destroy({ transaction })
      await transaction.commit()
      return publicationType
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationTypesServices
