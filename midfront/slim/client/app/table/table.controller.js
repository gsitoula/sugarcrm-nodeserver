(function () {
    'use strict';

    angular.module('app.table')
    	.service('dataService', ['$http', function($http) {
    		this.get = function() {
    			return $http.get("http://localhost:3003/entryList_page1")
    				.then(function(response) {
    					var info = response.data;
    					return info;
    				});
    		}
    	}])        
        .controller('tableCtrl', ['$scope', '$filter', 'dataService', tableCtrl])
        .controller('abmCtrl', ['$scope', 'dataService', abmCtrl]);

    function abmCtrl($scope, dataService) {
        
        var init;    

        $scope.accounts = [];

        init = function() {
            dataService.get().then(function(info) {
                //info.entry_list.length
                console.log(info.entry_list[0].name_value_list.name.value);
                var inf = info.entry_list.reverse();
                console.log(inf[0].name_value_list.name.value);
             for(var i = 0; i <= 9; i++){
                $scope.accounts.push(inf[i]); 
             }
             return $scope.accounts;
             });
        };        
        init();
    }

    function tableCtrl($scope, $filter, dataService) {
        
        var init;

        $scope.stores = [];

        $scope.searchKeywords = '';

        $scope.filteredStores = [];

        $scope.row = '';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.stores, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.stores, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [10, 25, 50];

        $scope.numPerPage = $scope.numPerPageOpt[1];

        $scope.currentPage = 100;

        $scope.currentPageStores = [];

        init = function() {

        	dataService.get().then(function(info) {
                //info.entry_list.length
             for(var i = 0; i<= 19; ++i){
        	 	$scope.stores.push(info.entry_list[i]);	
        	 }
        	 return $scope.stores;
        	 });

            $scope.search();
            return $scope.select($scope.currentPage);
        };        
        init();
    }
})(); 