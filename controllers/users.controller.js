const UsersService = require('../services/users.service')
const { CustomError } = require('../utils/helpers')

const userServices = new UsersService()

const getAllUsers = async (req, res, next) => {
  try {
    const query = req.query
    const users = await userServices.findAndCount(query)
    const { count, currentPage, totalPages, results } = users
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const myUserId = req.user.id
    const id = req.params.id
    try {
      let scope = ''
      if (myUserId === id) {
        scope = 'view_same_user'
      } else {
        scope = 'view_public'
      }
      const user = await userServices.getUserByIdBasedOnScope(id, scope)
      return res.status(200).json({ results: { user: user } })
    } catch (error) {
      throw new CustomError('Not found User', 404, 'Not Found')
    }
  } catch (error) {
    next(error)
  }
}

const putUser = async (req, res, next) => {
  const { first_name, last_name, country_id, code_phone, phone } = req.body
  const myUserId = req.user.id
  const id = req.params.id

  try {
    if (myUserId === id) {

      if (first_name && last_name && country_id && code_phone && phone) {
        const user = await userServices.updateUser(id, { first_name, last_name, country_id, code_phone, phone })
        return res.status(200).json({ results: { user: user } })
      } else {
        throw new CustomError('missing fields to fill', 404, 'Missing Data')
      }
    } else {
      throw new CustomError('Unauthorized', 401, 'Bad Request')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  putUser
}