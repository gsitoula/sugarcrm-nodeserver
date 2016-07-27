(function () {
    'use strict';

    angular.module('app.settings')
    	.service('configSet', ['$http', function($http) {
            this.post = function(info){
                var require = {
                    method: 'POST',
                    url: 'http://127.0.0.1:3003/setConfig',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: info//{username: "admin", pass: "Sugaradm2016"}
                    };
                    $http(require)
                        .success(function(data){
                            console.log(data);
                        })
                        .error(function(data){
                            console.log(data);
                        });  
                }
        }])
        .controller('confSet', ['$scope', 'configSet', confSet]);
        
    function confSet($scope, configSet) {
        
        $scope.submit = function() {

            var info = {
                username: $scope.userName, 
                password: $scope.userPass,
                hostId  : $scope.hostId,
                database: $scope.dataBase
            };
            
            configSet.post(info);
       //  var require = {
       //    method: 'POST',
       //    url: 'http://127.0.0.1:3003/login',
       //    headers: {
       //        'Content-Type': 'application/json'
       //    },
       //    data: {username: $scope.userName, pass: $scope.userPass}
         };

       //  $http(require)
       //   .success(function(data) {
       //    if(data.errors) {
       //      console.log(data.erros);
       //    } else {
       //      $scope.message = data.message;
       //    }
       //   });
    }
      
     

})(); 