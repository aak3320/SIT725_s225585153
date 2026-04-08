const mongoose = require('mongoose');

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

const SampleBookData = [
    {
        title: "Database System Concepts",
        image: "images/Book2.png",
        link: "View more",
        description: "Provides a detailed introduction to database systems, SQL, transaction management, and database design principles.",
        author: "Abraham Silberschatz",
        genre: "Databases"
    },
    {
        title: "Deep Work",
        image: "images/Book3.png",
        link: "more",
        description: "Rules for focused success in a distracted world — a must-read for anyone serious about doing their best work.",
        author: "Cal Newport",
        genre: "Productivity"
    }
];

//Insert all books at once

Book.insertMany(SampleBookData)
    .then(() => {
        console.log('All books are inserted successfully.');
        mongoose.connection.close();
    })
    .catch(err => console.log(err));