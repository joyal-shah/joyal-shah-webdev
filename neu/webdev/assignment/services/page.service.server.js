module.exports = function (app) {

    var pages = [
        { _id: "321", name: "Post 1", websiteId: "456", description: "Lorem" },
        { _id: "432", name: "Post 2", websiteId: "456", description: "Lorem" },
        { _id: "543", name: "Post 3", websiteId: "456", description: "Lorem" }
    ];

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req,res){
        var newPage = req.body;
        pages.push(newPage);
        res.send(newPage);
    }

    function findAllPagesForWebsite(req,res){

        var websiteId = req.params.websiteId;

        var result = [];

        for(var p in pages){

            var page = pages[p];

            if(page.websiteId === websiteId){
                result.push(page);
            }
        }

        res.send(result);

    }

    function findPageById(req,res){

        var pageId = req.params.pageId;

        var pageFound = 400;

        for(var p in pages){
            var page = pages[p];
            if(page._id === pageId){
                pageFound = page;
                break;
            }
        }
        res.send(pageFound);
    }

    function updatePage(req,res){

        var pageId = req.params.pageId;
        var page = req.body;
        var updateSuccessful = 400;
        for(var p in pages){
            var curPage = pages[p];
            if(curPage._id === pageId){
                curPage.name = page.name;
                curPage.description = page.description;
                updateSuccessful = 200;
                break;
            }
        }
        res.sendStatus(updateSuccessful);
    }

    function deletePage(req,res){

        var pageId = req.params.pageId;

        var deleteSuccessful = 400;

        for(var index = 0;index < pages.length; index++){
            if(pages[index]._id === pageId){
                pages.splice(index,1);
                deleteSuccessful = 200;
                break;
            }
        }

        res.sendStatus(deleteSuccessful);
    }
}
