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

                // convert to dd/mm/yyyy for display
                ngModel.$formatters.push(function (date) {
                    if (!date)
                        return;

                    return moment(date).format('DD/MM/YYYY');
                });

                // convert to yyyy-mm-dd for storage
                ngModel.$parsers.push(function (date) {
                    if (!date)
                        return;

                    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
                });
            }
        };
    }
})();