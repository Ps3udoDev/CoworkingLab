const router = require('express').Router()
const passport = require('../libs/passport')

//const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')

const { getAllTags, getTagById, postTag, putTag, deleteTag } = require('../controllers/tags.controller')

router.route('/')
  .get(passport.authenticate('jwt', { session: false }), getAllTags)
  .post(passport.authenticate('jwt', { session: false }), adminValidate, postTag)
router.route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getTagById)
  .put(passport.authenticate('jwt', { session: false }), adminValidate, putTag)
  .delete(passport.authenticate('jwt', { session: false }), adminValidate, deleteTag)

module.exports = router