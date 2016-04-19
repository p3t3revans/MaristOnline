(function () {
  'use strict';

  describe('Years Route Tests', function () {
    // Initialize global variables
    var $scope,
      YearsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _YearsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      YearsService = _YearsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('years');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/years');
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
          liststate = $state.get('years.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/years/client/views/list-years.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          YearsController,
          mockYear;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('years.view');
          $templateCache.put('modules/years/client/views/view-year.client.view.html', '');

          // create mock year
          mockYear = new YearsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Year about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          YearsController = $controller('YearsController as vm', {
            $scope: $scope,
            yearResolve: mockYear
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:yearId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.yearResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            yearId: 1
          })).toEqual('/years/1');
        }));

        it('should attach an year to the controller scope', function () {
          expect($scope.vm.year._id).toBe(mockYear._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/years/client/views/view-year.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          YearsController,
          mockYear;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('years.create');
          $templateCache.put('modules/years/client/views/form-year.client.view.html', '');

          // create mock year
          mockYear = new YearsService();

          // Initialize Controller
          YearsController = $controller('YearsController as vm', {
            $scope: $scope,
            yearResolve: mockYear
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.yearResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/years/create');
        }));

        it('should attach an year to the controller scope', function () {
          expect($scope.vm.year._id).toBe(mockYear._id);
          expect($scope.vm.year._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/years/client/views/form-year.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          YearsController,
          mockYear;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('years.edit');
          $templateCache.put('modules/years/client/views/form-year.client.view.html', '');

          // create mock year
          mockYear = new YearsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Year about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          YearsController = $controller('YearsController as vm', {
            $scope: $scope,
            yearResolve: mockYear
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:yearId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.yearResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            yearId: 1
          })).toEqual('/years/1/edit');
        }));

        it('should attach an year to the controller scope', function () {
          expect($scope.vm.year._id).toBe(mockYear._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/years/client/views/form-year.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('years.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('years/');
          $rootScope.$digest();

          expect($location.path()).toBe('/years');
          expect($state.current.templateUrl).toBe('modules/years/client/views/list-years.client.view.html');
        }));
      });

    });
  });
}());
