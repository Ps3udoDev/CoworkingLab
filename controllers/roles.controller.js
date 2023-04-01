const RolesService = require('../services/roles.service')
const { CustomError } = require('../utils/helpers')

const rolesServices = new RolesService()

const getAllRoles = async (req, res, next) => {
  try {
    const { size, page, id, name } = req.query
    const roles = await rolesServices.findAndCount({ size, page, id, name })
    const { count, currentPage, totalPages, results } = roles
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllRoles
}