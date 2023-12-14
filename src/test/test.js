const request = require('supertest');
const app = require('../app.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const subscriberModel = require('../models/subscribers.js');

// Test the GET /subscribers/ endpoint
describe('GET /subscribers/', () => {
  before((done) => {
    const DATABASE_URL = "mongodb+srv://pha46:admin@cluster0.yict8pe.mongodb.net/subscribers";
    mongoose.connect(DATABASE_URL)
      .then(() => done())
      .catch((error) => done(error));
  });

  after((done) => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close())
      .then(() => done())
      .catch((error) => done(error));
  });

  it('responds with 200 status code and returns an array of subscribers', (done) => {
    request(app)
      .get('/subscribers/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) return done(error);
        const subscribers = JSON.parse(response.text);
        expect(subscribers).to.be.an('array');
        done();
      });
  });
});

// Test the GET /subscribers/names/ endpoint
describe('GET /subscribers/names/', () => {
  before((done) => {
    const DATABASE_URL = "mongodb+srv://pha46:admin@cluster0.yict8pe.mongodb.net/subscribers";
    mongoose.connect(DATABASE_URL)
      .then(() => done())
      .catch((error) => done(error));
  });

  after((done) => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close())
      .then(() => done())
      .catch((error) => done(error));
  });

  it('responds with 200 status code and returns an array of subscribers with name and subscribedChannel', (done) => {
    request(app)
      .get('/subscribers/names/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) return done(error);
        const subscribers = JSON.parse(response.text);
        expect(subscribers).to.be.an('array');
        subscribers.forEach((subscriber) => {
          expect(subscriber).to.have.property('name');
          expect(subscriber).to.have.property('subscribedChannel');
          expect(subscriber).to.not.have.property('_id');
        });
        done();
      });
  });
});

// Test the GET /subscribers/id/:id endpoint
describe('GET /subscribers/id/:id', () => {
  before((done) => {
    const DATABASE_URL = "mongodb+srv://pha46:admin@cluster0.yict8pe.mongodb.net/subscribers";
    mongoose.connect(DATABASE_URL)
      .then(() => done())
      .catch((error) => done(error));
  });

  after((done) => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close())
      .then(() => done())
      .catch((error) => done(error));
  });

  it('responds with 200 status code and returns a subscriber object for a valid ID', (done) => {
    const subscriber = { name: 'Jeread Krus', subscribedChannel: 'CNET' };
    subscriberModel.create(subscriber)
      .then((createdSubscriber) => {
        request(app)
          .get(`/subscribers/id/${createdSubscriber._id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((error, response) => {
            if (error) return done(error);
            const returnedSubscriber = response.body;
            expect(returnedSubscriber).to.include(subscriber); // Use .include() instead of .deep.include()
            expect(returnedSubscriber._id).to.equal(createdSubscriber._id.toString());
            done();
          });
      })
      .catch((error) => done(error));
  });

  it('responds with 400 status code for an invalid ID', (done) => {
    const invalidId = 'invalid_id'; // Use a random string as an invalid ID
    request(app)
      .get(`/subscribers/id/${invalidId}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((error, response) => {
        if (error) return done(error);
        const errorResponse = response.body;
        expect(errorResponse.message).to.equal('Invalid subscriber ID');
        done();
      });
  });

  it('responds with 404 status code for a non-existent ID', (done) => {
    const nonExistentId = '65798b31d4e5cc3fdc605552';
    request(app)
      .get(`/subscribers/id/${nonExistentId}`)
      .expect('Content-Type', /json/)
      .expect(404)
      .end((error, response) => {
        if (error) return done(error);
        const errorResponse = response.body;
        expect(errorResponse.message).to.equal('Subscriber not found');
        done();
      });
  });
});