(function () {
    'use strict';

    angular
        .module('app')
        .factory('SiteService', Service);

    function Service(DataService) {
        var service = DataService('/api/sites');
        return service;
    }
})();
