!function(){
	"use strict";

	var app = angular.module("myapp", []);
    
    app.controller('myLogin', function($scope, $http) {
        
        $scope.user = function() {
          return $scope.userName + " " + $scope.userPass;
        }
        $scope.submit = function() { 
        var require = {
          method: 'POST',
          url: '/login',
          headers: {
              'Content-Type': 'application/json'
          },
          data: {username: $scope.userName, pass: $scope.userPass}
        };

        $http(require)
         .success(function(data) {
          if(data.errors) {
            console.log(data.erros);
          } else {
            $scope.message = data.message;
          }
         });
       }
    });
    
}();    