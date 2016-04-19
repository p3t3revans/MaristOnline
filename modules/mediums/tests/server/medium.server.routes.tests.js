'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Medium = mongoose.model('Medium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  medium;

/**
 * Medium routes tests
 */
describe('Medium CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new medium
    user.save(function () {
      medium = {
        title: 'Medium Title',
        content: 'Medium Content'
      };

      done();
    });
  });

  it('should be able to save an medium if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new medium
        agent.post('/api/mediums')
          .send(medium)
          .expect(200)
          .end(function (mediumSaveErr, mediumSaveRes) {
            // Handle medium save error
            if (mediumSaveErr) {
              return done(mediumSaveErr);
            }

            // Get a list of mediums
            agent.get('/api/mediums')
              .end(function (mediumsGetErr, mediumsGetRes) {
                // Handle medium save error
                if (mediumsGetErr) {
                  return done(mediumsGetErr);
                }

                // Get mediums list
                var mediums = mediumsGetRes.body;

                // Set assertions
                (mediums[0].user._id).should.equal(userId);
                (mediums[0].title).should.match('Medium Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an medium if not logged in', function (done) {
    agent.post('/api/mediums')
      .send(medium)
      .expect(403)
      .end(function (mediumSaveErr, mediumSaveRes) {
        // Call the assertion callback
        done(mediumSaveErr);
      });
  });

  it('should not be able to save an medium if no title is provided', function (done) {
    // Invalidate title field
    medium.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new medium
        agent.post('/api/mediums')
          .send(medium)
          .expect(400)
          .end(function (mediumSaveErr, mediumSaveRes) {
            // Set message assertion
            (mediumSaveRes.body.message).should.match('Title cannot be blank');

            // Handle medium save error
            done(mediumSaveErr);
          });
      });
  });

  it('should be able to update an medium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new medium
        agent.post('/api/mediums')
          .send(medium)
          .expect(200)
          .end(function (mediumSaveErr, mediumSaveRes) {
            // Handle medium save error
            if (mediumSaveErr) {
              return done(mediumSaveErr);
            }

            // Update medium title
            medium.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing medium
            agent.put('/api/mediums/' + mediumSaveRes.body._id)
              .send(medium)
              .expect(200)
              .end(function (mediumUpdateErr, mediumUpdateRes) {
                // Handle medium update error
                if (mediumUpdateErr) {
                  return done(mediumUpdateErr);
                }

                // Set assertions
                (mediumUpdateRes.body._id).should.equal(mediumSaveRes.body._id);
                (mediumUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of mediums if not signed in', function (done) {
    // Create new medium model instance
    var mediumObj = new Medium(medium);

    // Save the medium
    mediumObj.save(function () {
      // Request mediums
      request(app).get('/api/mediums')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single medium if not signed in', function (done) {
    // Create new medium model instance
    var mediumObj = new Medium(medium);

    // Save the medium
    mediumObj.save(function () {
      request(app).get('/api/mediums/' + mediumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', medium.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single medium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mediums/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Medium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single medium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent medium
    request(app).get('/api/mediums/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No medium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an medium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new medium
        agent.post('/api/mediums')
          .send(medium)
          .expect(200)
          .end(function (mediumSaveErr, mediumSaveRes) {
            // Handle medium save error
            if (mediumSaveErr) {
              return done(mediumSaveErr);
            }

            // Delete an existing medium
            agent.delete('/api/mediums/' + mediumSaveRes.body._id)
              .send(medium)
              .expect(200)
              .end(function (mediumDeleteErr, mediumDeleteRes) {
                // Handle medium error error
                if (mediumDeleteErr) {
                  return done(mediumDeleteErr);
                }

                // Set assertions
                (mediumDeleteRes.body._id).should.equal(mediumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an medium if not signed in', function (done) {
    // Set medium user
    medium.user = user;

    // Create new medium model instance
    var mediumObj = new Medium(medium);

    // Save the medium
    mediumObj.save(function () {
      // Try deleting medium
      request(app).delete('/api/mediums/' + mediumObj._id)
        .expect(403)
        .end(function (mediumDeleteErr, mediumDeleteRes) {
          // Set message assertion
          (mediumDeleteRes.body.message).should.match('User is not authorized');

          // Handle medium error error
          done(mediumDeleteErr);
        });

    });
  });

  it('should be able to get a single medium that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new medium
          agent.post('/api/mediums')
            .send(medium)
            .expect(200)
            .end(function (mediumSaveErr, mediumSaveRes) {
              // Handle medium save error
              if (mediumSaveErr) {
                return done(mediumSaveErr);
              }

              // Set assertions on new medium
              (mediumSaveRes.body.title).should.equal(medium.title);
              should.exist(mediumSaveRes.body.user);
              should.equal(mediumSaveRes.body.user._id, orphanId);

              // force the medium to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the medium
                    agent.get('/api/mediums/' + mediumSaveRes.body._id)
                      .expect(200)
                      .end(function (mediumInfoErr, mediumInfoRes) {
                        // Handle medium error
                        if (mediumInfoErr) {
                          return done(mediumInfoErr);
                        }

                        // Set assertions
                        (mediumInfoRes.body._id).should.equal(mediumSaveRes.body._id);
                        (mediumInfoRes.body.title).should.equal(medium.title);
                        should.equal(mediumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single medium if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new medium model instance
    medium.user = user;
    var mediumObj = new Medium(medium);

    // Save the medium
    mediumObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new medium
          agent.post('/api/mediums')
            .send(medium)
            .expect(200)
            .end(function (mediumSaveErr, mediumSaveRes) {
              // Handle medium save error
              if (mediumSaveErr) {
                return done(mediumSaveErr);
              }

              // Get the medium
              agent.get('/api/mediums/' + mediumSaveRes.body._id)
                .expect(200)
                .end(function (mediumInfoErr, mediumInfoRes) {
                  // Handle medium error
                  if (mediumInfoErr) {
                    return done(mediumInfoErr);
                  }

                  // Set assertions
                  (mediumInfoRes.body._id).should.equal(mediumSaveRes.body._id);
                  (mediumInfoRes.body.title).should.equal(medium.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (mediumInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single medium if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new medium model instance
    var mediumObj = new Medium(medium);

    // Save the medium
    mediumObj.save(function () {
      request(app).get('/api/mediums/' + mediumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', medium.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single medium, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Medium
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new medium
          agent.post('/api/mediums')
            .send(medium)
            .expect(200)
            .end(function (mediumSaveErr, mediumSaveRes) {
              // Handle medium save error
              if (mediumSaveErr) {
                return done(mediumSaveErr);
              }

              // Set assertions on new medium
              (mediumSaveRes.body.title).should.equal(medium.title);
              should.exist(mediumSaveRes.body.user);
              should.equal(mediumSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the medium
                  agent.get('/api/mediums/' + mediumSaveRes.body._id)
                    .expect(200)
                    .end(function (mediumInfoErr, mediumInfoRes) {
                      // Handle medium error
                      if (mediumInfoErr) {
                        return done(mediumInfoErr);
                      }

                      // Set assertions
                      (mediumInfoRes.body._id).should.equal(mediumSaveRes.body._id);
                      (mediumInfoRes.body.title).should.equal(medium.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (mediumInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Medium.remove().exec(done);
    });
  });
});
