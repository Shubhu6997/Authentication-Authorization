const Joi = require("joi");

const schema = {
    registerSchema : Joi.object({
        name : Joi.string().required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(6).max(12)
    }),

    loginSchema : Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().min(6).max(12)
    })
}

module.exports = schema;