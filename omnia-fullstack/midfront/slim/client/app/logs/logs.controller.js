(function () {
    'use strict';

    angular.module('app.logs')
        .service('usersGet', ['$http', function($http) {
            this.get = function() {
                return $http.get("http://localhost:3003/getUsers")
                    .then(function(response) {
                        var info = response.data;
                        return info;
                    });
            }
        }])
    .controller('get', ['$scope', 'usersGet', get]);

    function get($scope, usersGet) {

        var init;    


        init = function() {

            usersGet.get().then(function(info) {
                
                console.log(info);
                
             });
        };        
        init();
    } 


})(); 