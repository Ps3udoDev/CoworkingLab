const router = require('express').Router()
const passport = require('../libs/passport')

const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')

const { getAllUsers } = require('../controllers/users.controller')

router.get('/', passport.authenticate('jwt', { session: false }), adminValidate, getAllUsers)

module.exports = router