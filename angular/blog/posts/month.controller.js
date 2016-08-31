(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.MonthController', Controller);

    function Controller($rootScope, $filter, $stateParams, PostService) {
        var vm = this;

        vm.year = $stateParams.year;
        vm.monthName = $rootScope.monthNames[parseInt($stateParams.month)];

        $rootScope.title = 'Posts for ' + vm.monthName + ' ' + vm.year;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PostService.GetAll()
                .then(function (posts) {
                    vm.loading -= 1;
                    vm.posts = _.filter(posts, function (post) {
                        var publishDate = new Date(post.publishDate);
                        return publishDate.getFullYear() === parseInt($stateParams.year) && publishDate.getMonth() === parseInt($stateParams.month);
                    });

                    // add urls to post objects for links in the view
                    angular.forEach(vm.posts, function (post) {
                        post.url = '/post/' + $filter('date')(post.publishDate, 'yyyy/MM/dd') + '/' + post.slug;
                    });
                });
        }
    }

})();