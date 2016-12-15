(function(){
    angular
        .module("CampApp")
        .controller("EventSearchController", EventSearchController);

    function EventSearchController($location, $routeParams, MeetUpService, $rootScope) {
        var vm = this;

        vm.NewSearch = NewSearch;

        vm.searchText = $routeParams.searchTerm;
        vm.currentUser = $rootScope.currentUser;
        function init() { 
            MeetUpService
                .searchEvents(vm.searchText)
                .then(function(response){ 
                    vm.events = response.data.results; ;
                    },
                    function(err){
                        console.log(err);
                    });
        }
        init();

        function NewSearch(){
            $location.url("/meetup/"+vm.searchText);
        }
    }
})();