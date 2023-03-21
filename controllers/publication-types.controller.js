const PublicationTypesServices = require('../services/publication-types.service')
const { CustomError } = require('../utils/helpers')

const publicationTypesServices = new PublicationTypesServices()

const getAllPublicationsTypes = async (req, res, next) => {
  try {
    const publicationTypes = await publicationTypesServices.getAllPublicationsTypes()
    return res.status(200).json({ results: { 'publications-types': publicationTypes } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllPublicationsTypes
}