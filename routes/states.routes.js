const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllStates } = require('../controllers/states.controller')

router.get('/', passport.authenticate('jwt', { session: false }), getAllStates)

module.exports = router