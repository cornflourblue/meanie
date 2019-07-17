(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.AddEditController', Controller);

    function Controller($stateParams, $location, PostService, AlertService) {
        var vm = this;

        vm.post = {};
        vm.savePost = savePost;
        vm.deletePost = deletePost;

        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                PostService.GetById($stateParams._id)
                    .then(function (post) {
                        vm.loading -= 1;
                        vm.post = post;
                    });
            } else {
                // initialise with defaults
                vm.post = {
                    publishDate: moment().format('YYYY-MM-DD'),
                    publish: true
                };
            }
        }

        function savePost() {
            PostService.Save(vm.post)
                .then(function () {
                    AlertService.Success('Post saved', true);
                    $location.path('/posts');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }

        function deletePost() {
            PostService.Delete(vm.post._id)
                .then(function () {
                    AlertService.Success('Post deleted', true);
                    $location.path('/posts');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
        }
    }

})();