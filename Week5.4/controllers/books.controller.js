const booksService = require('../services/books.service');

function extractValidationMessages(err) {
    return Object.values(err.errors).map(e => e.message);
}

//returns all books
exports.getAllBooks = async (_req, res, next) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message: 'Books retrieved successfully'
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
                data: null,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            statusCode: 200,
            data: book,
            message: 'Book retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

//create a new book (safe write)
exports.createBook = async (req, res, next) => {
    try {
        const body = req.body;
 
        //Reject unexpected fields
        const unknownFields = Object.keys(body).filter(
            k => !booksService.ALLOWED_FIELDS.includes(k)
        );
        if (unknownFields.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                data:       null,
                message:    `Unknown field(s) not allowed: ${unknownFields.join(', ')}`
            });
        }
 
        //Mongoose schema validation for createBook
        const created = await booksService.createBook(body);
 
        res.status(201).json({
            statusCode: 201,
            data:       created,
            message:    'Book created successfully',
        });
 
    } catch (err) {

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                statusCode: 400,
                data:       null,
                message:    extractValidationMessages(err).join('; ')
            });
        }
        
        if (err.code === 11000) {
            return res.status(409).json({
                statusCode: 409,
                data:       null,
                message:    `A book with that id already exists`
            });
        }
        next(err);
        
    }
};
 
//update an existing book (safe write) 
exports.updateBook = async (req, res, next) => {
    try {
        const body   = req.body;
        const bookId = req.params.id;
 
        //id cannot be changed
        if (body.id !== undefined) {
            return res.status(400).json({
                statusCode: 400,
                data:       null,
                message:    'Field "id" is immutable and cannot be changed via update'
            });
        }
 
        //Reject unexpected fields
        const unknownFields = Object.keys(body).filter(
            k => !booksService.ALLOWED_FIELDS.includes(k)
        );
        if (unknownFields.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                data:       null,
                message:    `Unknown field(s) not allowed: ${unknownFields.join(', ')}`
            });
        }
 
        //Mongoose schema validation runs inside updateBook()
        const updated = await booksService.updateBook(bookId, body);
 
        if (!updated) {
            return res.status(404).json({
                statusCode: 404,
                data:       null,
                message:    'Book not found'
            });
        }
 
        res.status(200).json({
            statusCode: 200,
            data:       updated,
            message:    'Book updated successfully',
            developedBy: 's225585153'
        });
 
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                statusCode: 400,
                data:       null,
                message:    extractValidationMessages(err).join('; ')
            });
        }
        next(err);
    }
};