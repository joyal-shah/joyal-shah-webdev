(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController",PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController)

    function PageListController($routeParams, PageService){
        var vm = this;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService){
        var vm = this;
        vm.createNewPage = createNewPage;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function createNewPage(newPage){
            if(newPage.name == null){
                vm.error = "Please give name for the page!!";
            }
            else{
                console.log("In Page created");
                pageCreated = PageService.createPage(vm.websiteId, newPage);

                if(pageCreated){
                    // Redirecting to website list page
                    $location.url("/user/"+ vm.userId + "/website/" + vm.websiteId + "/page");
                }
                else{
                    vm.error = "Failed to create new page";
                }
            }
        }
    }

    function EditPageController($routeParams, $location, PageService){
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.currentpage = PageService.findPageById(vm.pageId);
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function updatePage(){

            if(vm.currentpage.name != '' && vm.currentpage.name != null) {
                var updateSuccessful = PageService.updatePage(vm.pageId, vm.currentpage);
                if (updateSuccessful) {
                    // Redirect to page list page
                    $location.url("/user/"+ vm.userId + "/website/" + vm.websiteId + "/page");
                }
                else {
                    vm.error = "Failed to update page";
                }
            }
            else{
                vm.error = "Page name cannot be empty";
            }
        }

        function deletePage(){
            var deleteSuccessful = PageService.deletePage(vm.pageId);
            if(deleteSuccessful){
                // Redirect to page list page
                $location.url("/user/"+ vm.userId + "/website/" + vm.websiteId + "/page");
            }
            else{
                vm.error = "Failed to delete page";
            }
        }
    }

})();
