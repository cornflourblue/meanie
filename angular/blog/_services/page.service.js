(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageService', Service);

    function Service($http, $q) {
        var apiUrl = '/api/pages';
        var service = {};

        service.GetAll = GetAll;
        service.GetBySlug = GetBySlug;

        return service;

        function GetAll() {
            return $http.get(apiUrl).then(handleSuccess, handleError);
        }

        function GetBySlug(slug) {
            return $http.get(apiUrl + '/slug/' + slug).then(handleSuccess, handleError);
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
