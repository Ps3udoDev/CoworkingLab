const router = require('express').Router()
const passport = require('../libs/passport')

const { getAllRoles } = require('../controllers/roles.controller')

router.get('/', passport.authenticate('jwt', { session: false }), getAllRoles)

module.exports = router