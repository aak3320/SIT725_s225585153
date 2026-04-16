const mongoose = require('mongoose');
const books = require('../models/book.model');

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookShelfDB');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB...bookShelfDB');
});

//Sample data of book
const bookSample = [
    {
        id: "b1",
        title: "The Three-Body Problem",
        price: "30.50",
        currency: "AUD",
        author: "Liu Cixin",
        year: 2008,
        genre: "Science Fiction",
        summary: "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present, and future wherein Earth encounters an alien civilization from a nearby system of three Sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics."
    },
    {
        id: "b2",
        title: "Jane Eyre",
        price: "28.99",
        currency: "AUD",
        author: "Charlotte Brontë",
        year: 1847,
        genre: "Classic",
        summary: "An orphaned governess confronts class, morality, and love at Thornfield Hall, uncovering Mr. Rochester's secret and forging her own independence."
    },
    {
        id: "b3",
        title: "Pride and Prejudice",
        price: "30.50",
        currency: "AUD",
        author: "Jane Austen",
        year: 1813,
        genre: "Classic",
        summary: "Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations in a sharp study of manners and marriage."
    },
    {
        id: "b4",
        title: "The English Patient",
        price: "40.89",
        currency: "AUD",
        author: "Michael Ondaatje",
        year: 1992,
        genre: "Historical Fiction",
        summary: "In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts confront memory, identity, and loss."
    },
    {
        id: "b5",
        title: "Small Gods",
        price: "25.55",
        currency: "AUD",
        author: "Terry Pratchett",
        year: 1992,
        genre: "Fantasy",
        summary: "In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma, empire, and the nature of belief. The Discworld is flat and is orbited by its sun, but Omnian doctrine says that the world is round and orbits the sun."
    }
];

//Insert sample books record into database
(async () => {
    try {
        // Create unique index on id 
        await books.collection.createIndex({ id: 1 }, { unique: true });

        // Clear existing data
        await books.deleteMany({});

        // Insert all books at once
        await books.insertMany(bookSample);

        console.log('All books are inserted successfully!');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        // Close connection
        await mongoose.connection.close();
        process.exit(0);
    }
})();