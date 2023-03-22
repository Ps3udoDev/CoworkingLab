const router = require('express').Router()
const passport = require('../libs/passport')

const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')

const { getAllUsers, getUserById, putUser } = require('../controllers/users.controller')

router.get('/', passport.authenticate('jwt', { session: false }), adminValidate, getAllUsers)
router.route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById)
  .put(passport.authenticate('jwt', { session: false }), putUser)

module.exports = router