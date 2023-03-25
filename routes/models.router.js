const express = require('express')
// const routesUsers = require('./users.routes')

// const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesDocs = require('./docs.routes')
const routesAuth = require('./auth.routes')
const routesUsers = require('./users.routes')
const routesPublicationsTypes = require('./publication-types.routes')
const routesTags = require('./tags.routes')
const routerCountries = require('./countries.routes')
const routerStates = require('./states.routes')
const routerCities = require('./cities.routes')
const routerRoles = require('./roles.routes')

function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  app.use('/api-docs', routesDocs)
  router.use('/auth', routesAuth)
  router.use('/users', routesUsers)
  router.use('/publications-types', routesPublicationsTypes)
  router.use('/tags', routesTags)
  router.use('/countries', routerCountries)
  router.use('/states', routerStates)
  router.use('/cities', routerCities)
  router.use('/roles', routerRoles)
}

module.exports = routerModels
