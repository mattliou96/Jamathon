(function () {
    var app = angular
        .module('Jamathon')
        .config(uiRouteConfig);

    uiRouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function uiRouteConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('jamathon', {
                url: '/jamathon',
                templateUrl: 'app/jamathon/jamathon.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/profile/profile.html'
            })
            .state('loadout', {
                url: '/loadout',
                templateUrl: 'app/loadout/loadout.html',
                controller: "LoadoutCtrl as ctrl"
            })
            // .state('login', {
            //     url: '/login',
            //     templateUrl: 'app/login/login.html'
            // })
            .state('projects', {
                url: '/projects',
                templateUrl: 'app/projects/project.sequencer.html',
                controller: "ProjectCtrl as uploadCtrl"
            })
            .state('userprojects', {
                url: '/user.projects',
                templateUrl: 'app/userprojects/user.projects.html',
                controller:"userProjectCtrl as ctrl"
            })
            .state('upload', {
                url: '/upload',
                templateUrl: 'app/upload/upload.html',
                controller: "UploadCtrl as uploadCtrl"
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/register/register.html',
                controller: "RegCtrl as regCtrl"
            })
            .state("login", {
                url: "/login",
                // views: {
                //     'loadout': {
                //         templateUrl: 'app/loadout/loadout.html',
                //         controller: 'LoadoutCtrl as ctrl',
                //     },
                //     'content': {
                //         templateUrl: 'app/login/login.html',
                //         controller: 'LoginCtrl as ctrl',
                //     }
                // }
                controller: 'LoginCtrl as ctrl',
                templateUrl: "app/login/login.html",
                resolve: {
                    user: function (PassportSvc) {
                        return PassportSvc.userAuth()
                            .then(function (result) {
                                return result.data.user;
                            })
                            .catch(function (err) {
                                return '';
                            });
                    }
                },
            });
            
        $urlRouterProvider.otherwise('/jamathon');
    }

})();