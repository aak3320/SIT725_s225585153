var express = require("express")
const path = require('path');
var app = express()
var port = process.env.port || 3001;

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

//Function to check that enter number is numeric or not
function checkNumber(n1,n2,res) {
    const a = n1;
    const b = n2;

    if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Enter numeric value, Bad Request");
    return true;
  }
  return false;
}

// Simple Calculator

app.get("/add", (req, res) => {
  const number1 = Number(req.query.num1);
  const number2 = Number(req.query.num2);

  if (checkNumber(number1, number2, res)) return;

  res.send(`The total is: ${number1 + number2}`);
})
app.get("/sub", (req, res) => {
  const number1 = Number(req.query.num1);
  const number2 = Number(req.query.num2);

  if (checkNumber(number1, number2, res)) return;

  res.send(`The total is: ${number1 - number2}`);
})
app.get("/mul", (req, res) => {
  const number1 = Number(req.query.num1);
  const number2 = Number(req.query.num2);

  if (checkNumber(number1, number2, res)) return;

  res.send(`The total is: ${number1 * number2}`);
})
app.get("/div", (req, res) => {
  const number1 = Number(req.query.num1);
  const number2 = Number(req.query.num2);

  if (checkNumber(number1, number2, res)) return;

  if (number2 == 0) {
     return res.status(400).send("Enter any other numeric except 0, Bad Request");
   }

  res.send(`The total is: ${number1 / number2}`);
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});