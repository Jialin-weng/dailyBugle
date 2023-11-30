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

app.post("/articleChange", (req, res) => {
  const database = client.db('DailyBugle');
  const article = database.collection('Articles');

  // Assuming req.body contains the ad_id and other relevant information
  const { article_id, article_title, article_content, article_edited } = req.body;

  // Convert the ad_id to ObjectId
  const articleObjectId = new ObjectId(article_id);

  // Update the ad's clicked array
  article.updateOne(
    { _id: articleObjectId },
    {
      $set: {
        title: article_title,
        editedDate: article_edited,
        body: article_content
      }
    },
    (err, result) => {
      if (err) {
        console.error('Error updating ad:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(201).send({ success: true, message: 'Story updated successfully' });
        } else {
          res.status(404).send({ success: false, message: 'Story not found' });
        }
      }
    }
  );
});


app.post("/addComment", (req, res) => {
  const database = client.db('DailyBugle');
  const article = database.collection('Articles');

  // Assuming req.body contains the ad_id and other relevant information
  const { article_id, article_comment,user_id } = req.body;

  // Convert the ad_id to ObjectId
  const articleObjectId = new ObjectId(article_id);

  // Update the ad's clicked array
  article.updateOne(
    { _id: articleObjectId },
    {
      $addToSet: { comments: {user_id,article_comment} }
    },
    (err, result) => {
      if (err) {
        console.error('Error updating ad:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(201).send({ success: true, message: 'comment added successfully' });
        } else {
          res.status(404).send({ success: false, message: 'Story not found' });
        }
      }
    }
  );
});
