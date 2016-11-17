(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController",WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($sce, $routeParams, $location, WidgetService){
        var vm = this;

        vm.getSafeHtml = getSafeHtml;
        vm.checkSafeURL = checkSafeURL;
        vm.editRedirect = editRedirect;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            WidgetService.findWidgetsByPageId(vm.pageId)
                .success(function (widgetsFound) {
                    vm.widgets = widgetsFound;
                })
                .error(function (err) {
                    vm.error = "Error while fetching widgets!! Please try after sometime";
                });
        }
        init();

        function getSafeHtml(text) {
            return $sce.trustAsHtml(text);
        }

        function editRedirect(wdg){
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + wdg._id);
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

            vm.newWidgetHeader = {name:"Header Widget", type: "HEADING", size: 2, text: "New Header Text"};
            vm.newWidgetImage = {name:"Image Widget", type: "IMAGE", width: "100%", url: "http://lorempixel.com/400/200/"};
            vm.newWidgetYouTube = {name:"Youtube Widget", type: "YOUTUBE", width: "100%", url: "https://youtu.be/AM2Ivdi9c4E"};
            vm.newWidgetHTML = {name:"HTML Widget", type: "HTML",text:""};
            vm.newWidgetTEXT = {name:"Text Input Widget", type: "INPUT",formatted: false,rows: 1,placeholder:"",text:""};
        }
        init();

        function createNewWidget(newWidget){
            WidgetService.createWidget(vm.pageId, newWidget)
                .success(function(widgetCreated){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widgetCreated._id);
                })
                .error(function (err) {
                    vm.error = "Failed to create new widget";
                });
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

            WidgetService.findWidgetById(vm.currentWidgetId)
                .success(function(curWidget){
                    vm.currentWidget = curWidget;
                })
                .error(function(err){
                    vm.error = "Error while fetching current widget!! Please try after sometime";
                });
        }
        init();

        function validateWidgetType(widgetToTest){
            var validationFailed = false;

            switch(widgetToTest.type){
                case "HEADING":
                    if(widgetToTest.text == '' || widgetToTest.text == null){
                        validationFailed = true;
                    }
                    break;
                case "IMAGE":
                    if(widgetToTest.url == '' || widgetToTest.url == null){
                        validationFailed = true;
                    }
                    break;
                case "YOUTUBE":
                    if(widgetToTest.url == '' || widgetToTest.url == null){
                        validationFailed = true;
                    }
                    break;
            }

            return validationFailed;
        }

        function updateWidget(){
            if(validateWidgetType(vm.currentWidget)){
                switch(vm.currentWidget.type) {
                    case "HEADING":
                        vm.error = "Header Text cannot be blank";
                        break;
                    case "IMAGE":
                        vm.error = "Image Url cannot be blank";
                        break;
                    case "YOUTUBE":
                        vm.error = "Video Url cannot be blank";
                        break;
                    default:
                        vm.error = "There is something wrong. Please check whether form fields are correctly filled."
                        break;
                }
            }
            else {
                WidgetService.updateWidget(vm.currentWidgetId, vm.currentWidget)
                    .then(function (response) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    }, function (err) {
                        vm.error = "Failed to update widget";
                    });
            }
        }

        function deleteWidget(){
            WidgetService.deleteWidget(vm.currentWidgetId)
                .success(function(res){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function(err){
                    vm.error = "Failed to delete widget";
                });
        }
    }
})();