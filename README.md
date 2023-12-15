# YouTube Subscribers API
This project is a Node.js application that provides an API for retrieving YouTube subscribers data from a MongoDB database. The API is built using Express.

# Installation
Clone the repository: git clone <repository_url>
Navigate to the project directory: cd <project_directory>
Install the dependencies: npm install

# Configuration
Before running the application, make sure to set up the required configuration variables:

Open the index.js file and update the following variables:
DATABASE_URL: MongoDB connection URI for your database
PORT: Port number on which the API will run (default is 3000)

# Usage
Start the application from the root directory: node src/index.js
The API will be accessible at http://localhost:3000/

# API Routes
To retrieve all subscribers data: GET /subscribers
To retrieve only the name and subscribed channel for each subscriber: GET /subscribers/name
To retrieve data for a specific subscriber using their ID: GET /subscribers/id

# Live Demo
You can access the live demo of the API at https://youtube-subscribers-teiw.onrender.com/

# Testing
The project utilizes Mocha for testing. To run the tests, execute the following command:
npx mocha test

# API Documentation
You can find the API documentation using Postman at https://documenter.getpostman.com/view/31795607/2s9Ykkg3Vj

Feel free to explore and use the API.
