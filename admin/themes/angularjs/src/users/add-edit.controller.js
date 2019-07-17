(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.AddEditController', Controller);

    function Controller($stateParams, $location, UserService, SiteService, AlertService) {
        var vm = this;

        vm.user = {};
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.searchSites = searchSites;
        vm.addSite = addSite;
        vm.removeSite = removeSite;
        
        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                UserService.GetById($stateParams._id)
                    .then(function (user) {
                        vm.loading -= 1;
                        vm.user = user;
                    });
            }
        }

        function saveUser() {
            UserService.Save(vm.user)
                .then(function () {
                    AlertService.Success('User saved', true);
                    $location.path('/users');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    AlertService.Success('User deleted', true);
                    $location.path('/users');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function searchSites() {
            if (!vm.siteQuery) {
                vm.sites = [];
                return;
            }

            SiteService.Search(vm.siteQuery)
                .then(function (sites) {
                    vm.sites = sites;
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function addSite(site) {
            // add user to user
            vm.user.sites = vm.user.sites || [];
            vm.user.sites.push(site);

            // reset search
            vm.siteQuery = '';
            vm.sites = [];
        }

        function removeSite(site) {
            vm.user.sites = vm.user.sites.filter(x => x._id !== site._id);
        }
    }

})();