(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController",WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)

    function WidgetListController($sce, $routeParams, $location, WidgetService){
        var vm = this;

        vm.getSafeHtml = getSafeHtml;
        vm.checkSafeURL = checkSafeURL;
        vm.editRedirect = editRedirect;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();

        function getSafeHtml(text) {
            return $sce.trustAsHtml(text);
        }

        function editRedirect(wdg){
            if(wdg.widgetType != "HTML") {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + wdg._id);
            }
        }

        function checkSafeURL(widgetURL) {
            var parts = widgetURL.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;

            return $sce.trustAsResourceUrl(url);
        }
    }

    function NewWidgetController($location ,$routeParams, WidgetService){
        var vm = this;

        vm.createNewWidget = createNewWidget;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.currentWidgetId = $routeParams['wgid'];
            vm.currentWidget = WidgetService.findWidgetById(vm.currentWidgetId);
            vm.newWidgetHeader = {_id: "", widgetType: "HEADER", pageId: vm.pageId, size: 2, text: "New Header Text"};
            vm.newWidgetImage = {_id: "", widgetType: "IMAGE", pageId: vm.pageId, width: "100%", url: "http://lorempixel.com/400/200/"};
            vm.newWidgetYouTube = {_id: "", widgetType: "YOUTUBE", pageId: vm.pageId, width: "100%", url: "https://youtu.be/AM2Ivdi9c4E"};
        }
        init();

        function createNewWidget(newWidget){

            var widgetCreated = WidgetService.createWidget(vm.pageId, newWidget);

            if (widgetCreated._id != 0) {
                // Redirecting to widget edit page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widgetCreated._id);
            }
            else {
                vm.error = "Failed to create new widget";
            }

        }
    }

    function EditWidgetController($routeParams, $location, WidgetService){
        var vm = this;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.currentWidgetId = $routeParams['wgid'];
            vm.currentWidget = WidgetService.findWidgetById(vm.currentWidgetId);
        }
        init();

        function updateWidget(){
            var updateSuccessful = WidgetService.updateWidget(vm.currentWidgetId, vm.currentWidget);
            if (updateSuccessful) {
                // Redirect to widget list page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            }
            else {
                vm.error = "Failed to update widget";
            }
        }

        function deleteWidget(){
            var deleteSuccessful = WidgetService.deleteWidget(vm.currentWidgetId);
            if(deleteSuccessful){
                // Redirect to widget list page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            }
            else{
                vm.error = "Failed to delete widget";
            }
        }
    }
})();

