(function () {
    'use strict';

    angular
        .module('app')
        .factory('ContactService', Service);

    function Service($http, $q) {
        var service = {};

        service.Send = Send;

        return service;

        function Send(form) {
            return $http.post('/api/contact', form).then(handleSuccess, handleError);
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
