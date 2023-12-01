const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors'); // Import the cors middleware
const app = express();
const url = "mongodb://host.docker.internal:27017/";
const client = new MongoClient(url);
const port = 3004;
app.use(express.json());
app.use(cors());
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, '0.0.0.0', () => console.log(`listening on port ${port}`));

app.get("/ads", (req, res) => {
    const database = client.db('DailyBugle');
    const ads = database.collection('Ads');
    ads.find({}).toArray().then(ads => {
        res.send(ads);
    });
});

app.get('/get-ip', (req, res) => {
    // Get user's IP address
    const ipAddress = req.ip || req.connection.remoteAddress;
    res.send(ipAddress);
});


app.post("/adsClicked", (req, res) => {
    const database = client.db('DailyBugle');
    const ads = database.collection('Ads');

    // Assuming req.body contains the ad_id and other relevant information
    const { ad_id, user_id,ip_add,user_agent  } = req.body;

    // Convert the ad_id to ObjectId
    const adObjectId = new ObjectId(ad_id);
    // Update the ad's clicked array
    ads.updateOne(
        { _id: adObjectId },
        { $inc: { clicks: 1 },$addToSet: { clickedBy: {user_id,ip_add,user_agent} } },
        (err, result) => {
            if (err) {
                console.error('Error updating ad:', err);
                res.status(500).send('Internal Server Error');
            } else {
                // Check if the update was successful
                if (result.modifiedCount > 0) {
                    res.send('Ad updated successfully');
                    console.log(adObjectId)
                } else {
                    res.status(404).send('Ad not found');
                }
            }
        }
    );
});


app.post("/adsViewed", (req, res) => {
    const database = client.db('DailyBugle');
    const ads = database.collection('Ads');

    // Assuming req.body contains the ad_id and other relevant information
    const { ad_id, user_id,ip_add,user_agent  } = req.body;

    // Convert the ad_id to ObjectId
    const adObjectId = new ObjectId(ad_id);

    // Update the ad's clicked array
    ads.updateOne(
        { _id: adObjectId },
        {$inc: { views: 1 },$addToSet: { viewedBy: {user_id,ip_add,user_agent} } },
        (err, result) => {
            if (err) {
                console.error('Error updating ad:', err);
                res.status(500).send('Internal Server Error');
            } else {
                // Check if the update was successful
                if (result.modifiedCount > 0) {
                    res.send('Ad updated successfully');
                } else {
                    res.status(404).send('Ad not found');
                }
            }
        }
    );
});