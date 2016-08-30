(function () {
    'use strict';

    angular
        .module('app')
        .factory('PostService', Service);

    function Service($http, $q) {
        var apiUrl = '/api/posts';
        var service = {};

        service.GetAll = GetAll;
        service.GetByUrl = GetByUrl;

        return service;

        function GetAll() {
            return $http.get(apiUrl).then(handleSuccess, handleError);
        }

        function GetByUrl(url) {
            return $http.get(apiUrl + '/' + url).then(handleSuccess, handleError);
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
