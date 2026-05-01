const expect = require('chai').expect;
const request = require('request');

const baseUrl = 'http://localhost:3001';

// REST API  endpoin testing
describe('Unit Conversion API', function() {

    it('returns status 200 to check if api works', function(done) {
        request(baseUrl, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    
    it('should return correct Fahrenheit for valid celsius input', function(done) {
        request.get(`${baseUrl}/convert/temperature?celsius=45`, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.include('113');
            done();
        });
    });

    it('should return error for invalid celsius input', function(done) {
        request.get(`${baseUrl}/convert/temperature?celsius=cold`, function(error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });

    it('should return correct miles for valid kilometer input', function(done) {
        request.get(`${baseUrl}/convert/distance?kilometers=20`, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.include('12.43');
            done();
        });
    });

    it('should return error for invalid kilometer input', function(done) {
        request.get(`${baseUrl}/convert/distance?kilometers=-5`, function(error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });

    it('should return correct pounds for valid kilogram input', function(done) {
        request.get(`${baseUrl}/convert/weight?kilograms=20`, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.include('44.09');
            done();
        });
    });

    it('should return error for invalid kilogram input', function(done) {
        request.get(`${baseUrl}/convert/weight?kilograms=-5`, function(error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });
});

// A calculation function testing

function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
};

function kilometersToMiles(kilometers) {
    return kilometers * 0.621371;
};

function kilogramsToPounds(kilograms) {
    return kilograms * 2.20462;
};

describe('Calculation Functions', function() {
    
    //Valid behaviour testing for celsiusToFahrenheit function
    it('should correctly convert 45 degrees Celsius to 113 degrees Fahrenheit', function() {
        expect(celsiusToFahrenheit(45)).to.equal(113);
    });

    //edge case testing for celsiusToFahrenheit function
    //1
    it('should return 32 degrees Fahrenheit for 0 degrees Celsius', function() {
        expect(celsiusToFahrenheit(0)).to.equal(32);
    });

    //2
    it('should handle ngative tempretures -40 degrees Fahrenheit for -40 degrees Celsius', function() {
        expect(celsiusToFahrenheit(-40)).to.equal(-40);
    });

    //Valid behaviour testing for kilometersToMiles function
    it('should correctly convert 20 kilometers to 12.43 miles', function() {
        expect(kilometersToMiles(20)).to.be.closeTo(12.43, 0.01);
    });

    //edge case testing for kilometersToMiles function
    it('should return 0 miles for 0 kilometers', function() {
        expect(kilometersToMiles(0)).to.equal(0);
    });

    //Valid behaviour testing for kilogramsToPounds function
    it('should correctly convert 20 kilograms to 44.09 pounds', function() {
        expect(kilogramsToPounds(20)).to.be.closeTo(44.09, 0.01);
    });

    //edge case testing for kilogramsToPounds function
    it('should return 0 pounds for 0 kilograms', function() {
        expect(kilogramsToPounds(0)).to.equal(0);
    });
});