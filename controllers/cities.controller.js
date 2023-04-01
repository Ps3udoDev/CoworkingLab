const CitiesCervices = require('../services/cities.service')
const { CustomError } = require('../utils/helpers')

const citiesServices = new CitiesCervices()

const getAllCities = async (req, res, next) => {
  try {
    const { size, page, id, name } = req.query
    const cities = await citiesServices.findAndCount({ size, page, id, name })
    const { count, currentPage, totalPages, results } = cities
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCities
}