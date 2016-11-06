module.exports = function (app) {

    var todos = [
        {_id:"123", title: 'Todo 123'},
        {_id:"234", title: 'Todo 234'},
        {_id:"345", title: 'Todo 345'},
        {_id:"456", title: 'Todo 456'},
        {_id:"567", title: 'Todo 567'}
    ];

    app.get("/api/todo", getAllTodos);
    app.put("/api/todo", updateTodos);

    function getAllTodos(req,res){
        res.send(todos);
    }

    function updateTodos(req,res){
        var start = req.query.start;
        var end = req.query.end;
        todos.splice(end, 0, todos.splice(start, 1)[0]);
    }

}