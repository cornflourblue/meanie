(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, DataService) {
        var service = new DataService('/api/users');

        service.AddMethod('GetCurrent', GetCurrent);
        service.AddMethod('Search', Search);
        
        return service;

        function GetCurrent() {
            return $http.get('/api/users/current');
        }

        function Search(query) {
            query = query || '';
            return $http.get('/api/users/search?q=' + query);
        }
    }

})();
