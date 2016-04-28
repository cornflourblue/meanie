(function () {
    'use strict';

    angular
        .module('app')
        .controller('Test.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        initController();

        function initController() {
        }
    }

})();