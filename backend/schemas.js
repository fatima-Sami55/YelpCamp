const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.campSchema = joi.object({
    campground: joi.object({
        title: joi.string().trim().min(3).max(80).required().escapeHTML(),
        location: joi.string().trim().max(120).required().escapeHTML(),
        // img: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().trim().required().escapeHTML().min(1).max(60),
    }).required(),
    deleteImages: joi.array().items(joi.string().required())
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})






