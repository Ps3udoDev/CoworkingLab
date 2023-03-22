const express = require('express')
// const routesUsers = require('./users.routes')

// const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesDocs = require('./docs.routes')
const routesAuth = require('./auth.routes')
const routesUsers = require('./users.routes')
const routesPublicationsTypes = require('./publication-types.routes')
const routerCountries = require('./countries.routes')



function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)
  router.use('/users', routesUsers)
  router.use('/publications-types', routesPublicationsTypes)
  router.use('/countries', routerCountries)
  router.use('/docs', routesDocs)
}

module.exports = routerModels
