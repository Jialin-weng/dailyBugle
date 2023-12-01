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
  const { article_id, article_title, article_content, article_edited,article_category,article_image } = req.body;

  // Convert the ad_id to ObjectId
  const articleObjectId = new ObjectId(article_id);

  // Update the ad's clicked array
  article.updateOne(
    { _id: articleObjectId },
    {
      $set: {
        title: article_title,
        editedDate: article_edited,
        body: article_content,
        category: article_category,
        image:article_image
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

app.post("/findArticle", async (req, res) => {
  const database = client.db('DailyBugle');
  const article = database.collection('Articles');

  const { article_title } = req.body;
console.log(article_title);
  try {
      // Convert the article_id to ObjectId

      // Find the article with the given article_id
      const articleDocument = await article.findOne({ title: article_title });
      if (articleDocument) {
          // Extract the comments array from the article document
          const articleFound = articleDocument
          console.log(articleFound)
          res.status(200).json({ success: true, articleFound });
      } else {
         console.log("notfound")
          res.status(404).json({ success: false, message: 'Article not found' });
          
      }
  } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post("/getAllComments", async (req, res) => {
  const database = client.db('DailyBugle');
  const article = database.collection('Articles');
  const { article_id } = req.body;

  try {
      // Convert the article_id to ObjectId
      const articleObjectId = new ObjectId(article_id);

      // Find the article with the given article_id
      const articleDocument = await article.findOne({ _id: articleObjectId });

      if (articleDocument) {
          // Extract the comments array from the article document
          const comments = articleDocument.comments || [];
          res.status(200).json({ success: true, comments });
      } else {
          res.status(404).json({ success: false, message: 'Article not found' });
      }
  } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
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
