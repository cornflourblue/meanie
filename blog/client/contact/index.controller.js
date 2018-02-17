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
            vm.error = null;
            vm.loading = true;
            ContactService.Send(vm)
                .then(function () {
                    $location.path('/contact-thanks');
                })
                .catch(function (error) {
                    vm.error = 'Error: ' + error;
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    }

})();