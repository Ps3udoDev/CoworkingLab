const RolesService = require('../services/roles.service')
const { CustomError } = require('../utils/helpers')

const rolesServices = new RolesService()

const getAllRoles = async (req, res, next) => {
  try {
    const { limit, offset, id, name } = req.query
    const roles = await rolesServices.findAndCount({ limit, offset, id, name })
    return res.status(200).json({ results: { roles: roles } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllRoles
}