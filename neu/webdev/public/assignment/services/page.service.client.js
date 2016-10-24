(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService(){

        var pages = [
            { _id: "321", name: "Post 1", websiteId: "456", description: "Lorem" },
            { _id: "432", name: "Post 2", websiteId: "456", description: "Lorem" },
            { _id: "543", name: "Post 3", websiteId: "456", description: "Lorem" }
        ];

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
            pageCreated = false;

            pageExisting = false;

            for(var p in pages){
                if( (p.name === page.name) && (p.websiteId === websiteId)){
                    pageExisting = true;
                    break;
                }
            }

            if(!pageExisting){
                var newPage = {_id: getNewPageId(),
                    name: page.name,
                    websiteId: websiteId,
                    description: page.description};

                pages.push(newPage);
                pageCreated = true;
            }

            return pageCreated;
        }

        function findPageByWebsiteId(websiteId){
            result = [];

            for(var p in pages){

                page = pages[p];

                if(page.websiteId === websiteId){
                    result.push(page);
                }
            }
            return result;
        }

        function findPageById(pageId){
            pageFound = null;

            for(var p in pages){
                page = pages[p];
                if(page._id === pageId){
                    pageFound = page;
                    break;
                }
            }
            return pageFound;
        }

        function updatePage(pageId, page){
            updateSuccessful = false;
            for(var p in pages){
                curPage = pages[p];
                if(curPage._id === pageId){
                    curPage.name = page.name;
                    curPage.description = page.description;
                    updateSuccessful = true;
                    break;
                }
            }
            return updateSuccessful;
        }

        function deletePage(pageId){
            deleteSuccessful = false;

            for(var index = 0;index < pages.length; index++){
                if(pages[index]._id === pageId){
                    pages.splice(index,1);
                    deleteSuccessful = true;
                    break;
                }
            }

            return deleteSuccessful;
        }

    }
})();
