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
            .state('pages', {
                url: '/pages',
                templateUrl: 'pages/index.view.html',
                controller: 'Pages.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'pages' }
            })
            .state('pages/add', {
                url: '/pages/add',
                templateUrl: 'pages/add-edit.view.html',
                controller: 'Pages.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'pages' }
            })
            .state('pages/edit', {
                url: '/pages/edit/:_id',
                templateUrl: 'pages/add-edit.view.html',
                controller: 'Pages.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'pages' }
            })
            .state('redirects', {
                url: '/redirects',
                templateUrl: 'redirects/index.view.html',
                controller: 'Redirects.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'redirects' }
            })
            .state('redirects/add', {
                url: '/redirects/add',
                templateUrl: 'redirects/add-edit.view.html',
                controller: 'Redirects.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'redirects' }
            })
            .state('redirects/edit', {
                url: '/redirects/edit/:_id',
                templateUrl: 'redirects/add-edit.view.html',
                controller: 'Redirects.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'redirects' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.view.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('sites', {
                url: '/sites',
                templateUrl: 'sites/index.view.html',
                controller: 'Sites.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'sites' }
            })
            .state('sites/add', {
                url: '/sites/add',
                templateUrl: 'sites/add-edit.view.html',
                controller: 'Sites.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'sites' }
            })
            .state('sites/edit', {
                url: '/sites/edit/:_id',
                templateUrl: 'sites/add-edit.view.html',
                controller: 'Sites.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'sites' }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/index.view.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'users' }
            })
            .state('users/add-edit', {
                url: '/users/{action:add|edit}/:_id',
                params: { 
                    _id: { squash: true, value: null } 
                },
                templateUrl: 'users/add-edit.view.html',
                controller: 'Users.AddEditController',
                controllerAs: 'vm',
                data: { activeTab: 'users' }
            });
    }

    function run($http, $rootScope, $window, $state) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.currentUser.token;

        // add current site id http header
        $http.defaults.headers.common['MEANie-Site-Id'] = $window.currentUser.sites[0]._id;
        $rootScope.currentUser = $window.currentUser;
        $rootScope.currentSite = $window.currentUser.sites[0];

        // enable site switching
        $rootScope.switchSite = function(site) {
            $rootScope.currentSite = site;
            $http.defaults.headers.common['MEANie-Site-Id'] = site._id;
            $state.reload();
        };

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the current user is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/current-user', function (user) {
            window.currentUser = user;

            angular.bootstrap(document, ['app']);
        });
    });
})();