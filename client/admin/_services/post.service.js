(function () {
    'use strict';

    angular
        .module('app')
        .factory('PostService', Service);

    function Service(DataService) {
        var service = DataService('/api/posts');
        return service;
    }
})();
