const { z } = require("zod");

const productSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),

    price: z
        .number()
        .positive("Price must be greater than 0")
});

module.exports = {
    productSchema
};