(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController",WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService){
        var vm = this;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();

    }

    function NewWebsiteController($routeParams, $location, WebsiteService){
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.createNewWebsite = createNewWebsite;

        function init(){
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();

        function createNewWebsite(newWebSite){

            if(newWebSite.name == null){
                vm.error = "Please give name for the website!!";
            }
            else{
                websiteCreated = WebsiteService.createWebsite(vm.userId, newWebSite);

                if(websiteCreated){
                    // Redirecting to website list page
                    $location.url("/user/"+ vm.userId + "/website");
                }
                else{
                    vm.error = "Failed to create new website";
                }
            }
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService){
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.currentWebSiteId = $routeParams['wid'];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init(){
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.currentwebsite = WebsiteService.findWebsiteById(vm.currentWebSiteId);
        }
        init();

        function updateWebsite(){

            if(vm.currentwebsite.name != '' && vm.currentwebsite.name != null) {
                var updateSuccessful = WebsiteService.updateWebsite(vm.currentWebSiteId, vm.currentwebsite);
                if (updateSuccessful) {
                    // Redirect to website list page
                    $location.url("/user/" + vm.userId + "/website");
                }
                else {
                    vm.error = "Failed to update website";
                }
            }
            else{
                vm.error = "Website name cannot be empty";
            }
        }

        function deleteWebsite(){
            var deleteSuccessful = WebsiteService.deleteWebsite(vm.currentWebSiteId);
            if(deleteSuccessful){
                // Redirect to website list page
                $location.url("/user/" + vm.userId + "/website");
            }
            else{
                vm.error = "Failed to delete website";
            }
        }
    }

})();
