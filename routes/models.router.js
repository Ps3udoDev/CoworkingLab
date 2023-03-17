const express = require('express')
// const routesUsers = require('./users.routes')

// const isAuthenticatedByPassportJwt = require('../libs/passport')

const docsRouter = require('./docs.routes')
const routesAuth = require('./auth.routes')


function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)
  router.use('/docs', docsRouter)
}

module.exports = routerModels
