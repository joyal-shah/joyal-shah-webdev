(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService(){

        var websites = [
            { _id: "123", name: "Facebook",    developerId: "456", description: "Lorem" },
            { _id: "234", name: "Tweeter",     developerId: "456", description: "Lorem" },
            { _id: "456", name: "Gizmodo",     developerId: "456", description: "Lorem" },
            { _id: "567", name: "Tic Tac Toe", developerId: "123", description: "Lorem" },
            { _id: "678", name: "Checkers",    developerId: "123", description: "Lorem" },
            { _id: "789", name: "Chess",       developerId: "234", description: "Lorem" }
        ];

        var api = {
            createWebsite: createWebsite,
            findWebsitesByUser: findWebsitesByUser,
            findWebsiteById: findWebsiteById,
            updateWebsite: updateWebsite,
            deleteWebsite: deleteWebsite
        };
        return api;

        // Generates a unique random integer
        function getNewWebSiteId(){
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

        // Adds the website parameter instance to the local websites array.
        // The new website's developerId is set to the userId parameter
        function createWebsite(userId, website){
            websiteCreated = false;

            websiteExisting = false;
            
            for(var w in websites){
                if( (w.name === website.name) && (w.developerId === userId)){
                    websiteExisting = true;
                    break;
                }
            }

            if(!websiteExisting){
                var newWebsite = {_id: getNewWebSiteId(),
                    name: website.name,
                    developerId: userId,
                    description: website.description};

                websites.push(newWebsite);
                websiteCreated = true;
            }

            return websiteCreated;
        }

        // Retrieves the websites in local websites array whose developerId matches the parameter userId
        function findWebsitesByUser(userId){
            result = [];

            for(var w in websites){

                website = websites[w];

                if(website.developerId === userId){
                    result.push(website);
                }
            }
            return result;
        }

        // Retrieves the website in local websites array whose _id matches the websiteId parameter
        function findWebsiteById(websiteId){
            websiteFound = null;

            for(var w in websites){
                website = websites[w];
                if(website._id === websiteId){
                    websiteFound = website;
                    break;
                }
            }
            return websiteFound;
        }

        // Updates the website in local websites array whose _id matches the websiteId parameter
        function updateWebsite(websiteId, website){
            var updateSuccessful = false;
            for(var w in websites){
                curWebSite = websites[w];
                if(curWebSite._id === websiteId){
                    curWebSite.name = website.name;
                    curWebSite.description = website.description;
                    updateSuccessful = true;
                    break;
                }
            }
            return updateSuccessful;
        }

        // Removes the website from local websites array whose _id matches the websiteId parameter
        function deleteWebsite(websiteId){
            var deleteSuccessful = false;

            for(var index = 0;index < websites.length; index++){
                if(websites[index]._id === websiteId){
                    websites.splice(index,1);
                    deleteSuccessful = true;
                    break;
                }
            }

            return deleteSuccessful;
        }
    }
})();
