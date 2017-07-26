(function() {
  angular
    .module('Jamathon')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = [ 'user', 'PassportSvc', '$state' ];

  function LoginCtrl(user, PassportSvc, $state) {
    var vm = this;

    vm.user = {
      username: '',
      password: '',
    }
    vm.msg = '';

    vm.login = login;

    function login() {


      PassportSvc.login(vm.user)
        .then(function(result) {
          console.log(">user" + JSON.stringify(result));
          PassportSvc.user = result;
          $state.go('loadout');
          return true;
        })
        .catch(function(err) {
          vm.msg = 'Invalid Username or Password!';
          vm.user.username = vm.user.password = '';
          return false;
        });
    }
  }
})();