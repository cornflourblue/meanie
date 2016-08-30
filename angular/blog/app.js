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
            .state('post details', {
                url: '/posts/:year/:month/:day/:slug',
                templateUrl: 'posts/details.view.html',
                controller: 'Posts.DetailsController',
                controllerAs: 'vm'
            });
    }

    function run() {
    }
})();