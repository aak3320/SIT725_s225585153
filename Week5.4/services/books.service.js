const books = require('../models/book.model');

// Any extra field will be detected in the controller and rejected with 400.
const ALLOWED_FIELDS = ['id', 'title', 'currency', 'price', 'author', 'year', 'genre', 'summary'];

// Return all books
const getAllBooks = async () => {
    return books.find({}).lean({ getters: true });
};

// Return one book based on id
const getBookById = async (id) => {
    return books.find({ id: id }).lean({ getters: true });
};

// Create a new book (safe write) 
const createBook = async (payload) => {
    const safePayload = {};
    for (const field of ALLOWED_FIELDS) {
        if (payload[field] !== undefined) safePayload[field] = payload[field];
    }

    const book = new books(safePayload);
    return book.save();            // throws ValidationError or MongoServerError 11000
};

//update book
const updateBook = async (id, payload) => {
    // Build a safe update object 
    // id is immutable so we always strip it.
    const updateData = {};
    for (const field of ALLOWED_FIELDS) {
        if (field === 'id') continue;
        if (payload[field] !== undefined) updateData[field] = payload[field];
    }

    return books.findOneAndUpdate(
        { id: id },
        { $set: updateData },
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    ).lean({ getters: true });
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, ALLOWED_FIELDS };