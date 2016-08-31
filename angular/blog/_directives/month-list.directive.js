(function () {
    'use strict';

    angular
        .module('app')
        .directive('monthList', Directive);

    function Directive() {
        return {
            scope: {},
            templateUrl: '/_directives/month-list.html',
            controller: Controller,
            controllerAs: 'vm'
        }
    }

    function Controller($rootScope, PostService) {
        var vm = this;

        vm.years = [];

        initController();

        function initController() {
            PostService.GetAll()
                .then(function (posts) {
                    // get all publish dates
                    var dates = _.pluck(posts, 'publishDate');

                    // loop through dates and create list of unique years and months
                    _.each(dates, function (dateString) {
                        var date = new Date(dateString);

                        var year = _.findWhere(vm.years, { value: date.getFullYear() });
                        if (!year) {
                            year = { value: date.getFullYear(), months: [] };
                            vm.years.push(year);
                        }
                        
                        var month = _.findWhere(year.months, { value: ('0' + date.getMonth()).slice(-2) });
                        if (!month) {
                            month = { value: ('0' + date.getMonth()).slice(-2), name: $rootScope.monthNames[date.getMonth()] };
                            year.months.push(month);
                        }
                    });

                    // add post counts for each month
                    _.each(vm.years, function (year) {
                        _.each(year.months, function (month) {
                            month.postCount = _.filter(dates, function (dateString) {
                                var date = new Date(dateString);
                                return date.getFullYear() === year.value && ('0' + date.getMonth()).slice(-2) === month.value;
                            }).length;
                        });
                    });
                });
        }
    }
})();