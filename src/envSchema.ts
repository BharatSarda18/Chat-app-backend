import * as Joi from 'joi';


export const validationSchema=Joi.object({
    PORT: Joi.number().default(8080),
    ALLOW_ORIGIN: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIREY: Joi.string().required(),
    MONGOURI:Joi.string().required()
})

export enum ENV{
    PORT = 'PORT',
    ALLOW_ORIGIN = 'ALLOW_ORIGIN',
    JWT_SECRET = 'JWT_SECRET',
    JWT_EXPIREY='JWT_EXPIREY',
    MONGOURI='MONGOURI'
}