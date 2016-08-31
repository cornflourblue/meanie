(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.view.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            })
            .state('post-details', {
                url: '/post/:year/:month/:day/:slug',
                templateUrl: 'posts/details.view.html',
                controller: 'Posts.DetailsController',
                controllerAs: 'vm'
            })
            .state('posts-for-tag', {
                url: '/posts/tag/:tag',
                templateUrl: 'posts/tag.view.html',
                controller: 'Posts.TagController',
                controllerAs: 'vm'
            })
            .state('posts-for-month', {
                url: '/posts/:year/:month',
                templateUrl: 'posts/month.view.html',
                controller: 'Posts.MonthController',
                controllerAs: 'vm'
            })
            .state('page-details', {
                url: '/page/:slug',
                templateUrl: 'pages/details.view.html',
                controller: 'Pages.DetailsController',
                controllerAs: 'vm'
            });
    }

    function run($rootScope) {
        $rootScope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
})();