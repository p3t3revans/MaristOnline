'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Picture = mongoose.model('Picture'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  picture;

/**
 * Picture routes tests
 */
describe('Picture CRUD tests', function () {

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

    // Save a user to the test db and create new picture
    user.save(function () {
      picture = {
        title: 'Picture Title',
        content: 'Picture Content'
      };

      done();
    });
  });

  it('should be able to save an picture if logged in', function (done) {
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

        // Save a new picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Get a list of pictures
            agent.get('/api/pictures')
              .end(function (picturesGetErr, picturesGetRes) {
                // Handle picture save error
                if (picturesGetErr) {
                  return done(picturesGetErr);
                }

                // Get pictures list
                var pictures = picturesGetRes.body;

                // Set assertions
                (pictures[0].user._id).should.equal(userId);
                (pictures[0].title).should.match('Picture Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an picture if not logged in', function (done) {
    agent.post('/api/pictures')
      .send(picture)
      .expect(403)
      .end(function (pictureSaveErr, pictureSaveRes) {
        // Call the assertion callback
        done(pictureSaveErr);
      });
  });

  it('should not be able to save an picture if no title is provided', function (done) {
    // Invalidate title field
    picture.title = '';

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

        // Save a new picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(400)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Set message assertion
            (pictureSaveRes.body.message).should.match('Title cannot be blank');

            // Handle picture save error
            done(pictureSaveErr);
          });
      });
  });

  it('should be able to update an picture if signed in', function (done) {
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

        // Save a new picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Update picture title
            picture.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing picture
            agent.put('/api/pictures/' + pictureSaveRes.body._id)
              .send(picture)
              .expect(200)
              .end(function (pictureUpdateErr, pictureUpdateRes) {
                // Handle picture update error
                if (pictureUpdateErr) {
                  return done(pictureUpdateErr);
                }

                // Set assertions
                (pictureUpdateRes.body._id).should.equal(pictureSaveRes.body._id);
                (pictureUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of pictures if not signed in', function (done) {
    // Create new picture model instance
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
      // Request pictures
      request(app).get('/api/pictures')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single picture if not signed in', function (done) {
    // Create new picture model instance
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
      request(app).get('/api/pictures/' + pictureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', picture.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single picture with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pictures/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Picture is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single picture which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent picture
    request(app).get('/api/pictures/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No picture with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an picture if signed in', function (done) {
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

        // Save a new picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Delete an existing picture
            agent.delete('/api/pictures/' + pictureSaveRes.body._id)
              .send(picture)
              .expect(200)
              .end(function (pictureDeleteErr, pictureDeleteRes) {
                // Handle picture error error
                if (pictureDeleteErr) {
                  return done(pictureDeleteErr);
                }

                // Set assertions
                (pictureDeleteRes.body._id).should.equal(pictureSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an picture if not signed in', function (done) {
    // Set picture user
    picture.user = user;

    // Create new picture model instance
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
      // Try deleting picture
      request(app).delete('/api/pictures/' + pictureObj._id)
        .expect(403)
        .end(function (pictureDeleteErr, pictureDeleteRes) {
          // Set message assertion
          (pictureDeleteRes.body.message).should.match('User is not authorized');

          // Handle picture error error
          done(pictureDeleteErr);
        });

    });
  });

  it('should be able to get a single picture that has an orphaned user reference', function (done) {
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

          // Save a new picture
          agent.post('/api/pictures')
            .send(picture)
            .expect(200)
            .end(function (pictureSaveErr, pictureSaveRes) {
              // Handle picture save error
              if (pictureSaveErr) {
                return done(pictureSaveErr);
              }

              // Set assertions on new picture
              (pictureSaveRes.body.title).should.equal(picture.title);
              should.exist(pictureSaveRes.body.user);
              should.equal(pictureSaveRes.body.user._id, orphanId);

              // force the picture to have an orphaned user reference
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

                    // Get the picture
                    agent.get('/api/pictures/' + pictureSaveRes.body._id)
                      .expect(200)
                      .end(function (pictureInfoErr, pictureInfoRes) {
                        // Handle picture error
                        if (pictureInfoErr) {
                          return done(pictureInfoErr);
                        }

                        // Set assertions
                        (pictureInfoRes.body._id).should.equal(pictureSaveRes.body._id);
                        (pictureInfoRes.body.title).should.equal(picture.title);
                        should.equal(pictureInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single picture if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new picture model instance
    picture.user = user;
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
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

          // Save a new picture
          agent.post('/api/pictures')
            .send(picture)
            .expect(200)
            .end(function (pictureSaveErr, pictureSaveRes) {
              // Handle picture save error
              if (pictureSaveErr) {
                return done(pictureSaveErr);
              }

              // Get the picture
              agent.get('/api/pictures/' + pictureSaveRes.body._id)
                .expect(200)
                .end(function (pictureInfoErr, pictureInfoRes) {
                  // Handle picture error
                  if (pictureInfoErr) {
                    return done(pictureInfoErr);
                  }

                  // Set assertions
                  (pictureInfoRes.body._id).should.equal(pictureSaveRes.body._id);
                  (pictureInfoRes.body.title).should.equal(picture.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (pictureInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single picture if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new picture model instance
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
      request(app).get('/api/pictures/' + pictureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', picture.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single picture, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Picture
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

          // Save a new picture
          agent.post('/api/pictures')
            .send(picture)
            .expect(200)
            .end(function (pictureSaveErr, pictureSaveRes) {
              // Handle picture save error
              if (pictureSaveErr) {
                return done(pictureSaveErr);
              }

              // Set assertions on new picture
              (pictureSaveRes.body.title).should.equal(picture.title);
              should.exist(pictureSaveRes.body.user);
              should.equal(pictureSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the picture
                  agent.get('/api/pictures/' + pictureSaveRes.body._id)
                    .expect(200)
                    .end(function (pictureInfoErr, pictureInfoRes) {
                      // Handle picture error
                      if (pictureInfoErr) {
                        return done(pictureInfoErr);
                      }

                      // Set assertions
                      (pictureInfoRes.body._id).should.equal(pictureSaveRes.body._id);
                      (pictureInfoRes.body.title).should.equal(picture.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (pictureInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Picture.remove().exec(done);
    });
  });
});
