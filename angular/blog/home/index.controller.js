(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($filter, PostService) {
        var vm = this;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PostService.GetAll()
                .then(function (posts) {
                    vm.loading -= 1;
                    vm.posts = posts;

                    // add urls to post objects for links in the view
                    angular.forEach(vm.posts, function (post) {
                        post.url = '/posts/' + $filter('date')(post.publishDate, 'yyyy/MM/dd') + '/' + post.slug;
                    });
                });
        }
    }

})();