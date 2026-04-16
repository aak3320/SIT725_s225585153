var express = require("express")
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

// Books route
const booksRoute = require('./routes/books.routes');

app.use('/api/books', booksRoute);

// GET /api/integrity-check42
app.get('/api/integrity-check42', (_req, res) => {
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});