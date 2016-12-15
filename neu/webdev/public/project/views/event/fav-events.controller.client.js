(function(){
    angular
        .module("CampApp")
        .controller("FavouriteEventsController", FavouriteEventsController);

    function FavouriteEventsController($location, $routeParams, MeetUpService, $rootScope) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.currentUser = $rootScope.currentUser;
        function init() {
            console.log(vm.userId);
            MeetUpService
                .findEventsForUser(vm.userId)
                .then(function(response){
                    console.log("event in fa "+response);
                    var results = [];
                    for(var event in response.data){
                        var currentEvent = response.data[event].eventObject;
                        currentEvent.dbId = response.data[event]._id;
                        results.push(currentEvent);
                    }
                        
                    vm.events = results;
                    },
                    function(err){
                        console.log(err);
                    });
        }
        init();
    }
})();