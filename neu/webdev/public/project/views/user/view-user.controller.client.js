(function(){
    angular
        .module("CampApp")
        .controller("ViewUserController", ViewUserController);

    function ViewUserController($location, $routeParams, ProjectUserService, $rootScope) {
        var vm = this;


        var userId = $routeParams.userId;

        function init() {
            ProjectUserService
                .findUserById(userId)
                .then(function (response){
                    vm.user = response.data;
                    
                });
        }
        init();
    }
})();