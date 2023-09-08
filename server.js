// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON and handling form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static files and template engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
const csvRoutes = require('./routes/csvRoutes');
app.use('/', csvRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


