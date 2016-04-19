(function () {
  'use strict';

  describe('Subjects Controller Tests', function () {
    // Initialize global variables
    var SubjectsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SubjectsService,
      mockSubject;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SubjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SubjectsService = _SubjectsService_;

      // create mock subject
      mockSubject = new SubjectsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Subject about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Subjects controller.
      SubjectsController = $controller('SubjectsController as vm', {
        $scope: $scope,
        subjectResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSubjectPostData;

      beforeEach(function () {
        // Create a sample subject object
        sampleSubjectPostData = new SubjectsService({
          title: 'An Subject about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.subject = sampleSubjectPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SubjectsService) {
        // Set POST response
        $httpBackend.expectPOST('api/subjects', sampleSubjectPostData).respond(mockSubject);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the subject was created
        expect($state.go).toHaveBeenCalledWith('subjects.view', {
          subjectId: mockSubject._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/subjects', sampleSubjectPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock subject in $scope
        $scope.vm.subject = mockSubject;
      });

      it('should update a valid subject', inject(function (SubjectsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/subjects\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('subjects.view', {
          subjectId: mockSubject._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SubjectsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup subjects
        $scope.vm.subject = mockSubject;
      });

      it('should delete the subject and redirect to subjects', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('subjects.list');
      });

      it('should should not delete the subject and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
