'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Year = mongoose.model('Year'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  year;

/**
 * Year routes tests
 */
describe('Year CRUD tests', function () {

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

    // Save a user to the test db and create new year
    user.save(function () {
      year = {
        title: 'Year Title',
        content: 'Year Content'
      };

      done();
    });
  });

  it('should be able to save an year if logged in', function (done) {
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

        // Save a new year
        agent.post('/api/years')
          .send(year)
          .expect(200)
          .end(function (yearSaveErr, yearSaveRes) {
            // Handle year save error
            if (yearSaveErr) {
              return done(yearSaveErr);
            }

            // Get a list of years
            agent.get('/api/years')
              .end(function (yearsGetErr, yearsGetRes) {
                // Handle year save error
                if (yearsGetErr) {
                  return done(yearsGetErr);
                }

                // Get years list
                var years = yearsGetRes.body;

                // Set assertions
                (years[0].user._id).should.equal(userId);
                (years[0].title).should.match('Year Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an year if not logged in', function (done) {
    agent.post('/api/years')
      .send(year)
      .expect(403)
      .end(function (yearSaveErr, yearSaveRes) {
        // Call the assertion callback
        done(yearSaveErr);
      });
  });

  it('should not be able to save an year if no title is provided', function (done) {
    // Invalidate title field
    year.title = '';

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

        // Save a new year
        agent.post('/api/years')
          .send(year)
          .expect(400)
          .end(function (yearSaveErr, yearSaveRes) {
            // Set message assertion
            (yearSaveRes.body.message).should.match('Title cannot be blank');

            // Handle year save error
            done(yearSaveErr);
          });
      });
  });

  it('should be able to update an year if signed in', function (done) {
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

        // Save a new year
        agent.post('/api/years')
          .send(year)
          .expect(200)
          .end(function (yearSaveErr, yearSaveRes) {
            // Handle year save error
            if (yearSaveErr) {
              return done(yearSaveErr);
            }

            // Update year title
            year.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing year
            agent.put('/api/years/' + yearSaveRes.body._id)
              .send(year)
              .expect(200)
              .end(function (yearUpdateErr, yearUpdateRes) {
                // Handle year update error
                if (yearUpdateErr) {
                  return done(yearUpdateErr);
                }

                // Set assertions
                (yearUpdateRes.body._id).should.equal(yearSaveRes.body._id);
                (yearUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of years if not signed in', function (done) {
    // Create new year model instance
    var yearObj = new Year(year);

    // Save the year
    yearObj.save(function () {
      // Request years
      request(app).get('/api/years')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single year if not signed in', function (done) {
    // Create new year model instance
    var yearObj = new Year(year);

    // Save the year
    yearObj.save(function () {
      request(app).get('/api/years/' + yearObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', year.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single year with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/years/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Year is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single year which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent year
    request(app).get('/api/years/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No year with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an year if signed in', function (done) {
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

        // Save a new year
        agent.post('/api/years')
          .send(year)
          .expect(200)
          .end(function (yearSaveErr, yearSaveRes) {
            // Handle year save error
            if (yearSaveErr) {
              return done(yearSaveErr);
            }

            // Delete an existing year
            agent.delete('/api/years/' + yearSaveRes.body._id)
              .send(year)
              .expect(200)
              .end(function (yearDeleteErr, yearDeleteRes) {
                // Handle year error error
                if (yearDeleteErr) {
                  return done(yearDeleteErr);
                }

                // Set assertions
                (yearDeleteRes.body._id).should.equal(yearSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an year if not signed in', function (done) {
    // Set year user
    year.user = user;

    // Create new year model instance
    var yearObj = new Year(year);

    // Save the year
    yearObj.save(function () {
      // Try deleting year
      request(app).delete('/api/years/' + yearObj._id)
        .expect(403)
        .end(function (yearDeleteErr, yearDeleteRes) {
          // Set message assertion
          (yearDeleteRes.body.message).should.match('User is not authorized');

          // Handle year error error
          done(yearDeleteErr);
        });

    });
  });

  it('should be able to get a single year that has an orphaned user reference', function (done) {
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

          // Save a new year
          agent.post('/api/years')
            .send(year)
            .expect(200)
            .end(function (yearSaveErr, yearSaveRes) {
              // Handle year save error
              if (yearSaveErr) {
                return done(yearSaveErr);
              }

              // Set assertions on new year
              (yearSaveRes.body.title).should.equal(year.title);
              should.exist(yearSaveRes.body.user);
              should.equal(yearSaveRes.body.user._id, orphanId);

              // force the year to have an orphaned user reference
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

                    // Get the year
                    agent.get('/api/years/' + yearSaveRes.body._id)
                      .expect(200)
                      .end(function (yearInfoErr, yearInfoRes) {
                        // Handle year error
                        if (yearInfoErr) {
                          return done(yearInfoErr);
                        }

                        // Set assertions
                        (yearInfoRes.body._id).should.equal(yearSaveRes.body._id);
                        (yearInfoRes.body.title).should.equal(year.title);
                        should.equal(yearInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single year if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new year model instance
    year.user = user;
    var yearObj = new Year(year);

    // Save the year
    yearObj.save(function () {
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

          // Save a new year
          agent.post('/api/years')
            .send(year)
            .expect(200)
            .end(function (yearSaveErr, yearSaveRes) {
              // Handle year save error
              if (yearSaveErr) {
                return done(yearSaveErr);
              }

              // Get the year
              agent.get('/api/years/' + yearSaveRes.body._id)
                .expect(200)
                .end(function (yearInfoErr, yearInfoRes) {
                  // Handle year error
                  if (yearInfoErr) {
                    return done(yearInfoErr);
                  }

                  // Set assertions
                  (yearInfoRes.body._id).should.equal(yearSaveRes.body._id);
                  (yearInfoRes.body.title).should.equal(year.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (yearInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single year if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new year model instance
    var yearObj = new Year(year);

    // Save the year
    yearObj.save(function () {
      request(app).get('/api/years/' + yearObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', year.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single year, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Year
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

          // Save a new year
          agent.post('/api/years')
            .send(year)
            .expect(200)
            .end(function (yearSaveErr, yearSaveRes) {
              // Handle year save error
              if (yearSaveErr) {
                return done(yearSaveErr);
              }

              // Set assertions on new year
              (yearSaveRes.body.title).should.equal(year.title);
              should.exist(yearSaveRes.body.user);
              should.equal(yearSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the year
                  agent.get('/api/years/' + yearSaveRes.body._id)
                    .expect(200)
                    .end(function (yearInfoErr, yearInfoRes) {
                      // Handle year error
                      if (yearInfoErr) {
                        return done(yearInfoErr);
                      }

                      // Set assertions
                      (yearInfoRes.body._id).should.equal(yearSaveRes.body._id);
                      (yearInfoRes.body.title).should.equal(year.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (yearInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Year.remove().exec(done);
    });
  });
});
