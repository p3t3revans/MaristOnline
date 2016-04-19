(function () {
  'use strict';

  describe('Artists Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArtistsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArtistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArtistsService = _ArtistsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('artists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/artists');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('artists.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/artists/client/views/list-artists.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ArtistsController,
          mockArtist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('artists.view');
          $templateCache.put('modules/artists/client/views/view-artist.client.view.html', '');

          // create mock artist
          mockArtist = new ArtistsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Artist about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ArtistsController = $controller('ArtistsController as vm', {
            $scope: $scope,
            artistResolve: mockArtist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:artistId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.artistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            artistId: 1
          })).toEqual('/artists/1');
        }));

        it('should attach an artist to the controller scope', function () {
          expect($scope.vm.artist._id).toBe(mockArtist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/artists/client/views/view-artist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArtistsController,
          mockArtist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('artists.create');
          $templateCache.put('modules/artists/client/views/form-artist.client.view.html', '');

          // create mock artist
          mockArtist = new ArtistsService();

          // Initialize Controller
          ArtistsController = $controller('ArtistsController as vm', {
            $scope: $scope,
            artistResolve: mockArtist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.artistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/artists/create');
        }));

        it('should attach an artist to the controller scope', function () {
          expect($scope.vm.artist._id).toBe(mockArtist._id);
          expect($scope.vm.artist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/artists/client/views/form-artist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArtistsController,
          mockArtist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('artists.edit');
          $templateCache.put('modules/artists/client/views/form-artist.client.view.html', '');

          // create mock artist
          mockArtist = new ArtistsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Artist about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ArtistsController = $controller('ArtistsController as vm', {
            $scope: $scope,
            artistResolve: mockArtist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:artistId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.artistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            artistId: 1
          })).toEqual('/artists/1/edit');
        }));

        it('should attach an artist to the controller scope', function () {
          expect($scope.vm.artist._id).toBe(mockArtist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/artists/client/views/form-artist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('artists.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('artists/');
          $rootScope.$digest();

          expect($location.path()).toBe('/artists');
          expect($state.current.templateUrl).toBe('modules/artists/client/views/list-artists.client.view.html');
        }));
      });

    });
  });
}());
