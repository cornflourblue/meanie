(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pages.AddEditController', Controller);

    function Controller($stateParams, $location, $filter, PageService, AlertService) {
        var vm = this;

        vm.page = {};
        vm.savePage = savePage;
        vm.deletePage = deletePage;

        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                PageService.GetById($stateParams._id)
                    .then(function (page) {
                        vm.loading -= 1;
                        vm.page = page;
                    });
            } else {
                // initialise with defaults
                vm.page = {
                    publish: true
                };
            }
        }

        function savePage() {
            PageService.Save(vm.page)
                .then(function () {
                    AlertService.Success('Page saved', true);
                    $location.path('/pages');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function deletePage() {
            PageService.Delete(vm.page._id)
                .then(function () {
                    AlertService.Success('Page deleted', true);
                    $location.path('/pages');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }
    }

})();