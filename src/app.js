const express = require('express');
const fs = require('fs');
const app = express();
const subscriberModel = require('./models/subscribers');
const path = require('path');
const { ObjectId } = require('mongodb');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route with selectable links and input field
app.get('/', (req, res) => {
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading file' });
    } else {
      res.send(data);
    }
  });
});

// GET all subscribers
app.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await subscriberModel.find();
    const formattedResponse = JSON.stringify(subscribers, null, 2);
    res.type('json').send(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET subscribers with only name and subscribedChannel
app.get('/subscribers/names', async (req, res) => {
  try {
    const subscribers = await subscriberModel.find({}, { name: 1, subscribedChannel: 1, _id: 0 });
    const formattedResponse = JSON.stringify(subscribers, null, 2);
    res.type('json').send(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET subscribers with their id
app.get('/subscribers/id/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid subscriber ID' });
      }
  
      const subscriber = await subscriberModel.findById(id);
  
      // Check if the provided id is not in the database 
      if (!subscriber) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
  
      const formattedSubscriber = JSON.stringify(subscriber, null, 2);
      res.type('json').send(formattedSubscriber);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


module.exports = app;