const express = require('express'); 
const fs = require('fs'); 
const path = require('path'); 
const uuid = require('uuid'); 

let notes = [];

const app = express();

const PORT = process.env.PORT || 3000; 


app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static('public')); 

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('/api/notes', (req, res) => { 
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error reading notes.' });
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => { 
    const newNote = {
        id: uuid.v4(), 
        title: req.body.title,
        text: req.body.text
    };

    
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error reading notes.' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
       
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), err => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error saving note.' });
            }
            
            res.json(newNote);
        });
    });
    });
    
    app.delete('/api/notes/:id', (req, res) => { 
    const id = req.params.id;

fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id !== id); 
   
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(filteredNotes), err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error deleting note.' });
        }
        
        res.json({ success: true });
    });
});
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
