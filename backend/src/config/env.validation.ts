import * as Joi from 'joi'

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),

    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),

    ACCESS_EXPIRES: Joi.string().default('15m'),
    REFRESH_EXPIRES: Joi.string().default('7d'),

    DATABASE_URL: Joi.string().required(),

    MAIL_HOST: Joi.string(),
    MAIL_PORT: Joi.number(),
    MAIL_USER: Joi.string(),
    MAIL_PASS: Joi.string(),
    MAIL_FROM: Joi.string(),
})
