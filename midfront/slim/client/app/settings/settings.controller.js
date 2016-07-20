(function () {
    'use strict';

    angular.module('app.settings', ["ngAnimate"])
    	.service('dataService', ['$http', function($http) {
    		
            this.get = function() {
    			return $http.get("http://localhost:3003/entryList_page1")
    				.then(function(response) {
    					var info = response.data;
    					return info;
    				});
    		};

    	}])
        .controller('abmCtrl', ['$scope', 'dataService', abmCtrl]);
        
    function abmCtrl($scope, dataService) {
        
        var init;

        $scope.accounts = [];

        $scope.editAccount = function() {
            prompt("Account Edition");
        }

        $scope.deleteAccount = function() {
            prompt("Are you sure you want to delete this Account?");
        }

        init = function() {
            dataService.get().then(function(info) {
                //info.entry_list.length                
                var inf = info.entry_list.reverse();
             for(var i = 0; i <= 9; i++){
                $scope.accounts.push(inf[i]); 
             }
             return $scope.accounts;
             });
        };        
        init();
    }

})(); 