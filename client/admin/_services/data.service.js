(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataService', Service);

    // generic data service to be used as base for other entity services
    function Service($http, $q) {
        return function (endPoint) {
            this.GetAll = GetAll;
            this.GetById = GetById;
            this.Save = Save;
            this.Delete = Delete;
            this.AddMethod = AddMethod;

            function GetAll() {
                return $http.get(endPoint).then(handleSuccess, handleError);
            }

            function GetById(id) {
                return $http.get(endPoint + '/' + id).then(handleSuccess, handleError);
            }

            function Save(entity) {
                if (entity._id) {
                    // update
                    return $http.put(endPoint + '/' + entity._id, entity).then(handleSuccess, handleError);
                } else {
                    // create
                    return $http.post(endPoint, entity).then(handleSuccess, handleError);
                }
            }

            function Delete(id) {
                return $http.delete(endPoint + '/' + id).then(handleSuccess, handleError);
            }

            function AddMethod(name, fn) {
                this[name] = function () {
                    return fn.apply(this, arguments).then(handleSuccess, handleError);
                };
            }
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            var error = res.data && res.data.Message
                ? res.data.Message
                : res.data
            return $q.reject(error);
        }
    }
})();
