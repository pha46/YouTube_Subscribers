const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Routes', () => {
  describe('GET /', () => {
    it('should return the homepage HTML', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    });
  });

  describe('GET /subscribers', () => {
    it('should return all subscribers', (done) => {
      chai
        .request(app)
        .get('/subscribers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    }).timeout(10000); // Increase the timeout to 5 seconds
  });

  describe('GET /subscribers/names', () => {
    it('should return subscribers with only name and subscribedChannel', (done) => {
      chai
        .request(app)
        .get('/subscribers/names')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          res.body.forEach((subscriber) => {
            expect(subscriber).to.have.property('name');
            expect(subscriber).to.have.property('subscribedChannel');
            expect(subscriber).to.not.have.property('_id');
          });
          done();
        });
    }).timeout(10000); // Increase the timeout to 5 seconds
  });

  describe('GET /subscribers/id/:id', () => {
    it('should return the subscriber with the specified ID', (done) => {
      // Assuming you have a valid ObjectId of an existing subscriber
      const subscriberId = '65798b31d4e5cc3fdc605550';

      chai
        .request(app)
        .get('/subscribers/id/' + subscriberId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('_id', subscriberId);
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('subscribedChannel');
          done();
        });
    });

    it('should return an error for an invalid subscriber ID', (done) => {
      // Assuming you have an invalid subscriber ID
      const invalidSubscriberId = 'invalidId';

      chai
        .request(app)
        .get('/subscribers/id/' + invalidSubscriberId)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.have.property('message', 'Invalid subscriber ID');
          done();
        });
    });

    it('should return a not found error for a non-existent subscriber ID', (done) => {
      // Assuming you have a non-existent subscriber ID
      const nonExistentSubscriberId = '617387c7194e8a923bd19928';

      chai
        .request(app)
        .get('/subscribers/id/' + nonExistentSubscriberId)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.have.property('message', 'Subscriber not found');
          done();
        });
    });
  });
});