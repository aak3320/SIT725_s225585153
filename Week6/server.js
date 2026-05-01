var express = require("express")
const path = require('path');
var app = express();
var port = process.env.port || 3001;

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}
function kilometersToMiles(kilometers) {
    return kilometers * 0.621371;
}
function kilogramsToPounds(kilograms) {
    return kilograms * 2.20462;
}

// GET method for the temperature conversion
app.get('/convert/temperature', (req, res) => {

    const celsius = parseFloat(req.query.celsius);

    if (isNaN(celsius)) {
        return res.status(400).json({ error: 'Invalid input. Please provide a valid number for Celsius.' });
    }

    const fahrenheit = celsiusToFahrenheit(celsius);
    return res.send(`${celsius} degrees Celsius is equal to ${fahrenheit.toFixed(2)} degrees Fahrenheit.`);
});

// GET method for the distance conversion
app.get('/convert/distance', (req, res) => {

    const kilometers = parseFloat(req.query.kilometers);

    if (isNaN(kilometers) || kilometers < 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a valid number for Kilometres.' });
    }

    const miles = kilometersToMiles(kilometers);
    return res.send(`${kilometers} km is equal to ${miles.toFixed(2)} miles.`);
});

// GET method for the weight conversion
app.get('/convert/weight', (req, res) => {

    const kilograms = parseFloat(req.query.kilograms);

    if (isNaN(kilograms) || kilograms < 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a valid number for Kilograms.' });
    }

    const pounds = kilogramsToPounds(kilograms);
    return res.send(`${kilograms} kg is equal to ${pounds.toFixed(2)} lbs.`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});