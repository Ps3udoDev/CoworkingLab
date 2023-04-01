const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllPublications, postPublication, getPublicationById, deletePublication } = require('../controllers/publication.controller')

router.route('/')
  .get(getAllPublications)
  .post(passport.authenticate('jwt', { session: false }), postPublication)

router.route('/:id')
  .get(getPublicationById)
  .delete(passport.authenticate('jwt', { session: false }), deletePublication)
module.exports = router