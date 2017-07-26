(function() {
  angular
    .module('Jamathon')
    .controller('LoadoutCtrl', LoadoutCtrl);

  LoadoutCtrl.$inject = [ 'PassportSvc' ];

  function LoadoutCtrl(PassportSvc) {
    var vm = this;

    // vm.user = user;

    vm.user = null;

    init();

    function init() {
      PassportSvc.userAuth()
        .then(function(result) {
          console.log(result);

          vm.user = result.data.user;
        })
        .catch(function(err) {
          console.log(err);
        });

    }

  }
})();