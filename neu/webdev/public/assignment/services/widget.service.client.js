(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService(){

        var widgets = [
            { _id: "123", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
            { _id: "234", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
            { _id: "345", widgetType: "IMAGE", pageId: "321", width: "100%", url: "http://lorempixel.com/400/200/"},
            { _id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
            { _id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem Ipsum"},
            { _id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%", url: "https://youtu.be/AM2Ivdi9c4E" },
            { _id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"}
        ];

        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget
        };
        return api;

        function getNewWidgetId(){
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

        function createWidget(pageId, widget){

            var newWidget = widget;
            newWidget._id = getNewWidgetId();
            newWidget.pageId = pageId;

            widgets.push(newWidget);

            return newWidget;
        }

        function findWidgetsByPageId(pageId){
            result = [];

            for(var w in widgets){

                widget = widgets[w];

                if(widget.pageId === pageId){
                    result.push(widget);
                }
            }
            return result;
        }

        function findWidgetById(widgetId){
            widgetFound = null;

            for(var w in widgets){
                widget = widgets[w];
                if(widget._id === widgetId){
                    widgetFound = widget;
                    break;
                }
            }
            return widgetFound;
        }

        function updateWidget(widgetId, widget){
            var updateSuccessful = false;
            for(var w in widgets){
                curwidget = widgets[w];
                if(curwidget._id === widgetId){
                    curwidget = widget;
                    updateSuccessful = true;
                    break;
                }
            }
            return updateSuccessful;
        }

        function deleteWidget(widgetId){
            var deleteSuccessful = false;

            for(var index = 0;index < widgets.length; index++){
                if(widgets[index]._id === widgetId){
                    widgets.splice(index,1);
                    deleteSuccessful = true;
                    break;
                }
            }
            return deleteSuccessful;
        }

    }
})();