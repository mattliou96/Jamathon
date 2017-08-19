(function () {
    angular
        .module('Jamathon')
        .controller('RegCtrl', RegCtrl);

    RegCtrl.$inject = ['$state', 'AuthFactory', '$sanitize'];

    function RegCtrl($state, AuthFactory, $sanitize) {
        var vm = this;

        vm.email = '';
        vm.password = '';

        vm.register = function() {
            console.log("Register ")
            
            AuthFactory.register($sanitize(vm.email), $sanitize(vm.password))
                .then(function () {
                    vm.disabled = false;

                    vm.email = '';
                    vm.password = '';
                    $state.go('login');
                }).catch(function () {
                    console.error("registration having issues");
                });
        }
    }
})();