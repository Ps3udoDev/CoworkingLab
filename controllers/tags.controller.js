const { uploadFile } = require('../libs/awsS3')
const ProfilesService = require('../services/profiles.service')
const TagsServices = require('../services/tags.service')
const { CustomError } = require('../utils/helpers')

const tagsServices = new TagsServices()
const profileServices = new ProfilesService()

const getAllTags = async (req, res, next) => {
  try {
    const { size, page, id, name, desciption } = req.query
    const tags = await tagsServices.findAndCount({ size, page, id, name, desciption })
    const { count, currentPage, totalPages, results } = tags
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

const postTag = async (req, res, next) => {
  const { name, description, image_url } = req.body
  try {
    if (name && description) {
      const tag = await tagsServices.createTag({ name, description, image_url })
      return res.status(201).json({ result: tag })
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
    return res.status(200).json({ results: tag })
  } catch (error) {
    next(error)
  }
}

const putTag = async (req, res, next) => {
  const { name, description, image_url } = req.body
  const id = req.params.id
  try {
    if (name && description) {
      const tag = await tagsServices.updateTag(id, { name, description, image_url })
      return res.status(200).json({ results: tag })
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
    const tag = await tagsServices.getTagOr404(id)
    if (!tag) return res.status(403)
    await tagsServices.removeTag(id)
    return res.status(200).json({ results: tag, message: 'removed' })
  } catch (error) {
    next(error)
  }
}

const uploadImage = async (req, res, next) => {
  const tagId = req.params.id
  const file = req.file
  const userLogin = req.user.id
  const admin = await  profileServices.findProfileByUserID(userLogin)
  try {
    if (admin.role_id === 2) {
      if (!file) throw new CustomError('No image received', 400, 'Bad Request')

      let fileKey = `public/tags/images/image-${tagId}`

      if (file.mimetype == 'image/jpg') {
        fileKey += '.jpg';
      } else if (file.mimetype == 'image/jpeg') {
        fileKey += '.jpeg';
      } else if (file.mimetype == 'image/png') {
        fileKey += '.png';
      } else {
        throw new CustomError('Unsupported image type', 400, 'Bad Request');
      }

      await uploadFile(file, fileKey)

      const bucketURL = process.env.AWS_DOMAIN + fileKey

      const tag = await tagsServices.uploadImage(bucketURL, tagId)

      return res.status(200).json({ results: { message: 'Image Added'} })
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
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
  uploadImage
}