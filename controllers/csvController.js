// Import required libraries and modules
const multer = require('multer'); // For handling file uploads
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs'); // For file system operations
const path = require('path'); // For working with file paths
const paginate = require('express-paginate'); // For pagination support in Express

// Define storage configuration for uploaded CSV files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name for storage
    },
});

// Create a multer middleware for handling file uploads, allowing only CSV files
const upload = multer({
    storage, // Use the defined storage configuration
    // fileFilter: (req, file, cb) => {
    //     if (!file.originalname.match(/\.(csv)$/)) {
    //         // Check if the file does not have a .csv extension
    //         return cb(new Error('Only CSV files are allowed!'));
    //     }
    //     cb(null, true); // Accept the file
    // },
}).single('csvFile'); // Handle only a single file with the field name 'csvFile'

// Function to list uploaded CSV files
exports.listCSV = (req, res) => {
    const files = fs.readdirSync('uploads/'); // Read the list of uploaded files from the 'uploads/' directory
    res.render('csvList', { files }); // Render a view (e.g., 'csvList') and pass the list of files to it
};

// Function to view CSV data in tabular form with pagination
exports.viewCSV = (req, res) => {
    const filename = req.params.filename; // Get the filename from the URL parameter
    const data = [];

    // Read the uploaded CSV file, parse it, and prepare for rendering with pagination
    fs.createReadStream(`uploads/${filename}`)
        .pipe(csv()) // Pipe the file stream through the CSV parser
        .on('data', (row) => {
            data.push(row); // Push each row of CSV data into the 'data' array
        })
        .on('end', () => {
            const pageCount = Math.ceil(data.length / 100); // Calculate the page count (assuming 100 rows per page)
            const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameter or default to page 1
            const dataSubset = data.slice((currentPage - 1) * 100, currentPage * 100); // Extract data for the current page
            const page = currentPage;
            res.render('tableView', { filename, data: dataSubset, pageCount, currentPage, page }); // Render the 'tableView' and pass relevant data for rendering
        })
        .on('error', (error) => {
            console.error('Error reading or parsing CSV:', error);
            // Handle the error, e.g., by sending an error response to the client.
        });
};

// Function to handle the file upload
exports.uploadCSV = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message); // Send an error response if file upload fails
        }

        // File uploaded successfully
        res.redirect('/list'); // Redirect to the list of uploaded CSV files or another appropriate route
    });
};



