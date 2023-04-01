const StatesServices = require('../services/states.service')
const { CustomError } = require('../utils/helpers')

const statesServices = new StatesServices()

const getAllStates = async (req, res, next) => {
  try {
    const { size, page, id, name } = req.query
    const states = await statesServices.findAndCount({ size, page, id, name })
    const { count, currentPage, totalPages, results } = states
    return res.status(200).json({ results: { count, totalPages, currentPage, results } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllStates
}