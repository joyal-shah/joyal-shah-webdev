module.exports = function (app) {

    var widgets = [
        { _id: "123", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
        { _id: "234", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem ipsum"},
        { _id: "345", widgetType: "IMAGE", pageId: "321", width: "100%", url: "http://lorempixel.com/400/200/"},
        { _id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
        { _id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Lorem Ipsum"},
        { _id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%", url: "https://youtu.be/AM2Ivdi9c4E" },
        { _id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"}
    ];

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/page/:pageId/widget",updateWidgetOrder);

    function createWidget(req,res){
        var newWidget = req.body;
        widgets.push(newWidget);
        res.send(newWidget);
    }

    function findAllWidgetsForPage(req,res){

        var pageId = req.params.pageId;

        var result = [];

        for(var w in widgets){

            var widget = widgets[w];

            if(widget.pageId === pageId){
                result.push(widget);
            }
        }
        res.send(result);
    }

    function findWidgetById(req,res){
        var widgetId = req.params.widgetId;

        var widgetFound = 400;

        for(var w in widgets){
            var widget = widgets[w];
            if(widget._id === widgetId){
                widgetFound = widget;
                break;
            }
        }
        res.send(widgetFound);
    }

    function updateWidget(req,res){

        var widgetId = req.params.widgetId;
        var widget = req.body;
        var updateSuccessful = 400;
        for(var w in widgets){
            if(widgets[w]._id === widgetId){
                widgets[w] = widget;
                updateSuccessful = 200;
                break;
            }
        }

        res.sendStatus(updateSuccessful);
    }

    function deleteWidget(req,res){

        var widgetId = req.params.widgetId;

        var deleteSuccessful = 400;

        for(var index = 0;index < widgets.length; index++){
            if(widgets[index]._id === widgetId){
                widgets.splice(index,1);
                deleteSuccessful = 200;
                break;
            }
        }
        res.sendStatus(deleteSuccessful);
    }

    function updateWidgetOrder(req,res){
        var start = req.query.initial;
        var end = req.query.final;
        widgets.splice(end, 0, widgets.splice(start, 1)[0]);
    }
}
