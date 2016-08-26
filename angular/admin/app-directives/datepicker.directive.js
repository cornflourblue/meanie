(function () {
    'use strict';

    angular
        .module('app')
        .directive('datepicker', Directive);

    function Directive($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                // enable jquery ui datepicker
                element.datepicker({ dateFormat: "dd/mm/yy" });

                // format date for display
                ngModel.$formatters.push(function (date) {
                    if (!date)
                        return;

                    return $filter('date')(date, 'dd/MM/yyyy');
                });

                // format date for storage
                ngModel.$parsers.push(function (date) {
                    if (!date)
                        return;

                    return moment(date, 'DD/MM/YYYY').format();
                });
            }
        };
    }
})();