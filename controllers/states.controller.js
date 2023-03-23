const StatesServices = require('../services/states.service')
const { CustomError } = require('../utils/helpers')

const statesServices = new StatesServices()

const getAllStates = async (req, res, next) => {
  try {
    const { limit, offset, id, name } = req.query
    const states = await statesServices.findAndCount({ limit, offset, id, name })
    return res.status(200).json({ results: { states: states } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllStates
}