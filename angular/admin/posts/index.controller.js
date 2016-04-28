(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.IndexController', Controller);

    function Controller(PostService) {
        var vm = this;

        vm.posts = [];

        initController();

        function initController() {
        }
    }

})();