const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllPublications, postPublication, getPublicationById, deletePublication, postVotePublication } = require('../controllers/publication.controller')

router.route('/')
  .get(getAllPublications)
  .post(passport.authenticate('jwt', { session: false }), postPublication)

router.route('/:id')
  .get(getPublicationById)
  .delete(passport.authenticate('jwt', { session: false }), deletePublication)

router.post('/:id/vote', passport.authenticate('jwt', { session: false }), postVotePublication)

module.exports = router