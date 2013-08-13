'use strict';

describe('Products controller', function() {
  var mockProducts, mockCart, cartDataObj,  ProductsCtrl, items, scope, $q, $rootScope, scope, $compile, $httpBackend, controller;

    beforeEach(module('myApp.controllers'));

    cartDataObj = dummyCartJson().cart;
    beforeEach(function(){ 

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

      mockCart = jasmine.createSpyObj('mockCart',['add']);

      mockCart.add.andCallFake(function(product, qty){    
        var deferred;
        deferred = $q.defer();
        product.qty = qty;
        cartDataObj.items.push(product);
        $rootScope.$broadcast('event:cartUpdated');
        deferred.resolve(cartDataObj);
        return deferred.promise;       
      });

      module(function($provide) {
        $provide.value('cart', mockCart);
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


    it('should add an item to the shopping cart', inject(function() {
      
      $rootScope.$digest();

      var cartUpdated = false;

      scope.$on('event:cartUpdated', function() { 
        cartUpdated = true;
      });

      scope.addToCart(0,3);

      $rootScope.$digest();

      expect(cartUpdated).toBe(true);
      
    }));


});



describe('Shopping cart controller', function() {
  var mockCart, CartCtrl, cartDataObj, items, scope, $q, $rootScope, scope, $compile, $httpBackend, controller;

    beforeEach(module('myApp.controllers'));

    cartDataObj = dummyCartJson().cart;

    cartDataObj.items.push({
      "name": "Eliza J Print Chiffon Halter Maxi Dress",
      "img" : "http://images2.urlstatic.com/port51/products/4/5/8/small/1119854.jpg",
      "brand": "Eliza J",
      "merchant":"Nordstrom",
      "url" : "/",
      "listPrice" : "158.00",
      "salePrice" : "0.00",
      "editorsPick" : true,
      "sale" : false,
      "qty": 1
    });

    
    cartDataObj.items.push({
      "name": "French Connection Dress, Short-Sleeve High-Neck Eyelet",
      "img" : "http://images1.urlstatic.com/port51/products/0/4/4/small/1006440.jpg",
      "brand": "French Connection",
      "merchant":"Macy's",
      "url" : "/",
      "listPrice" : "198.00",
      "salePrice" : "149.99",
      "editorsPick" : true,
      "sale" : true,
      "qty": 2
    });

    beforeEach(function(){ 

      //Create mocks before we define our provider values. Using jasnine spy objects allows us to
      //define mocks succinctly. Mocks the featured service
      mockCart = jasmine.createSpyObj('mockCart',['get', 'delete', 'updateQty', 'updateShipping']);
 
      mockCart.get.andCallFake(function(){    
        var deferred;
        deferred = $q.defer();
        deferred.resolve(cartDataObj);
        return deferred.promise;       
      });

      mockCart.delete.andCallFake(function(index){    
        
        var deferred;
        deferred = $q.defer();
        
        cartDataObj.items.splice(index, 1);

        deferred.resolve(cartDataObj);
        return deferred.promise;   

      });

      mockCart.updateQty.andCallFake(function(index, qty) {    
        
        var deferred;
        deferred = $q.defer();
        
        cartDataObj.items[index].qty = qty;

        deferred.resolve(cartDataObj);
        return deferred.promise;   
  
      });

      mockCart.updateShipping.andCallFake(function(method) {    
        
        var deferred;
        deferred = $q.defer();
        
        cartDataObj.totals.shipping = 9.95;

        deferred.resolve(cartDataObj);
        return deferred.promise;   
  
      });


      module(function($provide) {
        $provide.value('cart', mockCart);
      });
   
      //Injecting all of our services in the "beforeEach" section allows us to avoid cluttering out tests.  
      inject(function($injector, $controller){
        $q = $injector.get('$q')
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        scope = $rootScope.$new();
        controller = $controller('CartCtrl', { $scope: scope });
      });


    });

    it('should retrieve the cart data object and add it to the scope', inject(function() {
      
      $rootScope.$digest();

      expect(typeof scope.cart).toBe('object');
      expect(scope.cart.items).toBeDefined();
      expect(scope.cart.shippingmethods).toBeDefined();
      expect(scope.cart.totals).toBeDefined();

    }));

    it('should update qty cart data object and update the scope', inject(function() {
      
      $rootScope.$digest();

      scope.updateQty(0, { 'name': '4', 'value': 4 });

      expect(typeof scope.cart).toBe('object');
      expect(scope.cart.items[0].qty).toBe(4);
   
    }));

    it('should delete item when delete button is clicked', inject(function() {
      
      $rootScope.$digest();

      scope.delete(1);

      expect(typeof scope.cart).toBe('object');
      expect(scope.cart.items.length).toBe(1);
   
    }));

    it('should update the scope with the shipping options', inject(function() {
      
      $rootScope.$digest();

      expect(typeof scope.cart).toBe('object');
      expect(scope.cart.shippingmethods).toBeDefined();
   
    }));

    it('should update the scope with the shipping total', inject(function() {
      
      $rootScope.$digest();

      scope.shipping = 'Ground Shipping';
      scope.$apply();
      expect(scope.cart.totals.shipping).toBe(9.95);
   
    }));


});
