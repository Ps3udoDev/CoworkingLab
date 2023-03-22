const Joi = require('joi')

const getAllPublicationsTypesSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
})

module.exports = {
  getAllPublicationsTypesSchema
}