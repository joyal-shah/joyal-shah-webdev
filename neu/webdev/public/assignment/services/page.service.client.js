(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http){

        var api = {
            createPage: createPage,
            findPageByWebsiteId: findPageByWebsiteId,
            findPageById: findPageById,
            updatePage: updatePage,
            deletePage: deletePage
        };
        return api;

        // Generates a unique random integer
        function getNewPageId(){
            var date = new Date();

            var components = [
                date.getYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];

            var id = components.join("");

            return id;
        }

        function createPage(websiteId, page){

            var url = "/api/website/"+websiteId+"/page";

            var newPage = {_id: getNewPageId(),
                name: page.name,
                websiteId: websiteId,
                description: page.description};

            return $http.post(url, newPage);

        }

        function findPageByWebsiteId(websiteId){
            var url = "/api/website/"+websiteId+"/page";
            return $http.get(url);
        }

        function findPageById(pageId){
            var url = "/api/page/"+pageId;
            return $http.get(url);
        }

        function updatePage(pageId, page){
            var url = "/api/page/"+pageId;
            return $http.put(url, page);
        }

        function deletePage(pageId){
            var url = "/api/page/"+pageId;
            return $http.delete(url);
        }

    }
})();
