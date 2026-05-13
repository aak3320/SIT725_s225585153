const express = require('express');
const app = express();
var PORT = process.env.PORT || 3000;

// Create HTTP server 
const http = require('http').createServer(app);

// Pass http server to socket.io
const io = require('socket.io')(http);

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));

// Store vote counts for each option
const votes = {
    "Drama": 0,
    "Action": 0,
    "Comedy": 0,
    "Horror": 0
};

// Track which socket(users) has voted 
const votedUsers = {};
let userCount = 0;

// Socket connection logic 
io.on('connection', (socket) => {
    userCount++;
    const userID = userCount; // Simple user ID based on connection count
    console.log(`User ${userID} connected`);

    // Send current vote results to the new user
    socket.emit('vote-update', votes);

    // Listen for a vote event
    socket.on('submit-vote', (option) => {

        // Check if this user already voted
        if (votedUsers[socket.id]) {
            socket.emit('already-voted', 'You have already voted!');
            return;
        }

        // Check if the option is valid
        if (!votes.hasOwnProperty(option)) {
            return;
        }

        // Record the vote
        votes[option]++;
        votedUsers[socket.id] = option;

        console.log(`User ${userID} voted for: ${option}`);

        // Send updated votes to all connected clients
        io.emit('vote-update', votes);

        // Tell everyone who voted for what
        io.emit('new-vote-notice', option);
    });

    // When user disconnects
    socket.on('disconnect', () => {
        console.log(`User ${userID} disconnected`);
        delete votedUsers[socket.id];
    });
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});