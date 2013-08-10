'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('ProductsCtrl', ['$scope', 'products',function($scope, products) {

    products.get().then(function (productArr) {

      $scope.products = productArr;
      
    })

  }]);