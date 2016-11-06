(function(){
    angular
        .module("TodoApp")
        .factory("TodoService", TodoService);

    function TodoService($http){

        var api = {
            getAllTodos: getAllTodos,
            sort: sort
        };
        return api;

        function getAllTodos(){
            var url = "/api/todo";
            return $http.get(url);
        }

        function sort(start,end){
            var url = "/api/todo?start="+start+"&end="+end;
            return $http.put(url);
        }
    }
})();