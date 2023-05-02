// Dependencies: This block of code defines the external packages that this app requires in order to function.
const express = require('express'); // Express is a web application framework for Node.js
const fs = require('fs'); // fs (File System) is a built-in Node.js module that provides functionality for working with files and directories.
const path = require('path'); // path is a built-in Node.js module that provides utility functions for working with file and directory paths.
const uuid = require('uuid'); // uuid is a package that generates random unique identifiers.

// Define an empty array to hold the notes
let notes = [];

// Create an instance of express: We create a new instance of the Express application to handle incoming requests and responses.
const app = express();

// Set the port: We specify a port number that the server will listen on for incoming requests.
const PORT = process.env.PORT || 3000; // PORT is an environment variable that is used by hosting services like Heroku. If it's not set, the app will use port 3000 as a default.

// Set up middleware: This block of code sets up middleware that will be used to handle incoming requests.
app.use(express.urlencoded({ extended: true })); // This middleware is used to parse incoming request bodies in a URL-encoded format.
app.use(express.json()); // This middleware is used to parse incoming request bodies in a JSON format.
app.use(express.static('public')); // This middleware is used to serve static files (e.g., CSS, JavaScript, images) in the 'public' directory.

// Routes: These are the routes that the application will respond to.
// HTML routes: These routes are used to serve the HTML files to the client.
app.get('/', (req, res) => { // When a GET request is sent to the root URL of the server, it will respond by sending the index.html file.
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => { // When a GET request is sent to the '/notes' URL of the server, it will respond by sending the notes.html file.
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API routes: These routes are used to handle API requests (e.g., retrieving, creating, deleting notes).
app.get('/api/notes', (req, res) => { // When a GET request is sent to the '/api/notes' URL of the server, it will read the notes from the db.json file and return them as a JSON response.
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error reading notes.' });
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => { // When a POST request is sent to the '/api/notes' URL of the server, it will create a new note with a unique ID and save it to the db.json file.
    const newNote = {
        id: uuid.v4(), // A new unique ID is generated using the uuid package.
        title: req.body.title,
        text: req.body.text
    };

    // Read the current notes from the db.json file
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error reading notes.' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote); // Add the new note to the existing array of notes
        // Write the updated notes array to the db.json file
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), err => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error saving note.' });
            }
            // Return the new note in the response
            res.json(newNote);
        });
    });
    });
    
    app.delete('/api/notes/:id', (req, res) => { // When a DELETE request is sent to the '/api/notes/:id' URL of the server, it will delete the note with the specified ID from the db.json file.
    const id = req.params.id;
// Read the current notes from the db.json file
fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id !== id); // Filter out the note with the specified ID
    // Write the updated notes array to the db.json file
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(filteredNotes), err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error deleting note.' });
        }
        // Return success in the response
        res.json({ success: true });
    });
});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
