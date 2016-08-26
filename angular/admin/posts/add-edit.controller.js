(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.AddEditController', Controller);

    function Controller($stateParams, $location, PostService, AlertService, UserService) {
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

                        if (vm.post.authorId) {
                            vm.loading += 1;
                            // get author for display
                            UserService.GetById(vm.post.authorId)
                                .then(function (user) {
                                    console.log('user', user);
                                    vm.loading -= 1;
                                    vm.author = user;
                                });
                        }
                    });
            } else {
                // initialise with defaults
                vm.post = {
                    publishDate: moment().format(),
                    publish: true
                };

                // set author as current user
                vm.loading += 1;
                UserService.GetCurrent().then(function (user) {
                    vm.loading -= 1;
                    vm.author = user;
                    vm.post.authorId = vm.author._id;
                });
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