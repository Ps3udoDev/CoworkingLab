const CountriesService = require('../services/countries.service');
const { CustomError } = require('../utils/helpers')

const countrieServices = new CountriesService()

const getAllCountries = async (req, res, next) => {
  try {
    const { limit, offset, id, name } = req.query
    const countries = await countrieServices.findAndCount({ limit, offset, id, name })
    return res.status(200).json({ results: { countries: countries } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCountries
}