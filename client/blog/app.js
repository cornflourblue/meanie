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
                url: '/?:page',
                templateUrl: function (stateParams) {
                    return '/?xhr=1' + (stateParams.page ? '&page=' + stateParams.page : '');
                }
            })
            .state('post-details', {
                url: '/post/:year/:month/:day/:slug',
                templateUrl: function (stateParams) {
                    return '/post/' + stateParams.year + '/' + stateParams.month + '/' + stateParams.day + '/' + stateParams.slug + '?xhr=1';
                }
            })
            .state('posts-for-tag', {
                url: '/posts/tag/:tag',
                templateUrl: function (stateParams) {
                    return '/posts/tag/' + stateParams.tag + '?xhr=1';
                }
            })
            .state('posts-for-month', {
                url: '/posts/:year/:month',
                templateUrl: function (stateParams) {
                    return '/posts/' + stateParams.year + '/' + stateParams.month + '?xhr=1';
                }
            })
            .state('page-details', {
                url: '/page/:slug',
                templateUrl: function (stateParams) {
                    return '/page/' + stateParams.slug + '?xhr=1';
                }
            })
            .state('archive', {
                url: '/archive',
                templateUrl: '/archive?xhr=1'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/contact?xhr=1',
                controller: 'Contact.IndexController',
                controllerAs: 'vm'
            })
            .state('contact-thanks', {
                url: '/contact-thanks',
                templateUrl: '/contact-thanks?xhr=1'
            });

        // mark all requests from angular as ajax requests
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    var initialLoad = true;
    function run($rootScope, $timeout, $location, $window) {
        $rootScope.$on('$stateChangeSuccess', function () {
            // hide mobile nav
            $rootScope.showNav = false;

            // track pageview
            $window.ga && $window.ga('send', 'pageview', $location.url());

            // jump to top of page
            if (!initialLoad) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }

            $timeout(function () {
                // run syntax highlighter plugin
                SyntaxHighlighter.highlight();
            });

            initialLoad = false;
        });
    }

})();