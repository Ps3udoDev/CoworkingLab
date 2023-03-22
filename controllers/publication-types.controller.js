const PublicationTypesServices = require('../services/publication-types.service')
const { CustomError } = require('../utils/helpers')

const publicationTypesServices = new PublicationTypesServices()

const getAllPublicationsTypes = async (req, res, next) => {
  try {
    const { limit, offset, id, name, description } = req.query
    const publicationTypes = await publicationTypesServices.findAndCount({ limit, offset, id, name, description })
    return res.status(200).json({ results: { 'publications-types': publicationTypes } })
  } catch (error) {
    next(error)
  }
}

const getPublicationTypeById = async (req, res, next) => {
  try {
    const id = req.params.id
    const publicationType = await publicationTypesServices.getPublicationTypeOr404(id)
    return res.status(200).json({ results: { 'publication-type': publicationType } })
  } catch (error) {
    next(error)
  }
}

const putPublicationType = async (req, res, next) => {
  try {
    const id = req.params.id
    const { name, description } = req.body
    if (name && description) {
      const publicationType = await publicationTypesServices.updatePublicationType(id, { name, description })
      return res.status(200).json({ messages: 'Succes Update' })
    } else {
      throw new CustomError('missing fields to fill', 404, 'Missing Data')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllPublicationsTypes,
  getPublicationTypeById,
  putPublicationType,
}