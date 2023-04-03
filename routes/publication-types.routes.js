const router = require('express').Router()
const passport = require('../libs/passport');
const verifySchema = require('../schemas/joiSchema.checker')
const { adminValidate } = require('../middlewares/roles.handler')


const { getAllPublicationsTypesSchema } = require('../schemas/publicationType.schema')
const { getAllPublicationsTypes, getPublicationTypeById, putPublicationType } = require('../controllers/publication-types.controller')

router.route('/')
  .get(passport.authenticate('jwt', { session: false }), getAllPublicationsTypes)

router.route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getPublicationTypeById)
  .put(passport.authenticate('jwt', { session: false }), adminValidate, putPublicationType)

module.exports = router