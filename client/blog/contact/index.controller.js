(function () {
    'use strict';

    angular
        .module('app')
        .controller('Contact.IndexController', Controller);

    function Controller($location, ContactService) {
        var vm = this;

        vm.submit = submit;

        initController();

        function initController() {
        };

        function submit() {
            vm.loading = true;
            ContactService.Send(vm)
                .then(function () {
                    console.log('contact success');
                })
                .catch(function (error) {
                    console.log('contact failed');
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    }

})();