const router = require('express').Router()
const passport = require('../libs/passport')

const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')
const { multerPublicationsPhotos } = require('../middlewares/multer.middleware')

const { getAllUsers, getUserById, putUser, getPublicationsByUserVotes, getUserPublications, uploadImage, removeImage } = require('../controllers/users.controller')

router.get('/', passport.authenticate('jwt', { session: false }), adminValidate, getAllUsers)
router.route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById)
  .put(passport.authenticate('jwt', { session: false }), putUser)

router.get('/:id/votes', passport.authenticate('jwt', { session: false }), getPublicationsByUserVotes)
router.get('/:id/publications', passport.authenticate('jwt', { session: false }), getUserPublications)
router.post('/:id/add-image', passport.authenticate('jwt', { session: false }), multerPublicationsPhotos.single('image'), uploadImage)
router.delete('/:id/remove-image', passport.authenticate('jwt', { session: false }), removeImage)

module.exports = router