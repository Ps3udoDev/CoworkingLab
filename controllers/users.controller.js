const ProfilesService = require('../services/profiles.service')
const PublicationsServices = require('../services/publications.service')
const UsersService = require('../services/users.service')
const { CustomError } = require('../utils/helpers')

const userServices = new UsersService()
const profileServices = new ProfilesService()
const publicationsServices = new PublicationsServices()


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
    const admin = await profileServices.findProfileByUserID(myUserId)
    try {
      let scope = 'view_another_public'
      if (admin.role_id === 2) scope = 'view_another_admin'
      if (myUserId === id) scope = 'view_same_user'
      const user = await userServices.getUserByIdBasedOnScope(id, scope)
      return res.status(200).json({ results: user })
    } catch (error) {
      throw new CustomError('Not found User', 404, 'Not Found')
    }
  } catch (error) {
    next(error)
  }
}

const putUser = async (req, res, next) => {
  const { first_name, last_name, code_phone, phone, interests } = req.body
  const myUserId = req.user.id
  const id = req.params.id

  try {
    if (myUserId === id) {

      if (first_name && last_name && code_phone && phone) {
        const user = await userServices.updateUser(id, { first_name, last_name, code_phone, phone, interests })
        return res.status(200).json({ results: { user: user } })
      } else {
        throw new CustomError('missing fields to fill', 404, 'Missing Data')
      }
    } else {
      throw new CustomError('Unauthorized', 403, 'Bad Request')
    }
  } catch (error) {
    next(error)
  }
}

const getPublicationsByUserVotes = async (req, res, next) => {
  const id = req.params.id
  try {
    const publications = await publicationsServices.getPublicationsByUserVotes(id)
    const { count, currentPage, totalPages, results } = publications
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

const getUserPublications = async (req, res, next) => {
  const id = req.params.id
  try {
    const publications = await publicationsServices.getUserPublications(id)
    const { count, currentPage, totalPages, results } = publications
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  putUser,
  getPublicationsByUserVotes,
  getUserPublications
}