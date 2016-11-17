(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];

            PageService.findPageByWebsiteId(vm.websiteId)
                .success(function (pagesFound) {
                    vm.pages = pagesFound;
                })
                .error(function (err) {
                    vm.error = "Error while fetching pages!! Please try after sometime";
                });
        }

        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.createNewPage = createNewPage;

        function init() {
            vm.page = {"name": "", "description": ""};
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
        }

        init();

        function createNewPage(newPage) {
            if (newPage.name == "") {
                vm.error = "Page name cannot be blank";
            }
            else {
                PageService.createPage(vm.websiteId, newPage)
                    .success(function (newCreatedPage) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function (err) {
                        vm.error = "Failed to create new page";
                    });
            }
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            PageService.findPageById(vm.pageId)
                .success(function (curPage) {
                    vm.currentpage = curPage;
                })
                .error(function (err) {
                    vm.error = "Cannot find current page!! Please try again"
                });
        }

        init();

        function updatePage() {

            if (vm.currentpage.name != '' && vm.currentpage.name != null) {

                PageService.updatePage(vm.pageId, vm.currentpage)
                    .then(function (response) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    }, function (err) {
                        vm.error = "Failed to update page";
                    });
            }
            else {
                vm.error = "Page name cannot be empty";
            }
        }

        function deletePage() {
            PageService.deletePage(vm.pageId)
                .success(function (res) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function (err) {
                    vm.error = "Failed to delete page";
                });
        }
    }

})();