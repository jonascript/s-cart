'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ProductsCtrl', ['$scope', 'products', 'cart', function($scope, products, cart) {

    products.get().then(function (productArr) {

      for (var x =0; x < productArr.length; x++ ) {
        $scope.qty = 1;
      }

      $scope.products = productArr;
      
    });

    $scope.addToCart = function(index, qty) {

      cart.add($scope.products[index], qty).then(function(cartObj) { 
        $scope.products[index].qty = 1;
        $scope.products = angular.copy($scope.products);
      });

    }

  }]).controller('CartCtrl', ['$scope', 'cart',function($scope, cart) {

    cart.get().then(function (cartObj) {

      $scope.cart = cartObj;
      
    })

    // When other modules update cart
    $scope.$on('event:cartUpdated', function() {

      cart.get().then(function (cartObj) {
        $scope.cart.items = angular.copy(cartObj.items);
      
      })

    })

    $scope.updateQty = function(index, qty) {

      cart.updateQty(index, qty).then(function(cartObj) { 
        $scope.cart = cartObj;
      });

    }


    $scope.delete = function(index) {

      cart.delete(index).then(function(cartObj) { 
        $scope.cart = cartObj;
      });

    }

    $scope.$watch('shipping', function(shipping) { 

      if (shipping) {
        cart.updateShipping(shipping).then(function(cartObj) {

          $scope.cart = cartObj;

        });
      }

    });



   

  }]);