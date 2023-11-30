const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors'); // Import the cors middleware
const app = express();
const url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);
const port = 3005;
app.use(express.json());
app.use(cors());
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, ()=> console.log(`listening on port ${port}`));



app.get("/articles", (req, res) => {
  const database = client.db('DailyBugle');
  const articles = database.collection('Articles');
  articles.find({}).toArray().then(articles => {
      res.send(articles);
  });
});