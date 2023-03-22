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

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
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

    const publicationTypes = await models.PublicationsTypes.findAndCountAll(options)
    return publicationTypes
  }

  async createPublicationType(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newPublicationType = await models.PublicationsTypes.create({
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
    let publicationType = await models.PublicationsTypes.findByPk(id, { raw: true })
    if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
    return publicationType
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublicationType(id) {
    let publicationType = await models.PublicationsTypes.findByPk(id)
    if (!publicationType) throw new CustomError('Not found Publication Type', 404, 'Not Found')
    return publicationType
  }

  async updatePublicationType(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let publicationType = await models.PublicationsTypes.findByPk(id)
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
      let publicationType = await models.PublicationsTypes.findByPk(id)
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
