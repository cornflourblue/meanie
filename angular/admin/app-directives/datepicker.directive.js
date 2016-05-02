(function () {
    'use strict';

    angular
        .module('app')
        .directive('datepicker', Directive);

    function Directive() {
        return {
            link: function (scope, element, attr) {
                // enable jquery ui datepicker
                element.datepicker();
            }
        };
    }
})();