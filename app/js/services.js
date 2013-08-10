'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  service('products', function($http, $q) {

    var dataDeferred = $q.defer();

    return {

        get: function() {
        
            $http.get('/js/products.json', {}).
            success(function(data, status, headers, config) {
                
                if (data.products) { 
                    dataDeferred.resolve(data.products);
                    dataDeferred = $q.defer(); // Resets promise obj once it resolves for future requests.
                } else {
                    dataDeferred.reject('No products');
                }
            }).
            error(function(data, status, headers, config) {

                if (status == 404) { // Data not found for this ajax request
                    dataDeferred.reject(status);
                } else { // Internal server error
                    dataDeferred.reject(status);
                }
                
                dataDeferred = $q.defer();
                
            });

            return dataDeferred.promise;

        }
    }

});

