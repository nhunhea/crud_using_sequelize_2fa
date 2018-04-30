const baseJoi = require('joi');
const extens = require('joi-date-extensions');
const Joi = baseJoi.extend(extens);

module.exports = Joi.object().keys({
  username: Joi.error(new Error('Username is required.')).required(),
  user_email: Joi.string().email().error(new Error('Email is invalid.')).required(),
})
