const booksService = require('../services/books.service');
 
//returns all books
exports.getAllBooks = async (_req, res, next) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message:    'Books retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};
 
//returns one book by its id
exports.getBookById = async (req, res, next) => {
    try {
        const book = await booksService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                data:       null,
                message:    'Book not found'
            });
        }
        res.status(200).json({
            statusCode: 200,
            data:       book,
            message:    'Book retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};