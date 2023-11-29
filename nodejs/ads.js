const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware
const app = express();
const url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);
const port = 3004;
app.use(express.json());
app.use(cors());
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get("/ads", (req, res) => {
    const database = client.db('DailyBugle');
    const ads = database.collection('Ads');
    ads.find({}).toArray().then(ads => {
        res.send(ads);
    });
});
