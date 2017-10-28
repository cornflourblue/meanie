(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q, DataService) {
        var service = DataService('/api/users');

        service.GetCurrent = GetCurrent;
        service.Search = Search;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function Search(query) {
            query = query || '';
            return $http.get('/api/users/search?q=' + query).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
