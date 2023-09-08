// Import necessary modules and controllers
const express = require('express'); // Import the Express.js framework
const router = express.Router(); // Create a router instance for defining routes
const csvController = require('../controllers/csvController'); // Import the CSV controller module

// Define routes

// Route for the root URL ("/")
router.get('/', (req, res) => {
    res.render('index'); // Render the 'index.ejs' template when the root URL is accessed
});

// Route to handle the POST request for uploading a CSV file
router.post('/upload', csvController.uploadCSV);

// Route to handle the GET request for listing uploaded CSV files
router.get('/list', csvController.listCSV);

// Route to handle the GET request for viewing CSV data in tabular form
router.get('/view/:filename', csvController.viewCSV);

// Export the router instance to be used by other parts of the application
module.exports = router;


