'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Artist = mongoose.model('Artist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  artist;

/**
 * Artist routes tests
 */
describe('Artist CRUD tests', function () {

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

    // Save a user to the test db and create new artist
    user.save(function () {
      artist = {
        title: 'Artist Title',
        content: 'Artist Content'
      };

      done();
    });
  });

  it('should be able to save an artist if logged in', function (done) {
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

        // Save a new artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Get a list of artists
            agent.get('/api/artists')
              .end(function (artistsGetErr, artistsGetRes) {
                // Handle artist save error
                if (artistsGetErr) {
                  return done(artistsGetErr);
                }

                // Get artists list
                var artists = artistsGetRes.body;

                // Set assertions
                (artists[0].user._id).should.equal(userId);
                (artists[0].title).should.match('Artist Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an artist if not logged in', function (done) {
    agent.post('/api/artists')
      .send(artist)
      .expect(403)
      .end(function (artistSaveErr, artistSaveRes) {
        // Call the assertion callback
        done(artistSaveErr);
      });
  });

  it('should not be able to save an artist if no title is provided', function (done) {
    // Invalidate title field
    artist.title = '';

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

        // Save a new artist
        agent.post('/api/artists')
          .send(artist)
          .expect(400)
          .end(function (artistSaveErr, artistSaveRes) {
            // Set message assertion
            (artistSaveRes.body.message).should.match('Title cannot be blank');

            // Handle artist save error
            done(artistSaveErr);
          });
      });
  });

  it('should be able to update an artist if signed in', function (done) {
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

        // Save a new artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Update artist title
            artist.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing artist
            agent.put('/api/artists/' + artistSaveRes.body._id)
              .send(artist)
              .expect(200)
              .end(function (artistUpdateErr, artistUpdateRes) {
                // Handle artist update error
                if (artistUpdateErr) {
                  return done(artistUpdateErr);
                }

                // Set assertions
                (artistUpdateRes.body._id).should.equal(artistSaveRes.body._id);
                (artistUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of artists if not signed in', function (done) {
    // Create new artist model instance
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
      // Request artists
      request(app).get('/api/artists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single artist if not signed in', function (done) {
    // Create new artist model instance
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
      request(app).get('/api/artists/' + artistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', artist.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single artist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/artists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Artist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single artist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent artist
    request(app).get('/api/artists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No artist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an artist if signed in', function (done) {
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

        // Save a new artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Delete an existing artist
            agent.delete('/api/artists/' + artistSaveRes.body._id)
              .send(artist)
              .expect(200)
              .end(function (artistDeleteErr, artistDeleteRes) {
                // Handle artist error error
                if (artistDeleteErr) {
                  return done(artistDeleteErr);
                }

                // Set assertions
                (artistDeleteRes.body._id).should.equal(artistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an artist if not signed in', function (done) {
    // Set artist user
    artist.user = user;

    // Create new artist model instance
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
      // Try deleting artist
      request(app).delete('/api/artists/' + artistObj._id)
        .expect(403)
        .end(function (artistDeleteErr, artistDeleteRes) {
          // Set message assertion
          (artistDeleteRes.body.message).should.match('User is not authorized');

          // Handle artist error error
          done(artistDeleteErr);
        });

    });
  });

  it('should be able to get a single artist that has an orphaned user reference', function (done) {
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

          // Save a new artist
          agent.post('/api/artists')
            .send(artist)
            .expect(200)
            .end(function (artistSaveErr, artistSaveRes) {
              // Handle artist save error
              if (artistSaveErr) {
                return done(artistSaveErr);
              }

              // Set assertions on new artist
              (artistSaveRes.body.title).should.equal(artist.title);
              should.exist(artistSaveRes.body.user);
              should.equal(artistSaveRes.body.user._id, orphanId);

              // force the artist to have an orphaned user reference
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

                    // Get the artist
                    agent.get('/api/artists/' + artistSaveRes.body._id)
                      .expect(200)
                      .end(function (artistInfoErr, artistInfoRes) {
                        // Handle artist error
                        if (artistInfoErr) {
                          return done(artistInfoErr);
                        }

                        // Set assertions
                        (artistInfoRes.body._id).should.equal(artistSaveRes.body._id);
                        (artistInfoRes.body.title).should.equal(artist.title);
                        should.equal(artistInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single artist if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new artist model instance
    artist.user = user;
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
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

          // Save a new artist
          agent.post('/api/artists')
            .send(artist)
            .expect(200)
            .end(function (artistSaveErr, artistSaveRes) {
              // Handle artist save error
              if (artistSaveErr) {
                return done(artistSaveErr);
              }

              // Get the artist
              agent.get('/api/artists/' + artistSaveRes.body._id)
                .expect(200)
                .end(function (artistInfoErr, artistInfoRes) {
                  // Handle artist error
                  if (artistInfoErr) {
                    return done(artistInfoErr);
                  }

                  // Set assertions
                  (artistInfoRes.body._id).should.equal(artistSaveRes.body._id);
                  (artistInfoRes.body.title).should.equal(artist.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (artistInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single artist if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new artist model instance
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
      request(app).get('/api/artists/' + artistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', artist.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single artist, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Artist
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

          // Save a new artist
          agent.post('/api/artists')
            .send(artist)
            .expect(200)
            .end(function (artistSaveErr, artistSaveRes) {
              // Handle artist save error
              if (artistSaveErr) {
                return done(artistSaveErr);
              }

              // Set assertions on new artist
              (artistSaveRes.body.title).should.equal(artist.title);
              should.exist(artistSaveRes.body.user);
              should.equal(artistSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the artist
                  agent.get('/api/artists/' + artistSaveRes.body._id)
                    .expect(200)
                    .end(function (artistInfoErr, artistInfoRes) {
                      // Handle artist error
                      if (artistInfoErr) {
                        return done(artistInfoErr);
                      }

                      // Set assertions
                      (artistInfoRes.body._id).should.equal(artistSaveRes.body._id);
                      (artistInfoRes.body.title).should.equal(artist.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (artistInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Artist.remove().exec(done);
    });
  });
});
