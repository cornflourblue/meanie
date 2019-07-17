(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pages.IndexController', Controller);

    function Controller(PageService) {
        var vm = this;

        vm.pages = [];

        initController();

        function initController() {
            vm.loading = true;
            PageService.GetAll()
                .then(function (pages) {
                    vm.loading = false;
                    vm.pages = pages;
                });
        }
    }

})();