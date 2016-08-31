(function () {
    'use strict';

    angular
        .module('app')
        .filter('csv', Filter);

    function Filter() {
        return function (array) {
            if (!array)
                return;

            return array.toString().replace(/,/g, ', ');
        };
    }
})();