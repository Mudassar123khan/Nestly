const Joi = require("joi");

const listingValidationSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "string.base": "Title must be a string",
            "string.empty": "Title is required",
            "any.required": "Title is required"
        }),
    
    description: Joi.string()
        .required()
        .messages({
            "string.base": "Description must be a string",
            "string.empty": "Description is required",
            "any.required": "Description is required"
        }),

    url: Joi.string() // just the URL now
        .uri()
        .required()
        .messages({
            "string.uri": "Image must be a valid URL",
            "any.required": "Image is required"
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be less than 0",
            "any.required": "Price is required"
        }),

    location: Joi.string()
        .required()
        .messages({
            "string.base": "Location must be a string",
            "string.empty": "Location is required",
            "any.required": "Location is required"
        }),

    country: Joi.string()
        .required()
        .messages({
            "string.base": "Country must be a string",
            "string.empty": "Country is required",
            "any.required": "Country is required"
        })
});

module.exports = listingValidationSchema;