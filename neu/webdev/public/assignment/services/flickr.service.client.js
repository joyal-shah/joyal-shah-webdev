(function(){
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    var key = "64e50822c7a570815e1a0bf02d9f6d5d";
    var secret = "742849dea31cfd04";
    var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

    function FlickrService($http){

        var api = {
            searchPhotos : searchPhotos
        };
        return api;



        function searchPhotos(searchTerm){
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }

    }
})();
