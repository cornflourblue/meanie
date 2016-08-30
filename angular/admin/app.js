(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/posts");

        $stateProvider
            .state('posts', {
                url: '/posts',
                templateUrl: 'posts/index.view.html',
                controller: 'Posts.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('posts/add', {
                url: '/posts/add',
                templateUrl: 'posts/add-edit.view.html',
                controller: 'Posts.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('posts/edit', {
                url: '/posts/edit/:_id',
                templateUrl: 'posts/add-edit.view.html',
                controller: 'Posts.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.view.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();