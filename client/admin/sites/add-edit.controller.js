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
        vm.removeUser = removeUser;
        vm.addDomain = addDomain;
        vm.removeDomain = removeDomain;
        
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
            // add user to site
            vm.site.users = vm.site.users || [];
            vm.site.users.push(user);

            // reset search
            vm.userQuery = '';
            vm.users = [];
        }

        function removeUser(user) {
            vm.site.users = vm.site.users.filter(x => x._id !== user._id);
        }

        function addDomain() {
            // add domain to site
            vm.site.domains = vm.site.domains || [];
            vm.site.domains.push(vm.domain);

            // reset domain textbox
            vm.domain = '';
        }

        function removeDomain(domain) {
            vm.site.domains = vm.site.domains.filter(x => x !== domain);
        }
    }

})();