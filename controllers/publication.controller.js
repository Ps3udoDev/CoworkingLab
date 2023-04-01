const PublicationsServices = require('../services/publications.service')
const { CustomError } = require('../utils/helpers')

const publicarionServices = new PublicationsServices()

const getAllPublications = async (req, res, next) => {
  try {
    const { limit, offset, tags, id, publication_type_id, title, description, content, reference_link } = req.query
    const publications = await publicarionServices.findAndCount({ limit, offset, tags, id, publication_type_id, title, description, content, reference_link })
    return res.status(200).json({ results: { publications: publications } })
  } catch (error) {
    next(error)
  }
}

const postPublication = async (req, res, next) => {
  try {
    const user_id = req.user.id
    const { publication_type_id, city_id, title, description, content, reference_link, tags } = req.body
    if (publication_type_id && city_id && title && description && content && reference_link && tags) {
      const newPublication = await publicarionServices.createPublication({ user_id, publication_type_id, city_id, title, description, content, reference_link },tags)
      return res.status(201).json({results: {publication: newPublication}})
    } else {
      throw new CustomError('Missing Data', 404, 'Not Found')
    }
  } catch (error) {
    next(error)
  }
} 

const getPublicationById = async (req, res, next) => {
  try {
    const id = req.params.id
    try {
      const publication = await publicarionServices.getPublicationOr404(id)
      return res.status(200).json({ results: { publication: publication } })
    } catch (error) {
      throw new CustomError('Not found Publication', 404, 'Not Found')
    }
  } catch (error) {
    next(error)
  }
}

const deletePublication = async (req, res, next)=>{
  try {
    const id = req.params.id
    const userId = req.user.id
    try {
      console.log(id)
      const publication = await publicarionServices.removePublication(id, userId)
      return res.status(200).json({ results: { publication: publication } })
    } catch (error) {
      throw new CustomError('Not found Publication', 404, 'Not Found')
    }
  } catch (error) {
    next(error)
  }
}



module.exports = {
  getAllPublications,
  postPublication,
  getPublicationById,
  deletePublication
}