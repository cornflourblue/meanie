(function () {
    'use strict';

    angular
        .module('app')
        .directive('datepicker', Directive);

    function Directive($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                // add class for custom styling
                element.addClass('datepicker');

                // enable jquery ui datepicker
                element.datepicker({ dateFormat: "dd/mm/yy" });

                // convert utc date to local for display
                ngModel.$formatters.push(function (utcDate) {
                    if (!utcDate)
                        return;

                    return $filter('date')(utcDate, 'dd/MM/yyyy');
                });

                // convert local date to utc for storage
                ngModel.$parsers.push(function (localDate) {
                    if (!localDate)
                        return;

                    return moment(localDate, 'DD/MM/YYYY').utc().toISOString();
                });
            }
        };
    }
})();