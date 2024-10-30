const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path'); // Importing the path module
const { MongoClient, ObjectId } = require('mongodb');
const { log } = require('console');



const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

app.set('view engine', 'ejs');
app.set('views', 'views'); // default 'views'
app.use(express.static(path.join(__dirname, 'statics')));

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
    try {
        await client.connect();
        const db = client.db('My_Notes');

        res.render('html', {
            pagetitle: 'The_Form',
        });
    } catch (error) {
        console.error("Failed to fetch Notes", error);
        res.status(500).send("Error fetching Notes");
    } finally {
        await client.close();
    }
    });

app.post('/', async (req, res, next) => { 
    try {
        // Connect to the database and insert the new user
        await client.connect();
        const db = client.db('My_Notes');


        await db.collection('Notes').insertOne({
            note: req.body.note
        });

        const Notes = await db.collection('Notes').find().toArray();

        res.render('html2', {
            pagetitle: 'The_Note',
            note: req.body.note, // Pass the name from the form input
            Notes: Notes // Pass the users array to the template
        });
    } catch (error) {
        console.error("Failed to insert user or fetch users", error);
        res.status(500).send({ message: "Failed to process request", error: error.message });
    } finally {
        await client.close();
    }
   
});
app.listen(3001, () => console.log('Server listening on port 3001'));