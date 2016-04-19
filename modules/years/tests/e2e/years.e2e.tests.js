'use strict';

describe('Years E2E Tests:', function () {
  describe('Test years page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/years');
      expect(element.all(by.repeater('year in years')).count()).toEqual(0);
    });
  });
});
