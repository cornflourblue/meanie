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

    function Controller() {
        var vm = this;

        initController();

        function initController() {
        }
    }
})();