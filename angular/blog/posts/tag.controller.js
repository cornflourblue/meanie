(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.TagController', Controller);

    function Controller($rootScope, $filter, $stateParams, PostService) {
        var vm = this;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PostService.GetAll()
                .then(function (posts) {
                    vm.loading -= 1;

                    // filter to posts with specified tag
                    vm.posts = _.filter(posts, function (post) {
                        if (!post.tags)
                            return false;

                        // loop through tags to find a match
                        var tagFound = false;
                        _.each(post.tags, function (tag) {
                            var tagSlug = $filter('slugify')(tag);
                            if (tagSlug === $stateParams.tag) {
                                // set vm.tag and title here to get the un-slugified version for display
                                vm.tag = tag;
                                $rootScope.title = 'Posts tagged: ' + vm.tag;
                                tagFound = true;
                            }
                        });

                        return tagFound;
                    });

                    // add urls to post objects for links in the view
                    angular.forEach(vm.posts, function (post) {
                        post.url = '/post/' + $filter('date')(post.publishDate, 'yyyy/MM/dd') + '/' + post.slug;
                    });
                });
        }
    }

})();