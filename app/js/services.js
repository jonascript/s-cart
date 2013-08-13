'use strict';

/* Services */


angular.module('myApp.services', []).
service('products', function($http, $q) {

  var dataDeferred = $q.defer();

  return {

    /**
     * Retrieves the products object from the server
     * @return {Obj} Object with products property.
     */
    get: function() {

      $http.get('/js/products.json', {}).
      success(function(data, status, headers, config) {

        if (data.products) {
          dataDeferred.resolve(data.products);
          dataDeferred = $q.defer(); // Resets promise obj once it resolves for future requests.
        } else {
          dataDeferred.reject('No products.');
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

}).service('cart', function($http, $q, $rootScope) {

  var dataDeferred = $q.defer(),
    cart = {}, // Data persistance model
    addToCartDeferred = $q.defer(),
    deleteDeferred = $q.defer(),
    qtyDeferred = $q.defer(),
    shippingDeferred = $q.defer();

  /**
   * Caclulates totals from cart object.
   */
  function calcTotals() {

    var taxRate = 0.085;

    // Reset totals to recalculate.
    cart.totals.qty = 0;
    cart.totals.price = 0;
    cart.totals.tax = 0;
    cart.totals.subtotal = 0;
    cart.totals.total = 0;

    if (cart.items.length) {
      for (var x = 0; x < cart.items.length; x++) {

        cart.totals.qty += cart.items[x].qty;

        if (cart.items[x].sale) {
          cart.totals.price += cart.items[x].qty * cart.items[x].salePrice;
        } else {
          cart.totals.price += cart.items[x].qty * cart.items[x].listPrice;
        }

      }

      if (cart.shipping == 'Ground Shipping' && cart.totals.price > 500) {
        cart.totals.shipping = 0;
      } else if (cart.shipping) {
        cart.totals.shipping = cart.shippingmethods[cart.shipping].price;
      }

      cart.totals.subtotal = Math.round((cart.totals.price + cart.totals.shipping) * 100) / 100;

      cart.totals.tax = Math.round((cart.totals.price * taxRate) * 100) / 100;

      cart.totals.total = Math.round((cart.totals.subtotal + cart.totals.tax) * 100) / 100;

    } else {
      cart.totals.shipping = 0;
      cart.totals.price = 0;
    }

  }

  return {

    /**
     * Retrieves the cart object from the server
     * @return {Obj} Object with properties, totals, items and shippingmethods.
     */
    get: function() {

      // If the cart data has already been retrieved from the server, use the local stored object.
      if (cart.items) {

        dataDeferred.resolve(cart);

      } else {

        $http.get('/js/cart.json', {}).
        success(function(data, status, headers, config) {

          if (data.cart) {
            cart = data.cart;
            dataDeferred.resolve(cart);
            dataDeferred = $q.defer(); // Resets promise obj once it resolves for future requests.
          } else {
            dataDeferred.reject('No cart.');
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
      }

      return dataDeferred.promise;

    },

    /**
     * Adds product object to cart model object.
     * @param {Obj} product object
     * @param {int} qty Count of item.
     * @return {Promise Obj} Promise object that resolves to the new cart data.
     */
    add: function(product, qty) {

      // For if addToCart is called before get() so it retrieves the data and stores it in the cart obj.
      this.get().then(function(cartData) {

        for (var x = 0; x < cart.items.length; x++) {

          if (cart.items[x].name == product.name) {

            cart.items[x].qty += qty;

            if (cart.items[x].qty > 10) {
              cart.items[x].qty = 10;
              calcTotals();

            } else {
              calcTotals();
            }

            $rootScope.$broadcast('event:cartUpdated');
            addToCartDeferred.resolve(cart);
            addToCartDeferred = $q.defer();
            return;
          }

        }

        product.qty = qty;
        cart.items.push(product);
        calcTotals();

        $rootScope.$broadcast('event:cartUpdated');
        addToCartDeferred.resolve(cart);
        addToCartDeferred = $q.defer();

      });

      return addToCartDeferred.promise;

    },

    /**
     * Deletes item at specified index from cart.items and recalculates totals.
     * @param  {int} index
     * @return {promise} Promise object that resolves with the cart object if successful.
     */
    delete: function(index) {

      this.get().then(function(cartData) {

        if (cart.items.length > index) {

          cart.items.splice(index, 1);
          calcTotals();
          deleteDeferred.resolve(cart);

        } else {
          deleteDeferred.reject('Item does not exist');
        }

        deleteDeferred = $q.defer();

      });

      return deleteDeferred.promise;

    },

    /**
     * Updates the quantity of the item at the specified index. Recalculates totals.
     * @param  {int} index
     */
    updateQty: function(index, qty) {

      this.get().then(function(cartData) {

        if (cart.items.length > index) {
          cart.items[index].qty = qty;
          calcTotals();
          qtyDeferred.resolve(cart);
        } else {
          qtyDeferred.reject('Item does not exist');
        }

        qtyDeferred = $q.defer();

      });

      return qtyDeferred.promise;

    },

    /**
     * Updates the shipping to the specified method. Recalculates totals.
     * @param  {string} method - The property of the shippingoptions object to be chosen.
     * @return {promise} Promise object that resolves with the cart object if successful.
     */
    updateShipping: function(method) {

      this.get().then(function(cartData) {

        if (cart.items.length > 0) {

          if (cart.shippingmethods[method]) {

            cart.shipping = method;
            calcTotals();

            shippingDeferred.resolve(cart);

          } else {
            shippingDeferred.reject('Shipping method invalid');
          }


        } else {
          shippingDeferred.reject('No items');
        }

        shippingDeferred = $q.defer();

      });

      return shippingDeferred.promise;

    }

  }

});