const mongoose = require('mongoose');

//bookShelfDB schema declaration
const BookSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true },
        currency: {type: String, required: true, default: 'AUD'},
        price: { type: mongoose.Decimal128, required: true, get: v => v?.toString() }, //price stored in Decimal128
        author: { type: String, required: true },
        year: { type: String, required: true },
        genre: { type: String, required: true },
        summary: { type: String, required: true }
    },
    {
        toJSON:   { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
        toObject: { getters: true, virtuals: false }
    }
);

module.exports = mongoose.model('Book', BookSchema);