const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllPublications, postPublication, getPublicationById, deletePublication, postVotePublication } = require('../controllers/publication.controller')
const {uploadImage, removeImage} = require('../controllers/publication-images.controller')
const { multerPublicationsPhotos } = require('../middlewares/multer.middleware')

router.route('/')
  .get(getAllPublications)
  .post(passport.authenticate('jwt', { session: false }), postPublication)

router.route('/:id')
  .get(getPublicationById)
  .delete(passport.authenticate('jwt', { session: false }), deletePublication)

router.post('/:id/vote', passport.authenticate('jwt', { session: false }), postVotePublication)

router.post('/:id/add-image', passport.authenticate('jwt', { session: false }), multerPublicationsPhotos.array('image', 3), uploadImage)
router.delete('/:id/remove-image/:order', passport.authenticate('jwt', { session: false }), removeImage)

module.exports = router