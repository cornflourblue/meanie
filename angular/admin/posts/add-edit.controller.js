(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.AddEditController', Controller);

    function Controller($stateParams, PostService, FlashService) {
        var vm = this;

        vm.post = {};
        vm.savePost = savePost;
        vm.deletePost = deletePost;

        initController();

        function initController() {
            if ($stateParams._id) {
                vm.loading = true;
                PostService.GetById($stateParams._id)
                    .then(function (post) {
                        vm.loading = false;
                        vm.post = post;
                    });
            }
        }

        function savePost() {
            PostService.Save(vm.post)
                .then(function () {
                    FlashService.Success('Post saved');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deletePost() {
            PostService.Delete(vm.post._id)
                .then(function () {
                    FlashService.Success('Post deleted');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();