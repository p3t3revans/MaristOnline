'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'angularFileUpload'];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);
        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
}());

'use strict';
// Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
    function ($locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('authInterceptor');
    }
]);
angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {
    // Check authentication before changing state
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
            var allowed = false;
            toState.data.roles.forEach(function (role) {
                if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
                    allowed = true;
                    return true;
                }
            });
            if (!allowed) {
                event.preventDefault();
                if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
                    $state.go('forbidden');
                }
                else {
                    $state.go('authentication.signin').then(function () {
                        storePreviousState(toState, toParams);
                    });
                }
            }
        }
    });
    // Record previous state
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        storePreviousState(fromState, fromParams);
    });
    // Store previous state
    function storePreviousState(state, params) {
        // only store this state if it shouldn't be ignored
        if (!state.data || !state.data.ignoreState) {
            $state.previous = {
                state: state,
                params: params,
                href: $state.href(state, params)
            };
        }
    }
}]);
// Then define the init function for starting up the application
angular.element(document).ready(function () {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState('', document.title, window.location.pathname);
        }
        else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }
    // Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
    'use strict';
    app.registerModule('articles', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('articles.services');
    app.registerModule('articles.routes', ['ui.router', 'articles.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('artists', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('artists.services');
    app.registerModule('artists.routes', ['ui.router', 'artists.services']);
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';
// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core', []);
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
    'use strict';
    app.registerModule('mediums', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('mediums.services');
    app.registerModule('mediums.routes', ['ui.router', 'mediums.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('pictures', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('pictures.services');
    app.registerModule('pictures.routes', ['ui.router', 'pictures.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('subjects', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('subjects.services');
    app.registerModule('subjects.routes', ['ui.router', 'subjects.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('teachers', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('teachers.services');
    app.registerModule('teachers.routes', ['ui.router', 'teachers.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('users');
    app.registerModule('users.admin');
    app.registerModule('users.services');
    app.registerModule('users.admin.services');
    app.registerModule('users.routes', ['ui.router']);
    app.registerModule('users.admin.routes', ['ui.router', 'users.admin.services']);
}(ApplicationConfiguration));

(function (app) {
    'use strict';
    app.registerModule('years', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('years.services');
    app.registerModule('years.routes', ['ui.router', 'years.services']);
}(ApplicationConfiguration));

(function () {
    'use strict';
    angular
        .module('articles')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Articles',
            state: 'articles',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'articles', {
            title: 'List Articles',
            state: 'articles.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'articles', {
            title: 'Create Article',
            state: 'articles.create',
            roles: ['teach', 'admin']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('articles.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('articles', {
            abstract: true,
            url: '/articles',
            template: '<ui-view/>'
        })
            .state('articles.list', {
            url: '',
            templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
            controller: 'ArticlesListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Articles List'
            }
        })
            .state('articles.create', {
            url: '/create',
            templateUrl: 'modules/articles/client/views/form-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm',
            resolve: {
                articleResolve: newArticle
            },
            data: {
                roles: ['teach', 'admin'],
                pageTitle: 'Articles Create'
            }
        })
            .state('articles.edit', {
            url: '/:articleId/edit',
            templateUrl: 'modules/articles/client/views/form-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm',
            resolve: {
                articleResolve: getArticle
            },
            data: {
                roles: ['teach', 'admin'],
                pageTitle: 'Edit Article {{ articleResolve.title }}'
            }
        })
            .state('articles.view', {
            url: '/:articleId',
            templateUrl: 'modules/articles/client/views/view-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm',
            resolve: {
                articleResolve: getArticle
            },
            data: {
                pageTitle: 'Article {{ articleResolve.title }}'
            }
        });
    }
    getArticle.$inject = ['$stateParams', 'ArticlesService'];
    function getArticle($stateParams, ArticlesService) {
        return ArticlesService.get({
            articleId: $stateParams.articleId
        }).$promise;
    }
    newArticle.$inject = ['ArticlesService'];
    function newArticle(ArticlesService) {
        return new ArticlesService();
    }
}());

(function () {
    'use strict';
    angular
        .module('articles')
        .controller('ArticlesController', ArticlesController);
    ArticlesController.$inject = ['$timeout', '$scope', '$state', 'articleResolve', '$window', 'Authentication', 'FileUploader'];
    function ArticlesController($timeout, $scope, $state, article, $window, Authentication, FileUploader) {
        var vm = this;
        vm.article = article;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // Remove existing Article
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.article.$remove($state.go('articles.list'));
            }
        }
        // Save Article
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.article._id) {
                vm.article.$update(successCallback, errorCallback);
            }
            else {
                vm.article.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('articles.view', {
                    articleId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
        vm.cancelUpload = cancelUpload;
        // Create file uploader instance
        vm.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture',
            onAfterAddingFile: onAfterAddingFile,
            onSuccessItem: onSuccessItem,
            onErrorItem: onErrorItem
        });
        // Set file uploader image filter
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fre) {
                    $timeout(function () {
                        vm.article.picture = fre.target.result;
                    }, 0);
                };
            }
        }
        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message
            vm.success = true;
            // Populate user object
            vm.user = Authentication.user = response;
            // Clear upload buttons
            cancelUpload();
        }
        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            cancelUpload();
            // Show error message
            vm.error = response.message;
        }
        // Change user profile picture
        function uploadProfilePicture() {
            // Clear messages
            vm.success = vm.error = null;
            // Start upload
            vm.uploader.uploadAll();
        }
        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
            vm.imageURL = vm.user.profileImageURL;
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('articles')
        .controller('ArticlesListController', ArticlesListController);
    ArticlesListController.$inject = ['ArticlesList', '$scope'];
    function ArticlesListController(ArticlesList, $scope) {
        var vm = this;
        vm.wait = true;
        $scope.maxSize = 5;
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.pageChanged = function () {
            vm.articles = ArticlesList.get({ page: $scope.currentPage, count: $scope.totalItems });
            vm.articles.$promise.then(function (result) {
                vm.wait = true;
                vm.articles = result.articles;
                if (result.count !== -1)
                    $scope.totalItems = result.count;
                vm.wait = false;
            });
        };
        $scope.pageChanged();
    }
}());

(function () {
    'use strict';
    angular
        .module('articles.services')
        .factory('ArticlesService', ArticlesService);
    ArticlesService.$inject = ['$resource'];
    function ArticlesService($resource) {
        return $resource('api/articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
//ArticlesFrontPage service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesFrontPage', ['$resource',
    function ($resource) {
        return $resource('api/articlesfp');
    }
]);
//ArticlesList service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesList', ['$resource',
    function ($resource) {
        return $resource('/api/articles/page/:page/count/:count');
    }
]);
//ArticlesLead service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesLead', ['$resource',
    function ($resource) {
        return $resource('api/articleslead');
    }
]);

(function () {
    'use strict';
    angular
        .module('artists')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Artists',
            state: 'artists',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'artists', {
            title: 'List Artists',
            state: 'artists.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'artists', {
            title: 'Create Artist',
            state: 'artists.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('artists.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('artists', {
            abstract: true,
            url: '/artists',
            template: '<ui-view/>'
        })
            .state('artists.list', {
            url: '',
            templateUrl: 'modules/artists/client/views/list-artists.client.view.html',
            controller: 'ArtistsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Artists List'
            }
        })
            .state('artists.create', {
            url: '/create',
            templateUrl: 'modules/artists/client/views/form-artist.client.view.html',
            controller: 'ArtistsController',
            controllerAs: 'vm',
            resolve: {
                artistResolve: newArtist
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Artists Create'
            }
        })
            .state('artists.edit', {
            url: '/:artistId/edit',
            templateUrl: 'modules/artists/client/views/form-artist.client.view.html',
            controller: 'ArtistsController',
            controllerAs: 'vm',
            resolve: {
                artistResolve: getArtist
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Artist {{ artistResolve.title }}'
            }
        })
            .state('artists.view', {
            url: '/:artistId',
            templateUrl: 'modules/artists/client/views/view-artist.client.view.html',
            controller: 'ArtistsController',
            controllerAs: 'vm',
            resolve: {
                artistResolve: getArtist
            },
            data: {
                pageTitle: 'Artist {{ artistResolve.title }}'
            }
        });
    }
    getArtist.$inject = ['$stateParams', 'ArtistsService'];
    function getArtist($stateParams, ArtistsService) {
        return ArtistsService.get({
            artistId: $stateParams.artistId
        }).$promise;
    }
    newArtist.$inject = ['ArtistsService'];
    function newArtist(ArtistsService) {
        return new ArtistsService();
    }
}());

(function () {
    'use strict';
    angular
        .module('artists')
        .controller('ArtistsController', ArtistsController);
    ArtistsController.$inject = ['PicturesByArtist', 'YearsService', '$scope', '$state', 'artistResolve', '$window', 'Authentication'];
    function ArtistsController(PicturesByArtist, YearsService, $scope, $state, artist, $window, Authentication) {
        var vm = this;
        //save
        vm.artist = artist;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.wait = false;
        $scope.totalItems = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.per_page = 10;
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function () {
            getPicturesByArtist();
        };
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // year selection data
        var today = new Date();
        var yyyy = today.getFullYear();
        $scope.yearSelect = yyyy;
        var setYearOption = function (select) {
            if (select) {
                yyyy = select;
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        var setHouseOption = function (house) {
            for (var k = 0; k < $scope.house.availableOptions.length; k++) {
                if ($scope.house.availableOptions[k].name === house) {
                    $scope.house.selectedOption = $scope.house.availableOptions[k];
                    break;
                }
            }
        };
        $scope.yearData = [];
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            if (vm.artist.yearEnrolled) {
                yyyy = vm.artist.yearEnrolled;
            }
            setYearOption(yyyy);
        });
        // house data for dropdown
        $scope.house = {
            availableOptions: [
                { name: 'Conway' },
                { name: 'Crispin' },
                { name: 'Darlinghurst' },
                { name: 'Haydon' },
                { name: 'Mark' },
                { name: 'McMahon' },
                { name: 'Othmar' },
                { name: 'Patrick' }
            ]
        };
        if (vm.artist.house) {
            setHouseOption(vm.artist.house);
        }
        // Remove existing Artist
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.artist.$remove($state.go('artists.list'));
            }
        }
        // Save Artist
        function save(isValid) {
            vm.artist.yearEnrolled = $scope.yearData.selectedOption.year;
            vm.artist.house = $scope.house.selectedOption.name;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.artistForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.artist._id) {
                vm.artist.$update(successCallback, errorCallback);
            }
            else {
                vm.artist.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('artists.view', {
                    artistId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
        //$scope.getPictures();
        $scope.artistChanged = function () {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            getPicturesByArtist();
        };
        var getPicturesByArtist = function () {
            vm.wait = true;
            vm.pictures = PicturesByArtist.get({ artistId: vm.artist._id, page: $scope.currentPage, count: $scope.totalItems });
            vm.pictures.$promise.then(function (response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                if (response.count !== -1)
                    $scope.totalItems = response.count;
            });
        };
    }
}());

(function () {
    'use strict';
    angular
        .module('artists')
        .controller('ArtistsListController', ArtistsListController);
    ArtistsListController.$inject = ['ArtistYearEnrolled', '$scope', 'YearsService', 'ArtistsService'];
    function ArtistsListController(ArtistYearEnrolled, $scope, YearsService, ArtistsService) {
        var vm = this;
        //vm.artists = ArtistsService.query();
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
        });
        $scope.filterByYear = function () {
            vm.artists = ArtistYearEnrolled.query({ yearEnrolled: $scope.yearData.selectedOption.year });
        };
    }
}());

(function () {
    'use strict';
    angular
        .module('artists.services')
        .factory('ArtistsService', ArtistsService);
    ArtistsService.$inject = ['$resource'];
    function ArtistsService($resource) {
        return $resource('api/artists/:artistId', {
            artistId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
angular.module('artists').factory('ArtistYearEnrolled', ['$resource',
    function ($resource) {
        return $resource('api/artistsyearenrolled/:yearEnrolled', {
            yearEnrolled: '@yearEnrolled'
        });
    }
]);

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
   // Menus.addMenuItem('topbar', {
    //  title: 'Chat',
   //   state: 'chat'
  //  });
  }
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/views/chat.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);


'use strict';
angular.module('core.admin').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Admin',
            state: 'admin',
            type: 'dropdown',
            roles: ['admin']
        });
    }
]);

'use strict';
// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin', {
            abstract: true,
            url: '/admin',
            template: '<ui-view/>',
            data: {
                roles: ['admin']
            }
        });
    }
]);

(function () {
    'use strict';
    angular
        .module('core')
        .run(MenuConfig);
    MenuConfig.$inject = ['Menus'];
    function MenuConfig(Menus) {
        Menus.addMenu('account', {
            roles: ['user']
        });
        Menus.addMenuItem('account', {
            title: '',
            state: 'settings',
            type: 'dropdown',
            roles: ['user']
        });
        Menus.addSubMenuItem('account', 'settings', {
            title: 'Edit Profile',
            state: 'settings.profile'
        });
        Menus.addSubMenuItem('account', 'settings', {
            title: 'Edit Profile Picture',
            state: 'settings.picture'
        });
        Menus.addSubMenuItem('account', 'settings', {
            title: 'Change Password',
            state: 'settings.password'
        });
        Menus.addSubMenuItem('account', 'settings', {
            title: 'Manage Social Accounts',
            state: 'settings.accounts'
        });
    }
}());

'use strict';
// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();
            var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';
            if (hasTrailingSlash) {
                // if last character is a slash, return the same url without the slash
                var newPath = path.substr(0, path.length - 1);
                $location.replace().path(newPath);
            }
        });
        // Redirect to 404 when route not found
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.get('$state').transitionTo('not-found', null, {
                location: false
            });
        });
        // Home state routing
        $stateProvider
            .state('home', {
            url: '/',
            templateUrl: 'modules/core/client/views/home.client.view.html'
        })
            .state('not-found', {
            url: '/not-found',
            templateUrl: 'modules/core/client/views/404.client.view.html',
            data: {
                ignoreState: true,
                pageTitle: 'Not-Found'
            }
        })
            .state('bad-request', {
            url: '/bad-request',
            templateUrl: 'modules/core/client/views/400.client.view.html',
            data: {
                ignoreState: true,
                pageTitle: 'Bad-Request'
            }
        })
            .state('forbidden', {
            url: '/forbidden',
            templateUrl: 'modules/core/client/views/403.client.view.html',
            data: {
                ignoreState: true,
                pageTitle: 'Forbidden'
            }
        });
    }
]);

angular.module('core').controller('MyCarouselController', ['spinnerService', 'ArticlesLead', 'ArticlesFrontPage', '$interval', 'PicturesFrontPage', '$scope', 'Authentication',
    function (spinnerService, ArticlesLead, ArticlesFrontPage, $interval, PicturesFrontPage, $scope, Authentication) {
        //$('.slider').slick();
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        var slideNumber = 0;
        var maxSlides = 4;
        var slideId = 1;
        $scope.articles = ArticlesLead.get();
        $scope.articles.$promise.then(function (response) {
            $scope.title = response.articles[0].title;
            $scope.content = response.articles[0].content;
            $scope.picture = response.articles[0].picture;
            $scope.articles = response.articles;
        });
        $scope.newsArticles = ArticlesFrontPage.get();
        $scope.newsArticles.$promise.then(function (response) {
           $scope.newsArticles = response.articles;
        });
        $scope.myInterval = 5000;
        var slides = $scope.slides = [];
        $scope.addSlide = function () {
            // var newWidth = 600 + slides.length;
            slides.push({
                image: $scope.picture1,
                text: $scope.text,
                id: slideId
            });
        };
        // var isOdd = function (num) { return num % 2; };
        var rotate = function () {
            $scope.loading = true;
            $scope.pictures = PicturesFrontPage.get({ page: $scope.currentPage });
            $scope.pictures.$promise.then(function (response) {
                slides.length = 0;
                $scope.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
                if ($scope.currentPage === $scope.totalItems) {
                    $scope.currentPage = 1;
                }
                else {
                    $scope.currentPage++;
                }
                for (var i = 0; i < response.pictures.length; i++) {
                    $scope.picture1 = $scope.pictures[i].picture;
                    $scope.text = $scope.pictures[i].title;
                    slideId = i + 1;
                    $scope.addSlide();
                }
                $scope.loading = false;
                /*  if (isOdd($scope.currentPage)) {
                      $scope.picture1 = $scope.pictures[0].picture;
                  }
                  else {
                      $scope.picture2 = $scope.pictures[0].picture;
                  }*/
            });
            return true;
        };
        rotate();

        /*    for (var i = 0; i < 10; i++) {
    
                rotate((i + 1));
            }*/
      //  $interval(rotate, 600000);
    }
]);

/*angular.module('core').directive('slickSlider',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
         $(element).slick(scope.$eval(attrs.slickSlider));
     });
   }
 }
}); */
'use strict';
angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
    function ($scope, $state, Authentication, Menus) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;
        // Get the topbar menu
        $scope.menu = Menus.getMenu('topbar');
        // Get the account menu
        $scope.accountMenu = Menus.getMenu('account').items[0];
        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };
        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });
    }
]);

'use strict';
angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ArticlesFrontPage', 'ArticlesLead',
    function ($scope, Authentication, ArticlesFrontPage, ArticlesLead) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.wait = true;
        $scope.currentPage = 1;
        var slideNumber = 0;
        var maxSlides = 4;
        var slideId = 1;
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;
        //       $scope.addSlide = function() {
        //          var newWidth = 600 + slides.length + 1;
        //         slides.push({
        //             image: 'http://lorempixel.com/' + newWidth + '/300',
        //             text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
        //             id: currIndex++
        //         });
        //     };
        $scope.articles = ArticlesLead.get();
        $scope.articles.$promise.then(function (response) {
            $scope.title = response.articles[0].title;
            $scope.content = response.articles[0].content;
            $scope.picture = response.articles[0].picture;
            $scope.articles = response.articles;
            rotate();
        });
        $scope.addSlide = function () {
            // var newWidth = 600 + slides.length;
            slides.push({
                image: $scope.picture1,
                text: $scope.text,
                id: currIndex++,
                _id: $scope._id
            });
        };
        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };
        //    for (var i = 0; i < 4; i++) {
        //        $scope.addSlide();
        //    }
        // Randomize logic below
        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }
        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }
        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;
            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }
            return array;
        }
        var rotate = function () {
            $scope.wait = true;
            //$scope.pictures = PicturesFrontPage.get({ page: $scope.currentPage });
            $scope.pictures = ArticlesFrontPage.get();
            $scope.pictures.$promise.then(function (response) {
                slides.length = 0;
                $scope.carousel = response.articles;
                /*      if (response.count !== -1) $scope.totalItems = response.count;
                       if ($scope.currentPage === $scope.totalItems) {
                           $scope.currentPage = 1;
                       }
                       else {
                           $scope.currentPage++;
                       }*/
                for (var i = 0; i < response.articles.length; i++) {
                    $scope.picture1 = $scope.carousel[i].picture;
                    $scope.text = $scope.carousel[i].title;
                    $scope._id = $scope.carousel[i]._id;
                    //slideId = i + 1;
                    $scope.addSlide();
                }
                // })
                // this is for the commented if }
                /*  if (isOdd($scope.currentPage)) {
                      $scope.picture1 = $scope.pictures[0].picture;
                  }
                  else {
                      $scope.picture2 = $scope.pictures[0].picture;
                  }*/
            });
            $scope.wait = false;
            return true;
        };
    }
]);

(function () {
    'use strict';
    angular.module('core')
        .directive('pageTitle', pageTitle);
    pageTitle.$inject = ['$rootScope', '$timeout', '$interpolate', '$state'];
    function pageTitle($rootScope, $timeout, $interpolate, $state) {
        var directive = {
            retrict: 'A',
            link: link
        };
        return directive;
        function link(scope, element) {
            $rootScope.$on('$stateChangeSuccess', listener);
            function listener(event, toState) {
                var title = (getTitle($state.$current));
                $timeout(function () {
                    element.text(title);
                }, 0, false);
            }
            function getTitle(currentState) {
                var applicationCoreTitle = 'Online Art';
                var workingState = currentState;
                if (currentState.data) {
                    workingState = (typeof workingState.locals !== 'undefined') ? workingState.locals.globals : workingState;
                    var stateTitle = $interpolate(currentState.data.pageTitle)(workingState);
                    return applicationCoreTitle + ' - ' + stateTitle;
                }
                else {
                    return applicationCoreTitle;
                }
            }
        }
    }
}());

'use strict';
/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */
angular.module('core')
    .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
        var linkFn = function (scope, el, attrs, formCtrl) {
            var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, initCheck = false, showValidationMessages = false, blurred = false;
            options = scope.$eval(attrs.showErrors) || {};
            showSuccess = options.showSuccess || false;
            inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
            inputNgEl = angular.element(inputEl);
            inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
            if (!inputName) {
                throw new Error('show-errors element has no child input elements with a \'name\' attribute class');
            }
            var reset = function () {
                return $timeout(function () {
                    el.removeClass('has-error');
                    el.removeClass('has-success');
                    showValidationMessages = false;
                }, 0, false);
            };
            scope.$watch(function () {
                return formCtrl[inputName] && formCtrl[inputName].$invalid;
            }, function (invalid) {
                return toggleClasses(invalid);
            });
            scope.$on('show-errors-check-validity', function (event, name) {
                if (angular.isUndefined(name) || formCtrl.$name === name) {
                    initCheck = true;
                    showValidationMessages = true;
                    return toggleClasses(formCtrl[inputName].$invalid);
                }
            });
            scope.$on('show-errors-reset', function (event, name) {
                if (angular.isUndefined(name) || formCtrl.$name === name) {
                    return reset();
                }
            });
            toggleClasses = function (invalid) {
                el.toggleClass('has-error', showValidationMessages && invalid);
                if (showSuccess) {
                    return el.toggleClass('has-success', showValidationMessages && !invalid);
                }
            };
        };
        return {
            restrict: 'A',
            require: '^form',
            compile: function (elem, attrs) {
                if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
                    if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
                        throw new Error('show-errors element does not have the \'form-group\' or \'input-group\' class');
                    }
                }
                return linkFn;
            }
        };
    }]);

'use strict';
angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
    function ($q, $injector, Authentication) {
        return {
            responseError: function (rejection) {
                if (!rejection.config.ignoreAuthModule) {
                    switch (rejection.status) {
                        case 401:
                            // Deauthenticate the global user
                            Authentication.user = null;
                            $injector.get('$state').transitionTo('authentication.signin');
                            break;
                        case 403:
                            $injector.get('$state').transitionTo('forbidden');
                            break;
                    }
                }
                // otherwise, default behaviour
                return $q.reject(rejection);
            }
        };
    }
]);

'use strict';
// Menu service used for managing  menus
angular.module('core').service('Menus', [
    function () {
        // Define a set of default roles
        this.defaultRoles = ['user', 'admin'];
        // Define the menus object
        this.menus = {};
        // A private function for rendering decision
        var shouldRender = function (user) {
            if (!!~this.roles.indexOf('*')) {
                return true;
            }
            else {
                if (!user) {
                    return false;
                }
                for (var userRoleIndex in user.roles) {
                    if (user.roles.hasOwnProperty(userRoleIndex)) {
                        for (var roleIndex in this.roles) {
                            if (this.roles.hasOwnProperty(roleIndex)) {
                                if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };
        // Validate menu existance
        this.validateMenuExistance = function (menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                }
                else {
                    throw new Error('Menu does not exist');
                }
            }
            else {
                throw new Error('MenuId was not provided');
            }
        };
        // Get the menu object by menu id
        this.getMenu = function (menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Return the menu object
            return this.menus[menuId];
        };
        // Add new menu object by menu id
        this.addMenu = function (menuId, options) {
            options = options || {};
            // Create the new menu
            this.menus[menuId] = {
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };
            // Return the menu object
            return this.menus[menuId];
        };
        // Remove existing menu object by menu id
        this.removeMenu = function (menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Return the menu object
            delete this.menus[menuId];
        };
        // Add menu item object
        this.addMenuItem = function (menuId, options) {
            options = options || {};
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Push new menu item
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });
            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                    if (options.items.hasOwnProperty(i)) {
                        this.addSubMenuItem(menuId, options.state, options.items[i]);
                    }
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };
        // Add submenu item object
        this.addSubMenuItem = function (menuId, parentItemState, options) {
            options = options || {};
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state || '',
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };
        // Remove existing menu object by menu id
        this.removeMenuItem = function (menuId, menuItemState) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === menuItemState) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };
        // Remove existing menu object by menu id
        this.removeSubMenuItem = function (menuId, submenuItemState) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);
            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items.hasOwnProperty(itemIndex)) {
                    for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                        if (this.menus[menuId].items[itemIndex].items.hasOwnProperty(subitemIndex)) {
                            if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
                                this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                            }
                        }
                    }
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };
        // Adding the topbar menu
        this.addMenu('topbar', {
            roles: ['*']
        });
    }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
    'use strict';
    angular
        .module('mediums')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Mediums',
            state: 'mediums',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'mediums', {
            title: 'List Mediums',
            state: 'mediums.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'mediums', {
            title: 'Create Medium',
            state: 'mediums.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('mediums.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('mediums', {
            abstract: true,
            url: '/mediums',
            template: '<ui-view/>'
        })
            .state('mediums.list', {
            url: '',
            templateUrl: 'modules/mediums/client/views/list-mediums.client.view.html',
            controller: 'MediumsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Mediums List'
            }
        })
            .state('mediums.create', {
            url: '/create',
            templateUrl: 'modules/mediums/client/views/form-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: newMedium
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Mediums Create'
            }
        })
            .state('mediums.edit', {
            url: '/:mediumId/edit',
            templateUrl: 'modules/mediums/client/views/form-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: getMedium
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Medium {{ mediumResolve.title }}'
            }
        })
            .state('mediums.view', {
            url: '/:mediumId',
            templateUrl: 'modules/mediums/client/views/view-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: getMedium
            },
            data: {
                pageTitle: 'Medium {{ mediumResolve.title }}'
            }
        });
    }
    getMedium.$inject = ['$stateParams', 'MediumsService'];
    function getMedium($stateParams, MediumsService) {
        return MediumsService.get({
            mediumId: $stateParams.mediumId
        }).$promise;
    }
    newMedium.$inject = ['MediumsService'];
    function newMedium(MediumsService) {
        return new MediumsService();
    }
}());

(function () {
    'use strict';
    angular
        .module('mediums')
        .controller('MediumsListController', MediumsListController);
    MediumsListController.$inject = ['MediumsService'];
    function MediumsListController(MediumsService) {
        var vm = this;
        vm.mediums = MediumsService.query();
    }
}());

(function () {
    'use strict';
    angular
        .module('mediums')
        .controller('MediumsController', MediumsController);
    MediumsController.$inject = ['$scope', '$state', 'mediumResolve', '$window', 'Authentication'];
    function MediumsController($scope, $state, medium, $window, Authentication) {
        var vm = this;
        //
        vm.medium = medium;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // Remove existing Medium
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.medium.$remove($state.go('mediums.list'));
            }
        }
        // Save Medium
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.mediumForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.medium._id) {
                vm.medium.$update(successCallback, errorCallback);
            }
            else {
                vm.medium.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('mediums.view', {
                    mediumId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('mediums.services')
        .factory('MediumsService', MediumsService);
    MediumsService.$inject = ['$resource'];
    function MediumsService($resource) {
        return $resource('api/mediums/:mediumId', {
            mediumId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('pictures')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Pictures',
            state: 'pictures',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'pictures', {
            title: 'List Pictures',
            state: 'pictures.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'pictures', {
            title: 'Create Picture',
            state: 'pictures.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('pictures.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('pictures', {
            abstract: true,
            url: '/pictures',
            template: '<ui-view/>'
        })
            .state('pictures.list', {
            url: '',
            templateUrl: 'modules/pictures/client/views/list-pictures.client.view.html',
            controller: 'PicturesListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Pictures List'
            }
        })
            .state('pictures.create', {
            url: '/create',
            templateUrl: 'modules/pictures/client/views/form-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: newPicture
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Pictures Create'
            }
        })
            .state('pictures.edit', {
            url: '/:pictureId/edit',
            templateUrl: 'modules/pictures/client/views/form-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: getPicture
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Picture {{ pictureResolve.title }}'
            }
        })
            .state('pictures.view', {
            url: '/:pictureId',
            templateUrl: 'modules/pictures/client/views/view-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: getPicture
            },
            data: {
                pageTitle: 'Picture {{ pictureResolve.title }}'
            }
        });
    }
    getPicture.$inject = ['$stateParams', 'PicturesService'];
    function getPicture($stateParams, PicturesService) {
        return PicturesService.get({
            pictureId: $stateParams.pictureId
        }).$promise;
    }
    newPicture.$inject = ['PicturesService'];
    function newPicture(PicturesService) {
        return new PicturesService();
    }
}());

(function () {
    'use strict';
    angular
        .module('pictures')
        .controller('PicturesListController', PicturesListController);
    PicturesListController.$inject = ['PicturesByYear', 'PicturesByArtist', 'PicturesPage', 'YearsService', 'ArtistYearEnrolled', 'PicturesService', '$scope', "ArtistsService"];
    function PicturesListController(PicturesByYear, PicturesByArtist, PicturesPage, YearsService, ArtistYearEnrolled, PicturesService, $scope, ArtistsService) {
        var vm = this;
        //list load and pagination
        vm.wait = false;
        $scope.maxSize = 5;
        $scope.totalItems = 1;
        $scope.currentPage = 1;
        //  vm.totalItems = 12;
        // vm.currentPage = 1;
        // vm.maxSize = 5;
        //$scope.per_page = 5;
        //$scope.numPages = $scope.bigTotalItems / $scope.per_page;
        // $scope.setPage = function(pageNo) {
        //     vm.currentPage = pageNo;
        $scope.listedBy = 'getPictures';
        $scope.pageChanged = function () {
            if ($scope.listedBy === 'getPictures') {
                $scope.getPictures();
            }
            else if ($scope.listedBy === 'getPicturesByArtist') {
                getPicturesByArtist();
            }
            else if ($scope.listedBy === 'getPicturesByYear') {
                getPicturesByYear();
            }
        };
        $scope.yearListData = [];
        $scope.yearListData = YearsService.query();
        $scope.yearListData.$promise.then(function (result) {
            $scope.yearData = result;
        });
        //       vm.pictures = PicturesService.query();
        //      vm.pictures.$promise.then(function(result) {
        //          vm.pictures = result;
        //          vm.wait = false;
        //      }
        //      );
        var changeArtists = function () {
            $scope.dataArtist = [];
            var yearEnrolled = $scope.yearData.selectedOption.year;
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function (result) {
                $scope.dataArtist = result;
            });
        };
        $scope.getPictures = function () {
            vm.wait = true;
            vm.pictures = PicturesPage.get({ page: $scope.currentPage });
            vm.pictures.$promise.then(function (response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                $scope.dataArtist = [];
                if (response.count !== -1)
                    $scope.totalItems = response.count;
                vm.wait = false;
            });
        };
        //$scope.getPictures();
        $scope.artistChanged = function () {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            getPicturesByArtist();
        };
        var getPicturesByArtist = function () {
            vm.wait = true;
            $scope.listedBy = 'getPicturesByArtist';
            vm.pictures = PicturesByArtist.get({ artistId: $scope.dataArtist.selectedOption._id, page: $scope.currentPage, count: $scope.totalItems });
            vm.pictures.$promise.then(function (response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                if (response.count !== -1)
                    $scope.totalItems = response.count;
            });
        };
        $scope.yearListChanged = function () {
            changeArtists();
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            // getPicturesByYear();
        };
        var getPicturesByYear = function () {
            vm.wait = true;
            $scope.listedBy = 'getPicturesByYear';
            vm.pictures = PicturesByYear.get({ year: $scope.yearListData.selectedOption.year, page: $scope.currentPage, count: $scope.totalItems });
            vm.pictures.$promise.then(function (response) {
                vm.pictures = response.pictures;
                if (response.count !== -1)
                    $scope.totalItems = response.count;
                vm.wait = false;
            });
        };
    }
}());

(function () {
    'use strict';
    angular
        .module('pictures')
        .controller('PicturesController', PicturesController);
    PicturesController.$inject = ['ArtistYearEnrolled', 'SubYears', 'YearsService', 'MediumsService', '$scope', '$timeout', '$state', 'pictureResolve', '$window', 'Authentication', 'FileUploader'];
    function PicturesController(ArtistYearEnrolled, SubYears, YearsService, MediumsService, $scope, $timeout, $state, picture, $window, Authentication, FileUploader) {
        var vm = this;
        //
        vm.picture = picture;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        //used to setup the year drop down 
        var today = new Date();
        var yyyy = today.getFullYear();
        var setYearOption = function (select) {
            if (select) {
                yyyy = select;
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            if (vm.picture.year) {
                setYearOption(vm.picture.year);
            }
            else {
            }
        });
        // year level drop down
        /* this is not need for the picture as it is based on the subject
        $scope.yearLevelData = {
            availableOptions: [
                { yearLevel: 7 },
                { yearLevel: 8 },
                { yearLevel: 9 },
                { yearLevel: 10 },
                { yearLevel: 11 },
                { yearLevel: 12 }
            ],
            selectedOption: { yearLevel: 7 } //This sets the default value of the select in the ui
        };
        */
        //semester dropdown
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        //mediums drop down
        $scope.medium = [];
        $scope.data = [];
        $scope.medium = MediumsService.query();
        $scope.medium.$promise.then(function (result) {
            $scope.data = result;
            if (vm.picture.medium) {
                for (var x = 0; x < $scope.data.length; x++) {
                    if ($scope.data[x].title == vm.picture.medium) {
                        $scope.data.selectedOption = $scope.data[x];
                    }
                }
            }
            else {
                $scope.data.selectedOption = $scope.data[0];
            }
        });
        //subject dropdown
        $scope.load = function () {
            $scope.dataArtist = [];
            $scope.dataSubject = [];
            $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
            $scope.yearSelect = $scope.yearData.selectedOption.year;
            $scope.subjects = SubYears.query({ year: $scope.yearSelect, semester: $scope.semesterSelect });
            $scope.subjects.$promise.then(function (result) {
                $scope.dataSubject = result;
            });
        };
        //artist dropdown
        $scope.changeArtists = function () {
            $scope.dataArtist = [];
            var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.dataSubject.selectedOption.yearLevel);
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function () {
                for (var x = 0; x < $scope.artists.length; x++) {
                    if ($scope.artists[x].active) {
                        $scope.dataArtist.push($scope.artists[x]);
                    }
                }
            });
        };
        //set up for the picture if it is edit mode 
        if (vm.picture._id) {
            $scope.dataArtist = [];
            $scope.dataSubject = [];
            //$scope.load();
            if (vm.picture.yearLevel) {
                var yearEnrolled = vm.picture.year + (7 - vm.picture.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                $scope.artists.$promise.then(function (result) {
                    for (var c = 0; c < result.length; c++) {
                        if (result[c].active) {
                            $scope.dataArtist.push(result[c]);
                        }
                    }
                    for (var z = 0; z < $scope.dataArtist.length; z++) {
                        if ($scope.dataArtist[z].name === vm.picture.artistName) {
                            $scope.dataArtist.selectedOption = $scope.dataArtist[z];
                            break;
                        }
                    }
                });
            }
            if (vm.picture.semester) {
                var len = $scope.semesterData.availableOptions.length;
                for (var k = 0; k < len; k++) {
                    if ($scope.semesterData.availableOptions[k].semester === vm.picture.semester) {
                        $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[k];
                        break;
                    }
                }
            }
            $scope.subjects = SubYears.query({ year: vm.picture.year, semester: vm.picture.semester });
            $scope.subjects.$promise.then(function (result) {
                $scope.dataSubject = result;
                var lenSub = $scope.dataSubject.length;
                for (var a = 0; a < lenSub; a++) {
                    if ($scope.dataSubject[a]._id === vm.picture.subject) {
                        $scope.dataSubject.selectedOption = $scope.dataSubject[a];
                        break;
                    }
                }
            });
        }
        // load picture for file selector
        $scope.addPicture = function (element) {
            if (element.files && element.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    $scope.$apply(function ($scope) {
                        vm.picture.picture = e.target.result;
                    });
                };
                FR.readAsDataURL(element.files[0]);
            }
        }; //closure for addPicture
        // Remove existing Picture
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.picture.$remove($state.go('pictures.list'));
            }
        }
        // Save Picture
        function save(isValid) {
            vm.picture.artist = $scope.dataArtist.selectedOption._id;
            vm.picture.artistName = $scope.dataArtist.selectedOption.name;
            vm.picture.year = $scope.yearData.selectedOption.year;
            vm.picture.medium = $scope.data.selectedOption.title;
            vm.picture.subject = $scope.dataSubject.selectedOption._id;
            vm.picture.teacher = $scope.dataSubject.selectedOption.teacher;
            vm.picture.subjectName = $scope.dataSubject.selectedOption.title;
            vm.picture.semester = $scope.semesterData.selectedOption.semester;
            vm.picture.yearLevel = $scope.dataSubject.selectedOption.yearLevel;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.pictureForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.picture._id) {
                vm.picture.$update(successCallback, errorCallback);
            }
            else {
                vm.picture.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('pictures.view', {
                    pictureId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
        vm.cancelUpload = cancelUpload;
        // Create file uploader instance
        vm.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture',
            onAfterAddingFile: onAfterAddingFile,
            onSuccessItem: onSuccessItem,
            onErrorItem: onErrorItem
        });
        // Set file uploader image filter
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fre) {
                    $timeout(function () {
                        vm.picture.picture = fre.target.result;
                    }, 0);
                };
            }
        }
        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message
            vm.success = true;
            // Populate user object
            vm.user = Authentication.user = response;
            // Clear upload buttons
            cancelUpload();
        }
        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            cancelUpload();
            // Show error message
            vm.error = response.message;
        }
        // Change user profile picture
        function uploadProfilePicture() {
            // Clear messages
            vm.success = vm.error = null;
            // Start upload
            vm.uploader.uploadAll();
        }
        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
            vm.imageURL = vm.user.profileImageURL;
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('pictures.services')
        .factory('PicturesService', PicturesService);
    PicturesService.$inject = ['$resource'];
    function PicturesService($resource) {
        return $resource('api/pictures/:pictureId', {
            pictureId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
//Articles service used for communicating with the articles REST endpoints
angular.module('pictures').factory('PicturesPage', ['$resource',
    function ($resource) {
        return $resource('api/picturespage/:page', {
            page: '@page'
        });
    }
]);
//Articles service used for communicating with the articles REST endpoints
angular.module('pictures').factory('PicturesFrontPage', ['$resource',
    function ($resource) {
        return $resource('api/picturesfrontpage/:page', {
            page: '@page'
        });
    }
]);
//Pictures by Artist REST endpoints
angular.module('pictures').factory('PicturesByArtist', ['$resource',
    function ($resource) {
        return $resource('api/picturesbyartist/:artistId/page/:page/count/:count', {
            artist: '@artistId', page: '@page'
        });
    }
]);
//Pictures by Year REST endpoints
angular.module('pictures').factory('PicturesByYear', ['$resource',
    function ($resource) {
        return $resource('api/picturesbyyear/:year/page/:page/count/:count', {
            artist: '@year', page: '@page', count: '@count'
        });
    }
]);

(function () {
    'use strict';
    angular
        .module('subjects')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Subjects',
            state: 'subjects',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'subjects', {
            title: 'List Subjects',
            state: 'subjects.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'subjects', {
            title: 'Create Subject',
            state: 'subjects.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('subjects.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('subjects', {
            abstract: true,
            url: '/subjects',
            template: '<ui-view/>'
        })
            .state('subjects.list', {
            url: '',
            templateUrl: 'modules/subjects/client/views/list-subjects.client.view.html',
            controller: 'SubjectsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Subjects List'
            }
        })
            .state('subjects.create', {
            url: '/create',
            templateUrl: 'modules/subjects/client/views/form-subject.client.view.html',
            controller: 'SubjectsController',
            controllerAs: 'vm',
            resolve: {
                subjectResolve: newSubject
            },
            data: {
                roles: ['teach', 'admin'],
                pageTitle: 'Subjects Create'
            }
        })
            .state('subjects.edit', {
            url: '/:subjectId/edit',
            templateUrl: 'modules/subjects/client/views/form-subject.client.view.html',
            controller: 'SubjectsController',
            controllerAs: 'vm',
            resolve: {
                subjectResolve: getSubject
            },
            data: {
                roles: ['teach', 'admin'],
                pageTitle: 'Edit Subject {{ subjectResolve.title }}'
            }
        })
            .state('subjects.view', {
            url: '/:subjectId',
            templateUrl: 'modules/subjects/client/views/view-subject.client.view.html',
            controller: 'SubjectsController',
            controllerAs: 'vm',
            resolve: {
                subjectResolve: getSubject
            },
            data: {
                pageTitle: 'Subject {{ subjectResolve.title }}'
            }
        });
    }
    getSubject.$inject = ['$stateParams', 'SubjectsService'];
    function getSubject($stateParams, SubjectsService) {
        return SubjectsService.get({
            subjectId: $stateParams.subjectId
        }).$promise;
    }
    newSubject.$inject = ['SubjectsService'];
    function newSubject(SubjectsService) {
        return new SubjectsService();
    }
}());

(function () {
    'use strict';
    angular
        .module('subjects')
        .controller('SubjectsListController', SubjectsListController);
    SubjectsListController.$inject = ['$scope', 'SubYears', 'SubjectsService', 'YearsService'];
    function SubjectsListController($scope, SubYears, SubjectsService, YearsService) {
        var vm = this;
        var setYearOption = function (select) {
            if (select) {
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            // setYearOption(yyyy);
        });
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        $scope.listSubjects = function () {
            //    if ($scope.yearData.selectedOption.year & $scope.semesterData.selectedOption.semester) {
            $scope.yearSelect = $scope.yearData.selectedOption.year;
            $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
            $scope.subjects = SubYears.query({ year: $scope.yearData.selectedOption.year, semester: $scope.semesterData.selectedOption.semester });
            $scope.subjects.$promise.then(function (response) {
                vm.wait = false;
                vm.subjects = response;
                if (response.count !== -1)
                    $scope.totalItems = response.count;
            });
            //   };
        };
        // vm.subjects = SubjectsService.query();
        //test
    }
}());

(function () {
    'use strict';
    angular
        .module('subjects')
        .controller('SubjectsController', SubjectsController);
    SubjectsController.$inject = ['SubjectsService', 'YearsService', 'TeachersService', 'ArtistYearEnrolled', 'SubYears', '$scope', '$state', 'subjectResolve', '$window', 'Authentication'];
    function SubjectsController(SubjectsService, YearsService, TeachersService, ArtistYearEnrolled, SubYears, $scope, $state, subject, $window, Authentication) {
        var vm = this;
        //
        vm.subject = subject;
        if (!vm.subject.artists)
            vm.subject.artists = [];
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        //$scope.showUser = false;
        $scope.teacher = TeachersService.query();
        $scope.teacher.$promise.then(function (result) {
            $scope.teacherData = result;
            if (vm.subject.teacher) {
                for (var j = 0; j < $scope.teacherData.length; j++) {
                    if ($scope.teacherData[j].title === vm.subject.teacher) {
                        $scope.teacherData.selectedOption = $scope.teacherData[j];
                        break;
                    }
                }
            }
            //$scope.teacherData.selectedOption = $scope.teacherData[0];
        });
        //  if ($scope.authentication.user.roles.indexOf('admin') !== -1 || $scope.authentication.user.roles.indexOf('teach') !== -1) $scope.showUser = true;
        $scope.yearSelect = 'All';
        $scope.semesterSelect = 'All';
        $scope.arrayArtists = [];
        $scope.artists = [];
        var today = new Date();
        var yyyy = today.getFullYear();
        var setYearOption = function (select) {
            if (select) {
                yyyy = select;
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            if (vm.subject.year)
                setYearOption(vm.subject.year);
        });
        $scope.yearLevelData = {
            availableOptions: [
                { yearLevel: 7 },
                { yearLevel: 8 },
                { yearLevel: 9 },
                { yearLevel: 10 },
                { yearLevel: 11 },
                { yearLevel: 12 }
            ],
            selectedOption: { yearLevel: 7 } //This sets the default value of the select in the ui
        };
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        if (vm.subject._id) {
            if (vm.subject.yearLevel) {
                var yearEnrolled = vm.subject.year + (7 - vm.subject.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                $scope.artists.$promise.then(function () {
                    for (var y = 0; y < $scope.artists.length; y++) {
                        if (vm.subject.artists.indexOf($scope.artists[y]._id) > -1) {
                            $scope.artists[y].selected = true;
                        }
                    }
                });
                var l = $scope.yearLevelData.availableOptions.length;
                for (var i = 0; i < l; i++) {
                    if ($scope.yearLevelData.availableOptions[i].yearLevel === vm.subject.yearLevel) {
                        $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
                        break;
                    }
                }
            }
            if (vm.subject.semester) {
                var len = $scope.semesterData.availableOptions.length;
                for (var k = 0; k < len; k++) {
                    if ($scope.semesterData.availableOptions[k].semester === vm.subject.semester) {
                        $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[k];
                        break;
                    }
                }
            }
        }
        $scope.findArtistForSubject = function () {
            $scope.subject = SubjectsService.get({
                subjectId: vm.subject._id
            });
            $scope.subject.$promise.then(function () {
                var yearEnrolled = $scope.subject.year + (7 - $scope.subject.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            });
        };
        // Find existing Subject
        $scope.changeArtists = function () {
            var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.yearLevelData.selectedOption.yearLevel);
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function () {
                for (var x = 0; x < $scope.artists.length; x++) {
                    if ($scope.subject.artists.indexOf($scope.artists[x]._id) > -1) {
                        $scope.artists[x].selected = true;
                    }
                }
            });
        };
        // Remove existing Subject
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.subject.$remove($state.go('subjects.list'));
            }
        }
        // Save Subject
        function save(isValid) {
            vm.subject.yearLevel = $scope.yearLevelData.selectedOption.yearLevel;
            vm.subject.year = $scope.yearData.selectedOption.year;
            vm.subject.semester = $scope.semesterData.selectedOption.semester;
            vm.subject.teacher = $scope.teacherData.selectedOption.title;
            for (var i = 0; i < $scope.artists.length; i++) {
                if ($scope.artists[i].selected) {
                    var find = vm.subject.artists.indexOf($scope.artists[i]._id);
                    if (find === -1) {
                        vm.subject.artists.push($scope.artists[i]._id);
                    }
                }
                else {
                    var at = vm.subject.artists.indexOf($scope.artists[i]._id);
                    if (at !== -1) {
                        vm.subject.artists.splice(at, 1);
                    }
                }
            }
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.subjectForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.subject._id) {
                vm.subject.$update(successCallback, errorCallback);
            }
            else {
                vm.subject.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('subjects.view', {
                    subjectId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('subjects.services')
        .factory('SubjectsService', SubjectsService);
    SubjectsService.$inject = ['$resource'];
    function SubjectsService($resource) {
        return $resource('api/subjects/:subjectId', {
            subjectId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
angular.module('subjects').factory('SubYears', ['$resource',
    function ($resource) {
        return $resource('api/year/:year/semester/:semester', {
            year: '@year', semester: '@semseter'
        });
    }
]);

(function () {
    'use strict';
    angular
        .module('teachers')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Teachers',
            state: 'teachers',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'teachers', {
            title: 'List Teachers',
            state: 'teachers.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'teachers', {
            title: 'Create Teacher',
            state: 'teachers.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('teachers.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('teachers', {
            abstract: true,
            url: '/teachers',
            template: '<ui-view/>'
        })
            .state('teachers.list', {
            url: '',
            templateUrl: 'modules/teachers/client/views/list-teachers.client.view.html',
            controller: 'TeachersListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Teachers List'
            }
        })
            .state('teachers.create', {
            url: '/create',
            templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
            controller: 'TeachersController',
            controllerAs: 'vm',
            resolve: {
                teacherResolve: newTeacher
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Teachers Create'
            }
        })
            .state('teachers.edit', {
            url: '/:teacherId/edit',
            templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
            controller: 'TeachersController',
            controllerAs: 'vm',
            resolve: {
                teacherResolve: getTeacher
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Teacher {{ teacherResolve.title }}'
            }
        })
            .state('teachers.view', {
            url: '/:teacherId',
            templateUrl: 'modules/teachers/client/views/view-teacher.client.view.html',
            controller: 'TeachersController',
            controllerAs: 'vm',
            resolve: {
                teacherResolve: getTeacher
            },
            data: {
                pageTitle: 'Teacher {{ teacherResolve.title }}'
            }
        });
    }
    getTeacher.$inject = ['$stateParams', 'TeachersService'];
    function getTeacher($stateParams, TeachersService) {
        return TeachersService.get({
            teacherId: $stateParams.teacherId
        }).$promise;
    }
    newTeacher.$inject = ['TeachersService'];
    function newTeacher(TeachersService) {
        return new TeachersService();
    }
}());

(function () {
    'use strict';
    angular
        .module('teachers')
        .controller('TeachersListController', TeachersListController);
    TeachersListController.$inject = ['TeachersService'];
    function TeachersListController(TeachersService) {
        var vm = this;
        vm.teachers = TeachersService.query();
    }
}());

(function () {
    'use strict';
    angular
        .module('teachers')
        .controller('TeachersController', TeachersController);
    TeachersController.$inject = ['$scope', '$state', 'teacherResolve', '$window', 'Authentication'];
    function TeachersController($scope, $state, teacher, $window, Authentication) {
        var vm = this;
        //
        vm.teacher = teacher;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // Remove existing Teacher
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.teacher.$remove($state.go('teachers.list'));
            }
        }
        // Save Teacher
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.teacherForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.teacher._id) {
                vm.teacher.$update(successCallback, errorCallback);
            }
            else {
                vm.teacher.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('teachers.view', {
                    teacherId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('teachers.services')
        .factory('TeachersService', TeachersService);
    TeachersService.$inject = ['$resource'];
    function TeachersService($resource) {
        return $resource('api/teachers/:teacherId', {
            teacherId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('users.admin')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    // Configuring the Users module
    function menuConfig(Menus) {
        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'Manage Users',
            state: 'admin.users'
        });
    }
}());

(function () {
    'use strict';
    // Setting up route
    angular
        .module('users.admin.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('admin.users', {
            url: '/users',
            templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
            controller: 'UserListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Users List'
            }
        })
            .state('admin.user', {
            url: '/users/:userId',
            templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
            controller: 'UserController',
            controllerAs: 'vm',
            resolve: {
                userResolve: getUser
            },
            data: {
                pageTitle: 'Edit {{ userResolve.displayName }}'
            }
        })
            .state('admin.user-edit', {
            url: '/users/:userId/edit',
            templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
            controller: 'UserController',
            controllerAs: 'vm',
            resolve: {
                userResolve: getUser
            },
            data: {
                pageTitle: 'Edit User {{ userResolve.displayName }}'
            }
        });
        getUser.$inject = ['$stateParams', 'AdminService'];
        function getUser($stateParams, AdminService) {
            return AdminService.get({
                userId: $stateParams.userId
            }).$promise;
        }
    }
}());

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

(function () {
    'use strict';
    // Setting up route
    angular
        .module('users.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        // Users state routing
        $stateProvider
            .state('settings', {
            abstract: true,
            url: '/settings',
            templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
            controller: 'SettingsController',
            controllerAs: 'vm',
            data: {
                roles: ['user', 'admin']
            }
        })
            .state('settings.profile', {
            url: '/profile',
            templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
            controller: 'EditProfileController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Settings'
            }
        })
            .state('settings.password', {
            url: '/password',
            templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
            controller: 'ChangePasswordController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Settings password'
            }
        })
            .state('settings.accounts', {
            url: '/accounts',
            templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
            controller: 'SocialAccountsController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Settings accounts'
            }
        })
            .state('settings.picture', {
            url: '/picture',
            templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
            controller: 'ChangeProfilePictureController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Settings picture'
            }
        })
            .state('authentication', {
            abstract: true,
            url: '/authentication',
            templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
            controller: 'AuthenticationController',
            controllerAs: 'vm'
        })
            .state('authentication.signup', {
            url: '/signup',
            templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
            controller: 'AuthenticationController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Signup'
            }
        })
            .state('authentication.signin', {
            url: '/signin?err',
            templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
            controller: 'AuthenticationController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Signin'
            }
        })
            .state('password', {
            abstract: true,
            url: '/password',
            template: '<ui-view/>'
        })
            .state('password.forgot', {
            url: '/forgot',
            templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
            controller: 'PasswordController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Password forgot'
            }
        })
            .state('password.reset', {
            abstract: true,
            url: '/reset',
            template: '<ui-view/>'
        })
            .state('password.reset.invalid', {
            url: '/invalid',
            templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html',
            data: {
                pageTitle: 'Password reset invalid'
            }
        })
            .state('password.reset.success', {
            url: '/success',
            templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
            data: {
                pageTitle: 'Password reset success'
            }
        })
            .state('password.reset.form', {
            url: '/:token',
            templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
            controller: 'PasswordController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Password reset form'
            }
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('users.admin')
        .controller('UserListController', UserListController);
    UserListController.$inject = ['$scope', '$filter', 'AdminService'];
    function UserListController($scope, $filter, AdminService) {
        var vm = this;
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        AdminService.query(function (data) {
            vm.users = data;
            vm.buildPager();
        });
        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 15;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }
        function figureOutItemsToDisplay() {
            vm.filteredItems = $filter('filter')(vm.users, {
                $: vm.search
            });
            vm.filterLength = vm.filteredItems.length;
            var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
            var end = begin + vm.itemsPerPage;
            vm.pagedItems = vm.filteredItems.slice(begin, end);
        }
        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }
    }
}());

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

(function () {
    'use strict';
    angular
        .module('users.admin')
        .controller('UserController', UserController);
    UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve'];
    function UserController($scope, $state, $window, Authentication, user) {
        var vm = this;
        vm.authentication = Authentication;
        vm.user = user;
        vm.remove = remove;
        vm.update = update;
        function remove(user) {
            if ($window.confirm('Are you sure you want to delete this user?')) {
                if (user) {
                    user.$remove();
                    vm.users.splice(vm.users.indexOf(user), 1);
                }
                else {
                    vm.user.$remove(function () {
                        $state.go('admin.users');
                    });
                }
            }
        }
        function update(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                return false;
            }
            var user = vm.user;
            user.$update(function () {
                $state.go('admin.user', {
                    userId: user._id
                });
            }, function (errorResponse) {
                vm.error = errorResponse.data.message;
            });
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('AuthenticationController', AuthenticationController);
    AuthenticationController.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator'];
    function AuthenticationController($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
        var vm = this;
        vm.authentication = Authentication;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        vm.signup = signup;
        vm.signin = signin;
        vm.callOauthProvider = callOauthProvider;
        // Get an eventual error defined in the URL query string:
        vm.error = $location.search().err;
        // If user is signed in then redirect back home
        if (vm.authentication.user) {
            $location.path('/');
        }
        function signup(isValid) {
            vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                return false;
            }
            $http.post('/api/auth/signup', vm.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                vm.authentication.user = response;
                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                vm.error = response.message;
            });
        }
        function signin(isValid) {
            vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                return false;
            }
            $http.post('/api/auth/signin', vm.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                vm.authentication.user = response;
                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                vm.error = response.message;
            });
        }
        // OAuth provider request
        function callOauthProvider(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }
            // Effectively call OAuth authentication route:
            $window.location.href = url;
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('PasswordController', PasswordController);
    PasswordController.$inject = ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator'];
    function PasswordController($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
        var vm = this;
        vm.resetUserPassword = resetUserPassword;
        vm.askForPasswordReset = askForPasswordReset;
        vm.authentication = Authentication;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        // If user is signed in then redirect back home
        if (vm.authentication.user) {
            $location.path('/');
        }
        // Submit forgotten password account id
        function askForPasswordReset(isValid) {
            vm.success = vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');
                return false;
            }
            $http.post('/api/auth/forgot', vm.credentials).success(function (response) {
                // Show user success message and clear form
                vm.credentials = null;
                vm.success = response.message;
            }).error(function (response) {
                // Show user error message and clear form
                vm.credentials = null;
                vm.error = response.message;
            });
        }
        // Change user password
        function resetUserPassword(isValid) {
            vm.success = vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');
                return false;
            }
            $http.post('/api/auth/reset/' + $stateParams.token, vm.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                vm.passwordDetails = null;
                // Attach user profile
                Authentication.user = response;
                // And redirect to the index page
                $location.path('/password/reset/success');
            }).error(function (response) {
                vm.error = response.message;
            });
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('ChangePasswordController', ChangePasswordController);
    ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'PasswordValidator'];
    function ChangePasswordController($scope, $http, Authentication, PasswordValidator) {
        var vm = this;
        vm.user = Authentication.user;
        vm.changeUserPassword = changeUserPassword;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        // Change user password
        function changeUserPassword(isValid) {
            vm.success = vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');
                return false;
            }
            $http.post('/api/users/password', vm.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.$broadcast('show-errors-reset', 'vm.passwordForm');
                vm.success = true;
                vm.passwordDetails = null;
            }).error(function (response) {
                vm.error = response.message;
            });
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('ChangeProfilePictureController', ChangeProfilePictureController);
    ChangeProfilePictureController.$inject = ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader'];
    function ChangeProfilePictureController($scope, $timeout, $window, Authentication, FileUploader) {
        var vm = this;
        vm.user = Authentication.user;
        vm.imageURL = vm.user.profileImageURL;
        vm.uploadProfilePicture = uploadProfilePicture;
        vm.cancelUpload = cancelUpload;
        // Create file uploader instance
        vm.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture',
            onAfterAddingFile: onAfterAddingFile,
            onSuccessItem: onSuccessItem,
            onErrorItem: onErrorItem
        });
        // Set file uploader image filter
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fre) {
                    $timeout(function () {
                        vm.imageURL = fre.target.result;
                    }, 0);
                };
            }
        }
        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message
            vm.success = true;
            // Populate user object
            vm.user = Authentication.user = response;
            // Clear upload buttons
            cancelUpload();
        }
        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            cancelUpload();
            // Show error message
            vm.error = response.message;
        }
        // Change user profile picture
        function uploadProfilePicture() {
            // Clear messages
            vm.success = vm.error = null;
            // Start upload
            vm.uploader.uploadAll();
        }
        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
            vm.imageURL = vm.user.profileImageURL;
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('EditProfileController', EditProfileController);
    EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication'];
    function EditProfileController($scope, $http, $location, UsersService, Authentication) {
        var vm = this;
        vm.user = Authentication.user;
        vm.updateUserProfile = updateUserProfile;
        // Update a user profile
        function updateUserProfile(isValid) {
            vm.success = vm.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                return false;
            }
            var user = new UsersService(vm.user);
            user.$update(function (response) {
                $scope.$broadcast('show-errors-reset', 'vm.userForm');
                vm.success = true;
                Authentication.user = response;
            }, function (response) {
                vm.error = response.data.message;
            });
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('SocialAccountsController', SocialAccountsController);
    SocialAccountsController.$inject = ['$scope', '$http', 'Authentication'];
    function SocialAccountsController($scope, $http, Authentication) {
        var vm = this;
        vm.user = Authentication.user;
        vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
        vm.isConnectedSocialAccount = isConnectedSocialAccount;
        vm.removeUserSocialAccount = removeUserSocialAccount;
        // Check if there are additional accounts
        function hasConnectedAdditionalSocialAccounts() {
            return ($scope.user.additionalProvidersData && Object.keys($scope.user.additionalProvidersData).length);
        }
        // Check if provider is already in use with current user
        function isConnectedSocialAccount(provider) {
            return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
        }
        // Remove a user social account
        function removeUserSocialAccount(provider) {
            vm.success = vm.error = null;
            $http.delete('/api/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function (response) {
                // If successful show success message and clear form
                vm.success = true;
                vm.user = Authentication.user = response;
            }).error(function (response) {
                vm.error = response.message;
            });
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .controller('SettingsController', SettingsController);
    SettingsController.$inject = ['$scope', 'Authentication'];
    function SettingsController($scope, Authentication) {
        var vm = this;
        vm.user = Authentication.user;
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .directive('passwordValidator', passwordValidator);
    passwordValidator.$inject = ['PasswordValidator'];
    function passwordValidator(PasswordValidator) {
        var directive = {
            require: 'ngModel',
            link: link
        };
        return directive;
        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.requirements = function (password) {
                var status = true;
                if (password) {
                    var result = PasswordValidator.getResult(password);
                    var requirementsIdx = 0;
                    // Requirements Meter - visual indicator for users
                    var requirementsMeter = [{
                            color: 'danger',
                            progress: '20'
                        }, {
                            color: 'warning',
                            progress: '40'
                        }, {
                            color: 'info',
                            progress: '60'
                        }, {
                            color: 'primary',
                            progress: '80'
                        }, {
                            color: 'success',
                            progress: '100'
                        }];
                    if (result.errors.length < requirementsMeter.length) {
                        requirementsIdx = requirementsMeter.length - result.errors.length - 1;
                    }
                    scope.requirementsColor = requirementsMeter[requirementsIdx].color;
                    scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;
                    if (result.errors.length) {
                        scope.getPopoverMsg = PasswordValidator.getPopoverMsg();
                        scope.passwordErrors = result.errors;
                        status = false;
                    }
                    else {
                        scope.getPopoverMsg = '';
                        scope.passwordErrors = [];
                        status = true;
                    }
                }
                return status;
            };
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('users')
        .directive('passwordVerify', passwordVerify);
    function passwordVerify() {
        var directive = {
            require: 'ngModel',
            scope: {
                passwordVerify: '='
            },
            link: link
        };
        return directive;
        function link(scope, element, attrs, ngModel) {
            var status = true;
            scope.$watch(function () {
                var combined;
                if (scope.passwordVerify || ngModel) {
                    combined = scope.passwordVerify + '_' + ngModel;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ngModel.$validators.passwordVerify = function (password) {
                        var origin = scope.passwordVerify;
                        return (origin === password);
                    };
                }
            });
        }
    }
}());

(function () {
    'use strict';
    // Users directive used to force lowercase input
    angular
        .module('users')
        .directive('lowercase', lowercase);
    function lowercase() {
        var directive = {
            require: 'ngModel',
            link: link
        };
        return directive;
        function link(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (input) {
                return input ? input.toLowerCase() : '';
            });
            element.css('text-transform', 'lowercase');
        }
    }
}());

(function () {
    'use strict';
    // Authentication service for user variables
    angular
        .module('users.services')
        .factory('Authentication', Authentication);
    Authentication.$inject = ['$window'];
    function Authentication($window) {
        var auth = {
            user: $window.user
        };
        return auth;
    }
}());

(function () {
    'use strict';
    // PasswordValidator service used for testing the password strength
    angular
        .module('users.services')
        .factory('PasswordValidator', PasswordValidator);
    PasswordValidator.$inject = ['$window'];
    function PasswordValidator($window) {
        var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
        var service = {
            getResult: getResult,
            getPopoverMsg: getPopoverMsg
        };
        return service;
        function getResult(password) {
            var result = owaspPasswordStrengthTest.test(password);
            return result;
        }
        function getPopoverMsg() {
            var popoverMsg = 'Please enter a passphrase or password with 10 or more characters, numbers, lowercase, uppercase, and special characters.';
            return popoverMsg;
        }
    }
}());

(function () {
    'use strict';
    // Users service used for communicating with the users REST endpoint
    angular
        .module('users.services')
        .factory('UsersService', UsersService);
    UsersService.$inject = ['$resource'];
    function UsersService($resource) {
        return $resource('api/users', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
    // TODO this should be Users service
    angular
        .module('users.admin.services')
        .factory('AdminService', AdminService);
    AdminService.$inject = ['$resource'];
    function AdminService($resource) {
        return $resource('api/users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('years')
        .run(menuConfig);
    menuConfig.$inject = ['Menus'];
    function menuConfig(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Years',
            state: 'years',
            type: 'dropdown',
            roles: ['*']
        });
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'years', {
            title: 'List Years',
            state: 'years.list'
        });
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'years', {
            title: 'Create Year',
            state: 'years.create',
            roles: ['admin', 'teach']
        });
    }
}());

(function () {
    'use strict';
    angular
        .module('years.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('years', {
            abstract: true,
            url: '/years',
            template: '<ui-view/>'
        })
            .state('years.list', {
            url: '',
            templateUrl: 'modules/years/client/views/list-years.client.view.html',
            controller: 'YearsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Years List'
            }
        })
            .state('years.create', {
            url: '/create',
            templateUrl: 'modules/years/client/views/form-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: newYear
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Years Create'
            }
        })
            .state('years.edit', {
            url: '/:yearId/edit',
            templateUrl: 'modules/years/client/views/form-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: getYear
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Year {{ yearResolve.year }}'
            }
        })
            .state('years.view', {
            url: '/:yearId',
            templateUrl: 'modules/years/client/views/view-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: getYear
            },
            data: {
                pageTitle: 'Year {{ yearResolve.year }}'
            }
        });
    }
    getYear.$inject = ['$stateParams', 'YearsService'];
    function getYear($stateParams, YearsService) {
        return YearsService.get({
            yearId: $stateParams.yearId
        }).$promise;
    }
    newYear.$inject = ['YearsService'];
    function newYear(YearsService) {
        return new YearsService();
    }
}());

(function () {
    'use strict';
    angular
        .module('years')
        .controller('YearsListController', YearsListController);
    YearsListController.$inject = ['YearsService'];
    function YearsListController(YearsService) {
        var vm = this;
        vm.years = YearsService.query();
    }
}());

(function () {
    'use strict';
    angular
        .module('years')
        .controller('YearsController', YearsController);
    YearsController.$inject = ['$scope', '$state', 'yearResolve', '$window', 'Authentication'];
    function YearsController($scope, $state, year, $window, Authentication) {
        var vm = this;
        //
        vm.year = year;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // Remove existing Year
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.year.$remove($state.go('years.list'));
            }
        }
        // Save Year
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.yearForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.year._id) {
                vm.year.$update(successCallback, errorCallback);
            }
            else {
                vm.year.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('years.view', {
                    yearId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());

(function () {
    'use strict';
    angular
        .module('years.services')
        .factory('YearsService', YearsService);
    YearsService.$inject = ['$resource'];
    function YearsService($resource) {
        return $resource('api/years/:yearId', {
            yearId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
