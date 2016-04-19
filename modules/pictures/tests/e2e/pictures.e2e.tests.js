'use strict';

describe('Pictures E2E Tests:', function () {
  describe('Test pictures page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pictures');
      expect(element.all(by.repeater('picture in pictures')).count()).toEqual(0);
    });
  });
});
