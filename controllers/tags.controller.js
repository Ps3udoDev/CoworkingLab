const TagsServices = require('../services/tags.service')
const { CustomError } = require('../utils/helpers')

const tagsServices = new TagsServices()

const getAllTags = async (req, res, next) => {
  try {
    const { limit, offset, id, name, desciption } = req.query
    const tags = await tagsServices.findAndCount({ limit, offset, id, name, desciption })
    return res.status(200).json({ results: { tags: tags } })
  } catch (error) {
    next(error)
  }
}

const postTag = async (req, res, next) => {
  const { name, description, image_url } = req.body
  try {
    if (name && description && image_url) {
      const tag = await tagsServices.createTag({ name, description, image_url })
      return res.status(201).json({ message: 'Tag Added', tag: tag })
    } else {
      throw new CustomError('missing fields to fill', 404, 'Missing Data')
    }
  } catch (error) {
    next(error)
  }
}

const getTagById = async (req, res, next) => {
  const id = req.params.id
  try {
    const tag = await tagsServices.getTagOr404(id)
    return res.status(200).json({ results: { tag: tag } })
  } catch (error) {
    next(error)
  }
}

const putTag = async (req, res, next) => {
  const { name, description, image_url } = req.body
  const id = req.params.id
  try {
    if (name && description && image_url) {
      const tag = await tagsServices.updateTag(id, { name, description, image_url })
      return res.status(200).json({ results: { message: 'Succes Update', tag: tag } })
    } else {
      throw new CustomError('missing fields to fill', 404, 'Missing Data')
    }
  } catch (error) {
    next(error)
  }
}

const deleteTag = async (req, res, next) => {
  const id = req.params.id
  try {
    const tag = await tagsServices.removeTag(id)
    return res.status(200).json({ message: 'Tag Removed', tag: tag })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTags,
  postTag,
  getTagById,
  putTag,
  deleteTag,
}