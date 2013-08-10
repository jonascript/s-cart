'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('myApp.services'));

  var dummyData, pageData, configuration, scope, $q, $rootScope, $httpBackend, products;
  dummyData = dummyProductsJson;


  beforeEach(function() { 

    inject(function($injector){
      $q = $injector.get('$q')
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      products = $injector.get('products');
      //trending = $injector.get('trending');
    });


    $httpBackend.whenGET('/js/products.json').respond(dummyData);
  });

  afterEach(function(){
    //flush the data from the http call to resolve any pending promises.
    $httpBackend.flush();
  });
    

  describe('products', function() {
    it('should return an array of products', inject(function(products) {
      
      $rootScope.$digest();

      products.get().then(function(productsArr){

        expect(typeof productsArr).toBe('object');
        expect(productsArr.length).toBeGreaterThan(0);
        expect(productsArr[0].hasOwnProperty('name')).toBe(true);
        expect(productsArr[0].hasOwnProperty('img')).toBe(true);
        expect(productsArr[0].hasOwnProperty('brand')).toBe(true);
        expect(productsArr[0].hasOwnProperty('merchant')).toBe(true);
        expect(productsArr[0].hasOwnProperty('url')).toBe(true);
        expect(productsArr[0].hasOwnProperty('listPrice')).toBe(true);
        expect(productsArr[0].hasOwnProperty('salePrice')).toBe(true);
        expect(productsArr[0].hasOwnProperty('editorsPick')).toBe(true);
        expect(productsArr[0].hasOwnProperty('sale')).toBe(true);
        
      });
    }));
  });
});
 