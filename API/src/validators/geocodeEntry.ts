import Joi from "joi"

export const addressSchema = Joi.object({
    address: Joi.string().min(1).required()
})
