(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sites.AddEditController', Controller);

    function Controller($stateParams, $location, $filter, SiteService, UserService, AlertService) {
        var vm = this;

        vm.site = {};
        vm.saveSite = saveSite;
        vm.deleteSite = deleteSite;
        vm.searchUsers = searchUsers;
        vm.addUser = addUser;

        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                SiteService.GetById($stateParams._id)
                    .then(function (site) {
                        vm.loading -= 1;
                        vm.site = site;
                    });
            }
        }

        function saveSite() {
            SiteService.Save(vm.site)
                .then(function () {
                    AlertService.Success('Site saved', true);
                    $location.path('/sites');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function deleteSite() {
            SiteService.Delete(vm.site._id)
                .then(function () {
                    AlertService.Success('Site deleted', true);
                    $location.path('/sites');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function searchUsers() {
            if (!vm.userQuery) {
                vm.users = [];
                return;
            }

            UserService.Search(vm.userQuery)
                .then(function (users) {
                    vm.users = users;
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function addUser(user) {
            vm.site.users = vm.site.users || [];
            vm.site.users.push(user);
            vm.userQuery = '';
            vm.users = [];
        }
    }

})();