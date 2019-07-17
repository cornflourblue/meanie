(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.users = [];

        initController();

        function initController() {
            vm.loading = true;
            UserService.GetAll()
                .then(function (users) {
                    vm.loading = false;
                    vm.users = users;
                });
        }
    }

})();