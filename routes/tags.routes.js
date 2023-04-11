const router = require('express').Router()
const passport = require('../libs/passport')

//const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')

const { getAllTags, getTagById, postTag, putTag, deleteTag, uploadImage } = require('../controllers/tags.controller')
const { multerPublicationsPhotos } = require('../middlewares/multer.middleware')

router.route('/')
  .get(passport.authenticate('jwt', { session: false }), getAllTags)
  .post(passport.authenticate('jwt', { session: false }), adminValidate, postTag)
router.route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getTagById)
  .put(passport.authenticate('jwt', { session: false }), adminValidate, putTag)
  .delete(passport.authenticate('jwt', { session: false }), adminValidate, deleteTag)

router.post('/:id/add-image', passport.authenticate('jwt', { session: false }),multerPublicationsPhotos.single('image'), uploadImage)

module.exports = router