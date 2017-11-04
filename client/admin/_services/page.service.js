(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageService', Service);

    function Service(DataService) {
        var service = new DataService('/api/pages');
        return service;
    }
})();
