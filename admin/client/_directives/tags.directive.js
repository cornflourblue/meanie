(function () {
    'use strict';

    angular
        .module('app')
        .directive('tags', Directive);

    function Directive($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                // convert to comma separated string for display
                ngModel.$formatters.push(function (tags) {
                    return $filter('csv')(tags);
                });

                // convert to array for storage
                ngModel.$parsers.push(function (tagsString) {
                    var tags = _.map(tagsString.split(','), function (tag) {
                        // trim any extra spaces
                        return tag.trim();
                    });

                    // remove any empty tags
                    tags = _.filter(tags, function (tag) { return tag; });

                    return tags;
                });
            }
        };
    }
})();