(function () {
    'use strict';

    angular
        .module('app')
        .controller('Posts.DetailsController', Controller);

    function Controller($stateParams, $sce, PostService) {
        var vm = this;

        initController();

        function initController() {
            vm.loading = 0;

            vm.loading += 1;
            PostService.GetByUrl($stateParams.year + '/' + $stateParams.month + '/' + $stateParams.day + '/' + $stateParams.slug)
                .then(function (post) {
                    vm.loading -= 1;
                    vm.post = post;

                    // enable html binding
                    vm.post.body = $sce.trustAsHtml(vm.post.body);
                });
        }
    }

})();