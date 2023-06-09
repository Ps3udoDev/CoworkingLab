const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class RolesService {

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

    const roles = await models.Roles.findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(roles.count / (size ? size : roles.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : roles.count);
    const endIndex = startIndex + Number(size ? size : roles.count);

    const results = page > totalPages ? [] : roles.rows.slice(startIndex, endIndex)
    return {
      count: roles.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createRole({ name }) {
    const transaction = await models.sequelize.transaction()
    try {
      let newRole = await models.Roles.create({
        name: name,
      }, { transaction })

      await transaction.commit()
      return newRole
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getRoleOr404(id) {
    let role = await models.Roles.findByPk(id)

    if (!role) throw new CustomError('Not found Role', 404, 'Not Found')

    return role
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getRole(id) {
    let role = await models.Roles.findByPk(id, { raw: true })
    return role
  }

  async findRoleByName(name) {
    let role = await models.Roles.findOne({ where: { name } }, { raw: true })
    return role
  }

  async updateRole(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let role = await models.Roles.findByPk(id)

      if (!role) throw new CustomError('Not found role', 404, 'Not Found')

      let updatedRole = await role.update(obj, { transaction })

      await transaction.commit()

      return updatedRole
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeRole(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let role = await models.Roles.findByPk(id)
      if (!role) throw new CustomError('Not found role', 404, 'Not Found')
      await role.destroy({ transaction })
      await transaction.commit()
      return role
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = RolesService