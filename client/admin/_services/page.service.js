(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageService', Service);

    function Service(DataService) {
        var service = DataService('/api/pages');
        return service;
    }
})();
