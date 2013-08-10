'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('myApp.controllers'));


  it('should ....', inject(function() {
    //spec body
  }));

  it('should ....', inject(function() {
    //spec body
  }));
});
 



describe('Products controller', function() {
  var mockProducts, ProductsCtrl, items, scope, $q, $rootScope, scope, $compile, $httpBackend, controller;

    beforeEach(module('myApp.controllers'));


    beforeEach(function(){ 
            //We laod all the module dependancies up front.
     
      //Create mocks before we define our provider values. Using jasnine spy objects allows us to
      //define mocks succinctly. Mocks the featured service
      mockProducts = jasmine.createSpyObj('mockProducts',['get']);
 
      mockProducts.get.andCallFake(function(){    
        var deferred;
        deferred = $q.defer();
        deferred.resolve(dummyProductsJson.products);
        return deferred.promise;       
      });

      module(function($provide) {
            $provide.value('products', mockProducts);
        });
   
      //Injecting all of our services in the "beforeEach" section allows us to avoid cluttering out tests.  
      inject(function($injector, $controller){
        $q = $injector.get('$q')
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        scope = $rootScope.$new();
        controller = $controller('ProductsCtrl', { $scope: scope });
      });


    });

    it('should get an array of products and add them to the scope', inject(function() {
      
      $rootScope.$digest();

      expect(typeof scope.products).toBe('object');
      expect(scope.products.length).toBeGreaterThan(0);
      
    }));


})
