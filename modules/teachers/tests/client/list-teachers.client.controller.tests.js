(function () {
  'use strict';

  describe('Teachers List Controller Tests', function () {
    // Initialize global variables
    var TeachersListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TeachersService,
      mockTeacher;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TeachersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TeachersService = _TeachersService_;

      // create mock teacher
      mockTeacher = new TeachersService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Teacher about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Teachers List controller.
      TeachersListController = $controller('TeachersListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTeacherList;

      beforeEach(function () {
        mockTeacherList = [mockTeacher, mockTeacher];
      });

      it('should send a GET request and return all teachers', inject(function (TeachersService) {
        // Set POST response
        $httpBackend.expectGET('api/teachers').respond(mockTeacherList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.teachers.length).toEqual(2);
        expect($scope.vm.teachers[0]).toEqual(mockTeacher);
        expect($scope.vm.teachers[1]).toEqual(mockTeacher);

      }));
    });
  });
}());
