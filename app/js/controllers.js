'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('ProductsCtrl', ['$scope', 'products', 'cart',
  function($scope, products, cart) {

    products.get().then(function(productArr) {

      $scope.selectValues = [
        {name:'1', value:1},
        {name:'2', value:2},
        {name:'3', value:3},
        {name:'4', value:4},
        {name:'5', value:5},
        {name:'6', value:6},
        {name:'7', value:7},
        {name:'8', value:8},
        {name:'9', value:9},
        {name:'10', value:10}
      ];

      $scope.selectedQty = $scope.selectValues[0];

      $scope.products = productArr;

    });

    /**
     * Adds product to cart model.
     * @param  {Obj} product
     * @param  {Int} qty     [description]
     */
    $scope.addToCart = function(product, selectedQty) {

      cart.add(product, selectedQty.value).then(function(cartObj) {
          $scope.products = angular.copy($scope.products); 
      });

    }

  }
]).controller('CartCtrl', ['$scope', 'cart',
  function($scope, cart) {

    $scope.selectValues = [
      {name:'1', value:1},
      {name:'2', value:2},
      {name:'3', value:3},
      {name:'4', value:4},
      {name:'5', value:5},
      {name:'6', value:6},
      {name:'7', value:7},
      {name:'8', value:8},
      {name:'9', value:9},
      {name:'10', value:10}
    ];

    cart.get().then(function(cartObj) {

      $scope.cart = cartObj;

    })

    // When other modules update cart
    $scope.$on('event:cartUpdated', function() {

      cart.get().then(function(cartObj) {

        for (var x = 0; x < cartObj.items.length; x++) {
          cartObj.items[x].selectedQty = $scope.selectValues[cartObj.items[x].qty-1] ; 
        }
        console.log(cartObj);
        $scope.cart = cartObj;
      })

    })

    /**
     * Update quantity for item in model. Updates scope with new data and totals.
     * @param  {int} index 
     * @param  {int} qty Amout
     */
    $scope.updateQty = function(index, selectedQty) {

      cart.updateQty(index, selectedQty.value).then(function(cartObj) {

        $scope.cart = cartObj;

      });

    }

    /**
     * Removes item from model. Updates scope with data and totals.
     * @param  {int} index 
     */
    $scope.delete = function(index) {

      cart.delete(index).then(function(cartObj) {

        $scope.cart = cartObj;

      });

    }

    // Fires when shipping option is selected. Updates data and totals.
    $scope.$watch('shipping', function(shipping) {

      if (shipping) {
        cart.updateShipping(shipping).then(function(cartObj) {

          $scope.cart = cartObj;

        });
      }

    });


  }
]);