(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sites.IndexController', Controller);

    function Controller(SiteService) {
        var vm = this;

        vm.sites = [];

        initController();

        function initController() {
            vm.loading = true;
            SiteService.GetAll()
                .then(function (sites) {
                    vm.loading = false;
                    vm.sites = sites;
                });
        }
    }

})();