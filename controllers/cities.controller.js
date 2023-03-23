const CitiesCervices = require('../services/cities.service')
const { CustomError } = require('../utils/helpers')

const citiesServices = new CitiesCervices()

const getAllCities = async (req, res, next) => {
  try {
    const { limit, offset, id, name } = req.query
    const cities = await citiesServices.findAndCount({ limit, offset, id, name })
    return res.status(200).json({ results: { cities: cities } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCities
}