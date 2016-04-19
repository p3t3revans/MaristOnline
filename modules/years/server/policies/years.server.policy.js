'use strict';
/**
 * Module dependencies
 */
var acl = require('acl');
// Using the memory backend
acl = new acl(new acl.memoryBackend());
/**
 * Invoke Years Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
            roles: ['admin', 'teach'],
            allows: [{
                    resources: '/api/years',
                    permissions: '*'
                }, {
                    resources: '/api/years/:yearId',
                    permissions: '*'
                }]
        }, {
            roles: ['user'],
            allows: [{
                    resources: '/api/years',
                    permissions: ['get']
                },
                {
                    resources: '/api/years/:yearId',
                    permissions: ['get']
                }]
        }, {
            roles: ['guest'],
            allows: [{
                    resources: '/api/years',
                    permissions: ['get']
                }, {
                    resources: '/api/years/:yearId',
                    permissions: ['get']
                }]
        }]);
};
/**
 * Check If Years Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];
    // If an year is being processed and the current user created it then allow any manipulation
    //  if (true) {// (req.year && req.user && req.year.user && req.year.user.id === req.user.id) {
    //   return next();
    // }
    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred
            return res.status(500).send('Unexpected authorization error');
        }
        else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            }
            else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
