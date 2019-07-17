(function () {
    'use strict';

    angular
        .module('app')
        .factory('SiteService', Service);

    function Service($http, DataService) {
        var service = new DataService('/api/sites');

        service.AddMethod('Search', Search);

        return service;

        function Search(query) {
            query = query || '';
            return $http.get('/api/sites/search?q=' + query);
        }
    }
})();
