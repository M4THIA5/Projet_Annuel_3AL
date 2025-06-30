import Joi from 'joi';

export const idValidator = Joi.object({
    id: Joi.string().required()
});

export const createValidator = Joi.object({
    userId: Joi.string().required(),
    neighborhoodId: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().optional()
});

export const updateValidator = Joi.object({
    userId: Joi.string().optional(),
    neighborhoodId: Joi.string().optional(),
    content: Joi.string().optional(),
    type: Joi.string().optional()
});

export const neighborhoodIdValidator = Joi.object({
    neighborhoodId: Joi.string().required()
});
