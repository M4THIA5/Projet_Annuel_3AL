import Joi from "joi"

export const createGroupValidator = Joi.object({
    name: Joi.string().required(),
    users: Joi.array().required().items(Joi.string())
}).options({abortEarly:false})
