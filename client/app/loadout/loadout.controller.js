(function() {
  angular
    .module('Jamathon')
    .controller('LoadoutCtrl', LoadoutCtrl);

  LoadoutCtrl.$inject = [ 'PassportSvc', 'AuthFactory', '$rootScope' ];

  function LoadoutCtrl(PassportSvc, AuthFactory, $rootScope) {
    var vm = this;

    // vm.user = user;

    //vm.user = null;
    init();
    
    
    function init() {
      console.log("init");
      PassportSvc.userAuth()
        .then(function(result) {
          console.log(result);

          AuthFactory.setUser(result.data.user);
          vm.username = AuthFactory.getUsername();
        })
        .catch(function(err) {
          console.log(err);
        });

    }

  }
})();