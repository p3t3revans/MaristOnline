'use strict';

describe('Mediums E2E Tests:', function () {
  describe('Test mediums page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mediums');
      expect(element.all(by.repeater('medium in mediums')).count()).toEqual(0);
    });
  });
});
