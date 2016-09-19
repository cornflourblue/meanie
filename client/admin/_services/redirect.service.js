(function () {
    'use strict';

    angular
        .module('app')
        .factory('RedirectService', Service);

    function Service($http, $q) {
        var apiUrl = '/api/redirects';
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Save = Save;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(apiUrl).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get(apiUrl + '/' + _id).then(handleSuccess, handleError);
        }

        function Save(redirect) {
            if (redirect._id) {
                // update
                return $http.put(apiUrl + '/' + redirect._id, redirect).then(handleSuccess, handleError);
            } else {
                // create
                return $http.post(apiUrl, redirect).then(handleSuccess, handleError);
            }
        }

        function Delete(_id) {
            return $http.delete(apiUrl + '/' + _id).then(handleSuccess, handleError);
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
