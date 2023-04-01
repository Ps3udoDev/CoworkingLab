const CountriesService = require('../services/countries.service');
const { CustomError } = require('../utils/helpers')

const countrieServices = new CountriesService()

const getAllCountries = async (req, res, next) => {
  try {
    const { size, page, id, name } = req.query
    const countries = await countrieServices.findAndCount({ size, page, id, name })
    const { count, currentPage, totalPages, results } = countries
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCountries
}