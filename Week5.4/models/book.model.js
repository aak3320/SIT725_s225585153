const mongoose = require('mongoose');

//bookShelfDB schema declaration
const BookSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, 'ID is required'],
            unique: true,
            index: true,
            trim: true,
            minlength: [1, 'ID must be contain at least 1 character'],
            maxlength: [20, 'ID must not exceed 20 characters'],
            match: [/^[a-zA-Z0-9_-]+$/, 'id may only contain letters, digits, hyphens or underscores']
        },
        title: {
            type: String,
            required: [true, 'Book title is required'],
            trim: true,
            minlength: [1, 'Title must be contain at least 1 character'],
            maxlength: [200, 'Title must not exceed 200 characters']
        },
        currency: {
            type: String,
            required: true,
            default: 'AUD',
            trim: true,
            match: [/^[A-Z]{3}$/, 'Currency must be a 3-letter ISO code (e.g. AUD)']
        },
        price: {
            type: mongoose.Decimal128,
            required: [true, 'Price is required'],
            get: v => v?.toString()
        }, //price stored in Decimal128
        author: {
            type: String,
            required: [true, 'Author name is required'],
            trim: true,
            minlength: [2, 'Author name must be contain at least 2 characters'],
            maxlength: [100, 'Author name must not exceed 100 characters']
        },
        year: {
            type: String,
            required: [true, 'Year is required'],
            trim: true,
            match: [/^\d{4}$/, 'year must be a 4-digit number'],
            validate: {
                validator(v) {
                    const n = parseInt(v, 10);
                    return n >= 1000 && n <= new Date().getFullYear();
                },
                message: `year must be between 1000 and ${new Date().getFullYear()}`
            }
        },
        genre: {
            type: String,
            required: [true, 'Genre is required'],
            trim: true,
            // Controlled vocabulary — only these values are accepted
            enum: {
                values: ['Science Fiction', 'Classic', 'Historical Fiction', 'Fantasy', 'Mystery', 'Romance', 'Non-Fiction', 'Biography', 'Thriller'],
                message: 'Genre must be one of: Science Fiction, Classic, Historical Fiction, Fantasy, Mystery, Romance, Non-Fiction, Biography, Thriller'
            }
        },
        summary: {
            type: String,
            required: [true, 'Summary is required'],
            trim: true,
            minlength: [10, 'summary must be at least 10 characters'],
            maxlength: [2000, 'summary must not exceed 2000 characters']

        }
    },
    {
        toJSON: { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
        toObject: { getters: true, virtuals: false }
    }
);

// Decimal128 has no built-in min validator, so we convert and check manually.
BookSchema.pre('validate', function (next) {
    if (this.price !== undefined && this.price !== null) {
        const num = parseFloat(this.price.toString());
        if (isNaN(num) || num <= 0) {
            this.invalidate('price', 'price must be a positive number greater than 0');
        }
    }
    next();
});

module.exports = mongoose.model('Book', BookSchema);