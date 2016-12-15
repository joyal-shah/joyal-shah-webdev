(function () {
    angular
        .module("CampApp")
        .controller("MeetUpSearchController", MeetUpSearchController);

    function MeetUpSearchController($routeParams, MeetUpService, $rootScope,$location) {
        var vm = this;

        vm.searchText = $routeParams.searchTerm;
        vm.currentUser = $rootScope.currentUser;
        vm.NewSearch = NewSearch;


        function init() {
            MeetUpService
                .searchEvents(vm.searchText)
                .then(function (response) {
                        vm.events = response.data.results;
                    },
                    function (err) {
                        console.log(err);
                    });
        }
        init();

        function NewSearch(){
            $location.url("/meetup/"+vm.searchText);
        }
    }
})();