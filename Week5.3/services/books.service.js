const books = require('../models/book.model');
 
// Return all books
const getAllBooks = async () => {
    return books.find({}).lean({ getters: true });
};
 
// Return one book based on id
const getBookById = async (id) => {
    return books.find({ id: id }).lean({ getters: true });
};
 
module.exports = { getAllBooks, getBookById };