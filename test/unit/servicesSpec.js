'use strict';

/* jasmine specs for services go here */

describe('Products service', function() {
  beforeEach(module('myApp.services'));

  var dummyData, scope, $q, $rootScope, $httpBackend, products;
  
  beforeEach(function() { 

     dummyData = dummyProductsJson;

    inject(function($injector){
      $q = $injector.get('$q')
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      products = $injector.get('products');
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
 


describe('Cart service', function() {
  beforeEach(module('myApp.services'));

  var dummyData, scope, $q, $rootScope, $httpBackend, cart;
 
  beforeEach(function() { 

    dummyData = dummyCartJson();

    inject(function($injector){
      $q = $injector.get('$q')
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      cart = $injector.get('cart');
      //trending = $injector.get('trending');
    });


    $httpBackend.whenGET('/js/cart.json').respond(dummyData);
  });

  afterEach(function(){
      
  });
    

  describe('get', function() {
    it('should return an object with totals, items and shippingmethods properties', inject(function(products) {
      
      $rootScope.$digest();

      cart.get().then(function(cartObj){

        expect(typeof cartObj).toBe('object');
        expect(cartObj.hasOwnProperty('totals')).toBe(true);
        expect(cartObj.hasOwnProperty('items')).toBe(true);
        expect(cartObj.hasOwnProperty('shippingmethods')).toBe(true);

      });

      $httpBackend.flush();

    }));


  });
 
  describe('add', function() {
    it('should add item to the cart with correct quantity and update totals', inject(function(products) {
      
      $rootScope.$digest();

      var item = {
        "name": "Alice + Olivia Maxi Dress - Genie Sweetheart Cutout",
        "img" : "http://images2.urlstatic.com/port51/products/4/4/2/small/1341244.jpg",
        "brand": "Alice + Olivia",
        "merchant":"Bloomingdales",
        "url" : "/",
        "listPrice" : "698.00",
        "salePrice" : "488.60",
        "editorsPick" : false,
        "sale" : true
      };

      cart.add(item, 2).then(function(cartObj) { 

        expect(typeof cartObj).toBe('object');
        expect(cartObj.hasOwnProperty('totals')).toBe(true);
        expect(cartObj.hasOwnProperty('items')).toBe(true);
        expect(cartObj.items.length).toBe(1);
        expect(cartObj.items[0].qty).toBe(2);
        expect(cartObj.hasOwnProperty('shippingmethods')).toBe(true);

        cart.add(item, 2).then(function(cartObj) { 

          expect(typeof cartObj).toBe('object');
          expect(cartObj.hasOwnProperty('totals')).toBe(true);
          expect(cartObj.hasOwnProperty('items')).toBe(true);
          expect(cartObj.items.length).toBe(1);
          expect(cartObj.items[0].qty).toBe(4);
          expect(cartObj.hasOwnProperty('shippingmethods')).toBe(true);

          var anotherItem = {
            "name": "Eliza J Print Chiffon Halter Maxi Dress",
            "img" : "http://images2.urlstatic.com/port51/products/4/5/8/small/1119854.jpg",
            "brand": "Eliza J",
            "merchant":"Nordstrom",
            "url" : "/",
            "listPrice" : "158.00",
            "salePrice" : "0.00",
            "editorsPick" : true,
            "sale" : false
          };

          cart.add(anotherItem, 5).then(function(cartObj) { 

            expect(typeof cartObj).toBe('object');
            expect(cartObj.items.length).toBe(2);
            expect(cartObj.items[1].qty).toBe(5);
            expect(cartObj.totals.qty).toBe(9);
          

          }); 

          cart.get().then(function(cartObj){

            expect(typeof cartObj).toBe('object');
            expect(cartObj.hasOwnProperty('totals')).toBe(true);
            expect(cartObj.hasOwnProperty('items')).toBe(true);
            expect(cartObj.items.length).toBe(2);
            expect(cartObj.items[0].qty).toBe(4);
            expect(cartObj.hasOwnProperty('shippingmethods')).toBe(true);

          });

        }); 

      });

       $httpBackend.flush();

    }));
   
  });


describe('delete', function() {
  
  it('should delete item from cart and update totals.', inject(function(cart) {

    var item = {
      "name": "Alice + Olivia Maxi Dress - Genie Sweetheart Cutout",
      "img" : "http://images2.urlstatic.com/port51/products/4/4/2/small/1341244.jpg",
      "brand": "Alice + Olivia",
      "merchant":"Bloomingdales",
      "url" : "/",
      "listPrice" : "698.00",
      "salePrice" : "488.60",
      "editorsPick" : false,
      "sale" : true
    };

    cart.get().then(function(cartObj) { 

      expect(cartObj.items.length).toBe(0);

      cart.add(item, 2).then(function(cartObj) { 

        expect(cartObj.items.length).toBe(1);
        expect(cartObj.totals.qty).toBe(2);
        expect(cartObj.totals.price).toBe(2 * item.salePrice);

        cart.delete(0).then(function(cartObj) { 
   
          expect(cartObj.items.length).toBe(0);
          expect(cartObj.totals.qty).toBe(0);
          expect(cartObj.totals.price).toBe(0);

          cart.delete(1).then(function(cartObj) { 

          }, function (reason) {

            expect(reason).toBe('Item does not exist');

          });

        });

      });

    });
    
    $httpBackend.flush();

  }));

});


describe('updateQty', function() {
  
  it('should update quantity of item', inject(function() {

    var item = {
      "name": "Alice + Olivia Maxi Dress - Genie Sweetheart Cutout",
      "img" : "http://images2.urlstatic.com/port51/products/4/4/2/small/1341244.jpg",
      "brand": "Alice + Olivia",
      "merchant":"Bloomingdales",
      "url" : "/",
      "listPrice" : "698.00",
      "salePrice" : "488.60",
      "editorsPick" : false,
      "sale" : true
    };

    cart.add(item, 2).then(function(cartObj) { 

      cart.updateQty(0, 3).then(function(cartObj) { 
 
        expect(cartObj.items[0].qty).toBe(3);
        expect(cartObj.totals.qty).toBe(3);
        expect(cartObj.totals.price).toBe(3 * item.salePrice);
        expect(cartObj.totals.tax).toBe(124.59);

        cart.updateQty(0, 5).then(function(cartObj) { 
 
          expect(cartObj.items[0].qty).toBe(5);
          expect(cartObj.totals.qty).toBe(5);
          expect(cartObj.totals.price).toBe(5 * item.salePrice);

          cart.updateQty(0, 0).then(function(cartObj) { 
 
            expect(cartObj.items[0].qty).toBe(0);
            expect(cartObj.totals.qty).toBe(0);
            expect(cartObj.totals.price).toBe(0);

          });

        });

      }, function (reason) {

        expect(reason).not.toBe('Item does not exist');

      });

     
    }); 

    $httpBackend.flush();
    
  }));

});



describe('updateShipping', function() {
   var item;
  beforeEach(function() { 
    item = {
      "name": "Alice + Olivia Maxi Dress - Genie Sweetheart Cutout",
      "img" : "http://images2.urlstatic.com/port51/products/4/4/2/small/1341244.jpg",
      "brand": "Alice + Olivia",
      "merchant":"Bloomingdales",
      "url" : "/",
      "listPrice" : "698.00",
      "salePrice" : "488.60",
      "editorsPick" : false,
      "sale" : true
    };

  });
  
  it('should update shipping cost', inject(function() {

    cart.add(item, 1).then(function(cartObj) { 

      cart.updateShipping('Ground Shipping').then(function(cartObj) { 
  
        expect(cartObj.totals.shipping).toBe(9.95);
        expect(cartObj.totals.subtotal).toBe(498.55);

      }, function (reason) {

        expect(reason).not.toBe('No items');

      });
     
    }); 

    $httpBackend.flush();
    
  }));

  it('should set Ground Shipping price to $0 if total price is over $500', inject(function() {

    cart.add(item, 2).then(function(cartObj) { 

      cart.updateShipping('Ground Shipping').then(function(cartObj) { 

        expect(cartObj.totals.subtotal).toBe(977.2);
        expect(cartObj.totals.shipping).toBe(0);

      }, function (reason) {

        expect(reason).not.toBe('No items');

      });
     
    }); 

    $httpBackend.flush();
    
  }));

});

});
 