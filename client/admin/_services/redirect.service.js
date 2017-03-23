(function () {
    'use strict';

    angular
        .module('app')
        .factory('RedirectService', Service);

    function Service(DataService) {
        var service = DataService('/api/redirects');
        return service;
    }
})();
