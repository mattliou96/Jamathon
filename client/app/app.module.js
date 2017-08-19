(function () {
    var app = angular
        .module('Jamathon', ['ui.router', 'ngFileUpload', 'ngSanitize', 'ngAudio']);

    app.run(function ($rootScope, $state, $location, AuthFactory) {
        console.log("-----");
        $rootScope.$on('$routeChangeStart', function (event, toState, toParams, fromState) {
            console.log(AuthFactory.isLoggedIn());
            AuthFactory.getUserStatus(function (result) {
                console.log("server side session id", result);
                AuthFactory.setUsername(result);
            });

        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            console.log(AuthFactory.isLoggedIn());
            AuthFactory.getUserStatus(function (result) {
                console.log("server side session id", result);
                AuthFactory.setUsername(result);
            });

        });
    });

})();
