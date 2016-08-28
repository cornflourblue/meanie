(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(PostService) {
        var vm = this;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PostService.GetAll()
            .then(function (posts) {
                vm.loading -= 1;
                vm.posts = posts;
            });
        }
    }

})();