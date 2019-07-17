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
            vm.loading = true;
            PostService.GetAll()
                .then(function (posts) {
                    vm.loading = false;
                    vm.posts = posts;
                });
        }
    }

})();