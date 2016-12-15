(function(){
    angular
        .module("CampApp")
        .factory("MeetUpService", MeetUpService);

    var key = "1c5d117b5514757326e37854277463";

    var urlBase = "https://api.meetup.com/2/open_events?&sign=true&key=API_KEY&category=9,14,32,23&text=TEXT&page=20&format=json&callback=JSON_CALLBACK&fields=group_photo";
    var eventUrl = "https://api.meetup.com/GROUP_URL/events/EVENT_ID?&sign=true&photo-host=public&fields=group_photo&key=API_KEY&format=json&callback=JSON_CALLBACK";

    function MeetUpService($http) {
        var api = {
            searchEvents         : searchEvents,
            findEventById        : findEventById,
            findFavEventById    : findFavEventById,
            findMeetupEventForUser    : findMeetupEventForUser,
            createEventForUser       : createEventForUser,
            removeEventFromUser  : removeEventFromUser,
            findEventsForUser    : findEventsForUser,
            findEventByMeetupId : findEventByMeetupId,
            updateEventAndUSerReferences : updateEventAndUSerReferences,
            removeEvent : removeEvent
        };
        return api;

        function searchEvents(searchTerm) {
            var url = urlBase.replace("TEXT", searchTerm);
            url = url.replace("API_KEY", key);
            return $http.jsonp(url);
        }

        function findEventById(groupUrl, eventId) {
            var url = eventUrl.replace("GROUP_URL", groupUrl);
            url = url.replace("EVENT_ID", eventId);
            url = url.replace("API_KEY", key);
            return $http.jsonp(url);
        }

        function createEventForUser(userId, event) {
            return $http.post("/project/api/user/"+userId+"/event",event);
        }


        function findFavEventById(userId, eventId) {
            return $http.get("/project/api/user/"+userId+"/favourite/"+eventId);
        }

        function findMeetupEventForUser(userId, meetupId) {
            return $http.get("/project/api/user/"+userId+"/meetup/"+meetupId);
        }
        function findEventsForUser(userId) {
            return $http.get("/project/api/user/"+userId+"/events");
        }

        function findEventByMeetupId(meetupId){
            return $http.get("/project/api/meetupevent/"+meetupId);
        }

        function updateEventAndUSerReferences(userId, eventId){
            return $http.get("/project/api/user/"+userId+"/event/"+eventId+"/update");
        }

        function removeEventFromUser(userId, eventId) {
            return $http.get("/project/api/user/"+userId+"/event/"+eventId);
        }

        function removeEvent(eventId) {
            return $http.delete("/project/api/event/"+eventId);
        }
    }
})();