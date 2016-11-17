(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http){

        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget,
            sort: sort
        };
        return api;

        function createWidget(pageId, widget){
            var url = "/api/page/"+pageId+"/widget";
            var newWidget = widget;
            newWidget.pageId = pageId;
            return $http.post(url, newWidget);
        }

        function findWidgetsByPageId(pageId){
            var url = "/api/page/"+pageId+"/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId){
            var url = "/api/widget/"+widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget){
            var url = "/api/widget/"+widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId){
            var url = "/api/widget/"+widgetId;
            return $http.delete(url);
        }

        function sort(pageId,index1,index2){
            var url = "/page/"+pageId+"/widget?initial="+index1+"&final="+index2;
            return $http.put(url);
        }
    }
})();