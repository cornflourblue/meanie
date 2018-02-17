(function () {
    'use strict';

    angular
        .module('app')
        .controller('Redirects.AddEditController', Controller);

    function Controller($stateParams, $location, $filter, RedirectService, AlertService) {
        var vm = this;

        vm.redirect = {};
        vm.saveRedirect = saveRedirect;
        vm.deleteRedirect = deleteRedirect;

        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                RedirectService.GetById($stateParams._id)
                    .then(function (redirect) {
                        vm.loading -= 1;
                        vm.redirect = redirect;
                    });
            }
        }

        function saveRedirect() {
            RedirectService.Save(vm.redirect)
                .then(function () {
                    AlertService.Success('Redirect saved', true);
                    $location.path('/redirects');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function deleteRedirect() {
            RedirectService.Delete(vm.redirect._id)
                .then(function () {
                    AlertService.Success('Redirect deleted', true);
                    $location.path('/redirects');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }
    }

})();