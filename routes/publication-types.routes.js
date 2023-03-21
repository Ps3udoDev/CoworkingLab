const router = require('express').Router()
const verifySchema = require('../schemas/joiSchema.checker')

const { getAllPublicationsTypesSchema } = require('../schemas/publicationType.schema')
const { getAllPublicationsTypes } = require('../controllers/publication-types.controller')

router.route('/')
  .get(getAllPublicationsTypes)

module.exports = router