const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllPublications, postPublication } = require('../controllers/publication.controller')

router.route('/')
  .get(getAllPublications)
  .post(passport.authenticate('jwt', { session: false }), postPublication)

module.exports = router