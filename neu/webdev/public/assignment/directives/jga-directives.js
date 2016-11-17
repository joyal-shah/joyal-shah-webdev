(function(){
    angular
        .module("jgaDirectives", [])
        .directive("jgaSortable",function(){

            function linker(scope, element, attributes){
                var start = -1;
                var end = -1;

                element.sortable({
                    start: function(event, ui){
                        start = $(ui.item).index();
                    },
                    stop: function(event, ui){
                        end = $(ui.item).index();
                        scope.sortableController.sort(start, end);
                    }
                });
            }

            return {
                scope:{},
                link: linker,
                controller: sortableController,
                controllerAs: 'sortableController'
            }

            function sortableController($routeParams,WidgetService){
                var vm = this;
                vm.sort = sort;
                vm.pageId = $routeParams["pid"];
                function sort(start,end){
                    WidgetService.sort(vm.pageId,start,end);
                }
            }
        });


})();