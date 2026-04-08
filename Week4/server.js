var express = require("express");
const path = require('path');
const mongoose = require('mongoose');
var app = express();
var port = process.env.port || 3001;

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookShelfDB');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB...bookShelfDB');
});

//Schema declaration and Model
const BookSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
    author: String,
    genre: String
});

const Book = mongoose.model('Book', BookSchema);

// REST API...GET /api/books
app.get('/api/books', async (req, res) => {
    const books = await Book.find({});
    res.json({statusCode: 200, data: books, message: "Success"});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});