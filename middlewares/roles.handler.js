const ProfilesService = require('../services/profiles.service')
const { CustomError } = require('../utils/helpers')

const profileServices = new ProfilesService()
const adminValidate = async (req, res, next) => {

  try {
    const userId = req.user.id
    const admin = await profileServices.findProfileByUserID(userId)
    if (admin.role_id === 2) {
      return next()
    }
    return res.status(403).json({ message: 'Access Denny' })
  } catch (error) {
    throw new CustomError('Bad Request', 404, error)
  }
}

module.exports = {
  adminValidate
}