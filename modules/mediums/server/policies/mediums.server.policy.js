'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Mediums Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin','teach'],
    allows: [{
      resources: '/api/mediums',
      permissions: '*'
    }, {
      resources: '/api/mediums/:mediumId',
      permissions: '*'
    }]
  },{
    roles: ['user'],
    allows: [{
      resources: '/api/mediums',
      permissions: ['get']
    }, {
      resources: '/api/mediums/:mediumId',
      permissions: ['get']
    }]
  },{
    roles: ['guest'],
    allows: [{
      resources: '/api/mediums',
      permissions: ['get']
    }, {
      resources: '/api/mediums/:mediumId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Mediums Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an medium is being processed and the current user created it then allow any manipulation
  if (req.medium && req.user && req.medium.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
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
