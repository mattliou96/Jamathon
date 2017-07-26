(function() {
  angular
    .module('Jamathon')
    .service('PassportSvc', PassportSvc);

  PassportSvc.$inject = [ "$http" ];

  function PassportSvc($http) {
    var svc = this;

    svc.login = login;
    svc.userAuth = userAuth;
   
    
    function userAuth() {
      return $http.get(
        '/user/auth',
      );
    }

    function login(user) {
      return $http.post(
        '/login',
        user
      );
    }
  }
})();
