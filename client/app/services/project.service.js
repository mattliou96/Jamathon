(function() {
    'use strict';

    angular
        .module('Jamathon')
        .service('ProjectSvc', ProjectSvc);

    ProjectSvc.$inject = ['$http'];
    function ProjectSvc ($http) {
        var service = this;

        service.uploadProject = uploadProject;
        service.getAllUsersProjects = getAllUsersProjects;

        
        function uploadProject(trackSet) {
            console.log(trackSet);
        };

        function getAllUsersProjects() {
            console.log("get all projects");
            $http.get("/api/users/projects", function(result){
                service.allprojects = result;
            });
        };
        
    }
})();