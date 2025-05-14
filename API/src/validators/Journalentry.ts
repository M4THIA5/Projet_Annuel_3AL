import Joi from "joi";

export const idValidator = Joi.object({
    id: Joi.string().required()
})

export const createValidator = Joi.object({
    types: Joi.array().allow(Joi.string()).required(),
    content: Joi.string().min(1).required(),
    district: Joi.number().required(),
}).options({abortEarly: false})


export const updateValidator = Joi.object({
    types: Joi.array().allow(Joi.string()).optional(),
    content: Joi.string().min(1).optional(),
    district: Joi.number().optional(),
}).options({abortEarly: false}).or('types', 'content', 'district')
