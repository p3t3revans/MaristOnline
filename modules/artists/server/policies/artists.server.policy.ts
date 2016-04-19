'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Artists Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin','teach'],
    allows: [{
      resources: '/api/artists',
      permissions: '*'
    }, {
      resources: '/api/artists/:artistId',
      permissions: '*'
    }, {
      resources: '/api/artistsyearenrolled/:yearEnrolled',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/artists',
      permissions: ['get']
    }, {
      resources: '/api/artists/:artistId',
      permissions: ['get']
    }
    , {
      resources: '/api/artistsyearenrolled/:yearEnrolled',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/artists',
      permissions: ['get']
    }, {
      resources: '/api/artists/:artistId',
      permissions: ['get']
    }, {
      resources: '/api/artistsyearenrolled/:yearEnrolled',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Artists Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an artist is being processed and the current user created it then allow any manipulation
 // if (true) {// (req.artist && req.user && req.artist.user && req.artist.user.id === req.user.id) {
 //   return next();
 // }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
