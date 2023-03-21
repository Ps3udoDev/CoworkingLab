const UsersService = require('../services/users.service')
const { CustomError } = require('../utils/helpers')

const userServices = new UsersService()

const getAllUsers = async (req, res, next) => {
  try {
    const { first_name, last_name, email, username, email_verified, country_id, code_phone, phone, created_at } = req.query
    const users = await userServices.findAndCount({ first_name, last_name, email, username, email_verified, country_id, code_phone, phone, created_at })
    return res.status(200).json({ results: { users: users } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers
}