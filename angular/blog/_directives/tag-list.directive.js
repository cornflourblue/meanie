(function () {
    'use strict';

    angular
        .module('app')
        .directive('tagList', Directive);

    function Directive() {
        return {
            scope: {},
            templateUrl: '/_directives/tag-list.html',
            controller: Controller,
            controllerAs: 'vm'
        }
    }

    function Controller(PostService) {
        var vm = this;

        vm.tags = [];

        initController();

        function initController() {
            PostService.GetAll()
                .then(function (posts) {
                    // get unique array of all tags
                    vm.tags = _.chain(posts)
                        .pluck('tags')
                        .flatten()
                        .uniq()
                        .sort()
                        .filter(function (el) { return el; }) // remove undefined/null values
                        .value();
                });
        }
    }
})();