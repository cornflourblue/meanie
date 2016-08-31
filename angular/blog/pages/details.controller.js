(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pages.DetailsController', Controller);

    function Controller($rootScope, $stateParams, $sce, PageService) {
        var vm = this;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PageService.GetBySlug($stateParams.slug)
                .then(function (page) {
                    vm.loading -= 1;
                    vm.page = page;

                    $rootScope.title = vm.page.title;

                    // enable html binding
                    vm.page.body = $sce.trustAsHtml(vm.page.body);
                });
        }
    }

})();