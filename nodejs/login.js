const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware
const app = express();
const url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);
const port = 3003;
// Use the cors middleware to enable cross-origin requests
app.use(express.json());
app.use(cors());
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get('/users', async (request, response) => {
    try {
        await client.connect();
        await client.db('DailyBugle').collection('Users')
        .find()
        .toArray()
        .then ( results => {
            response.send( results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

app.post('/signup', async (request, response) => {
    try {
        const { username, password,userType } = request.body;

        // Connect to the MongoDB database
        await client.connect();

        // Insert the new user into the 'Users' collection
        const result = await client.db('DailyBugle').collection('Users').insertOne({
            username,
            password,
            userType
        });

        // Send a response indicating success
        response.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
        console.error('Error creating user:', error);
        alert(error)
        response.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close the MongoDB client connection only if it was successfully connected
        client.close();
        
    }
});


