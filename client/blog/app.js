(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMessages'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/'
            })
            .state('post-details', {
                url: '/post/:year/:month/:day/:slug',
                templateUrl: function (stateParams) {
                    return '/post/' + stateParams.year + '/' + stateParams.month + '/' + stateParams.day + '/' + stateParams.slug;
                }
            })
            .state('posts-for-tag', {
                url: '/posts/tag/:tag',
                templateUrl: function (stateParams) {
                    return '/posts/tag/' + stateParams.tag;
                }
            })
            .state('posts-for-month', {
                url: '/posts/:year/:month',
                templateUrl: function (stateParams) {
                    return '/posts/' + stateParams.year + '/' + stateParams.month;
                }
            })
            .state('page-details', {
                url: '/page/:slug',
                templateUrl: function (stateParams) {
                    return '/page/' + stateParams.slug;
                }
            })
            .state('archive', {
                url: '/archive',
                templateUrl: '/archive'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/contact',
                controller: 'Contact.IndexController',
                controllerAs: 'vm'
            });

        // mark all requests from angular as ajax requests
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    function run() {
    }
})();