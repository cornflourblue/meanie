(function () {
    'use strict';

    angular
        .module('app')
        .controller('Redirects.IndexController', Controller);

    function Controller(RedirectService) {
        var vm = this;

        vm.redirects = [];

        initController();

        function initController() {
            vm.loading = true;
            RedirectService.GetAll()
                .then(function (redirects) {
                    vm.loading = false;
                    vm.redirects = redirects;
                });
        }
    }

})();