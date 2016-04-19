(function () {
  'use strict';

  describe('Mediums Route Tests', function () {
    // Initialize global variables
    var $scope,
      MediumsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MediumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MediumsService = _MediumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mediums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mediums');
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
          liststate = $state.get('mediums.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/mediums/client/views/list-mediums.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MediumsController,
          mockMedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mediums.view');
          $templateCache.put('modules/mediums/client/views/view-medium.client.view.html', '');

          // create mock medium
          mockMedium = new MediumsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Medium about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MediumsController = $controller('MediumsController as vm', {
            $scope: $scope,
            mediumResolve: mockMedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mediumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mediumId: 1
          })).toEqual('/mediums/1');
        }));

        it('should attach an medium to the controller scope', function () {
          expect($scope.vm.medium._id).toBe(mockMedium._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mediums/client/views/view-medium.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MediumsController,
          mockMedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mediums.create');
          $templateCache.put('modules/mediums/client/views/form-medium.client.view.html', '');

          // create mock medium
          mockMedium = new MediumsService();

          // Initialize Controller
          MediumsController = $controller('MediumsController as vm', {
            $scope: $scope,
            mediumResolve: mockMedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mediums/create');
        }));

        it('should attach an medium to the controller scope', function () {
          expect($scope.vm.medium._id).toBe(mockMedium._id);
          expect($scope.vm.medium._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mediums/client/views/form-medium.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MediumsController,
          mockMedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mediums.edit');
          $templateCache.put('modules/mediums/client/views/form-medium.client.view.html', '');

          // create mock medium
          mockMedium = new MediumsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Medium about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MediumsController = $controller('MediumsController as vm', {
            $scope: $scope,
            mediumResolve: mockMedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mediumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mediumId: 1
          })).toEqual('/mediums/1/edit');
        }));

        it('should attach an medium to the controller scope', function () {
          expect($scope.vm.medium._id).toBe(mockMedium._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mediums/client/views/form-medium.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('mediums.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('mediums/');
          $rootScope.$digest();

          expect($location.path()).toBe('/mediums');
          expect($state.current.templateUrl).toBe('modules/mediums/client/views/list-mediums.client.view.html');
        }));
      });

    });
  });
}());
