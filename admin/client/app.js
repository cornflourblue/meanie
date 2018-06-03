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
                abstract: true,
                template: '<ui-view />',
                data: {
                    area: 'site-admin',
                    section: 'posts' 
                }
            })
                .state('posts.list', {
                    url: '',
                    templateUrl: 'posts/index.view.html',
                    controller: 'Posts.IndexController',
                    controllerAs: 'vm'
                })
                .state('posts.add-edit', {
                    url: '/{action:add|edit}/:_id',
                    params: { _id: { squash: true, value: null } },
                    templateUrl: 'posts/add-edit.view.html',
                    controller: 'Posts.AddEditController',
                    controllerAs: 'vm'
                })
            .state('pages', {
                url: '/pages',
                abstract: true,
                template: '<ui-view />',
                data: { 
                    area: 'site-admin',
                    section: 'pages' 
                }
            })
                .state('pages.list', {
                    url: '',
                    templateUrl: 'pages/index.view.html',
                    controller: 'Pages.IndexController',
                    controllerAs: 'vm'
                })
                .state('pages.add-edit', {
                    url: '/{action:add|edit}/:_id',
                    params: { _id: { squash: true, value: null } },
                    templateUrl: 'pages/add-edit.view.html',
                    controller: 'Pages.AddEditController',
                    controllerAs: 'vm'
                })
            .state('redirects', {
                url: '/redirects',
                abstract: true,
                template: '<ui-view />',
                data: { 
                    area: 'site-admin',
                    section: 'redirects' 
                }
            })
                .state('redirects.list', {
                    url: '',
                    templateUrl: 'redirects/index.view.html',
                    controller: 'Redirects.IndexController',
                    controllerAs: 'vm'
                })
                .state('redirects.add-edit', {
                    url: '/{action:add|edit}/:_id',
                    params: { _id: { squash: true, value: null } },
                    templateUrl: 'redirects/add-edit.view.html',
                    controller: 'Redirects.AddEditController',
                    controllerAs: 'vm'
                })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.view.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm'
            })
            .state('sites', {
                url: '/sites',
                abstract: true,
                template: '<ui-view />',
                data: { 
                    area: 'system-admin',
                    section: 'sites'
                }
            })
                .state('sites.list', {
                    url: '',
                    templateUrl: 'sites/index.view.html',
                    controller: 'Sites.IndexController',
                    controllerAs: 'vm'
                })
                .state('sites.add-edit', {
                    url: '/{action:add|edit}/:_id',
                    params: { _id: { squash: true, value: null } },
                    templateUrl: 'sites/add-edit.view.html',
                    controller: 'Sites.AddEditController',
                    controllerAs: 'vm'
                })
            .state('users', {
                url: '/users',
                abstract: true,
                template: '<ui-view />',
                data: { 
                    area: 'system-admin',
                    section: 'users' 
                }
            })
                .state('users.list', {
                    url: '',
                    templateUrl: 'users/index.view.html',
                    controller: 'Users.IndexController',
                    controllerAs: 'vm'
                })
                .state('users.add-edit', {
                    url: '/{action:add|edit}/:_id',
                    params: { _id: { squash: true, value: null } },
                    templateUrl: 'users/add-edit.view.html',
                    controller: 'Users.AddEditController',
                    controllerAs: 'vm'
                });
    }

    function run($http, $rootScope, $window, $state, $location) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.currentUser.token;

        // add current site id http header
        var siteId = localStorage.getItem('siteId') || $window.currentUser.sites[0]._id;
        $http.defaults.headers.common['MEANie-Site-Id'] = siteId;
        $rootScope.currentUser = $window.currentUser;
        $rootScope.currentSite = $window.currentUser.sites.filter(x => x._id === siteId)[0];

        // enable site switching
        $rootScope.switchSite = function(site) {
            $rootScope.showSiteSelector = false;
            $rootScope.currentSite = site;
            localStorage.setItem('siteId', site._id);
            $http.defaults.headers.common['MEANie-Site-Id'] = site._id;
            $state.reload();
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // redirect to home page if unauthorised
            var data = toState.data || {};
            if (data.area === 'system-admin' && !$rootScope.currentUser.isSystemAdmin) {
                event.preventDefault();
                $location.path('/');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // update state data on root scope
            var data = toState.data || {};
            $rootScope.area = data.area;
            $rootScope.section = data.section;
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