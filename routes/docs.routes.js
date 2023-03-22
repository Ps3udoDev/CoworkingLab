const swaggerUi = require('swagger-ui-express')
const router = require('express').Router()

const YAML = require('yamljs')

const swaggerSpec = YAML.load('./docs/VPseudo11-For-When_API-1.0.0-resolved.yaml')

router.use('/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec))

module.exports = router