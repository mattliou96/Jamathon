(function () {
    angular
        .module("Jamathon")
        .controller("UploadCtrl", UploadCtrl);

    UploadCtrl.$inject = ["Upload"];

    function UploadCtrl(Upload) {
        // Keep the bindable members of the controllers at the top
        var vm = this;
        vm.audFile = null;
        vm.audFileS3 = null;
        vm.statusS3 = {
            message: "",
            code: 0
        };
        vm.comment = "";
        vm.status = {
            message: "",
            code: 0
        };

        // Exposed functions
        vm.upload = upload;
        vm.uploadS3 = uploadS3;

        // -------------------------
        // File upload function using ng-file-upload
        function upload() {
            // Upload configuration and invokation 
            Upload.upload({
                url: '/upload',
                data: {
                    "aud-file": vm.audFile,
                    "comment": vm.comment
                }
            }).then(function (result) {
                vm.status.message = "The song is saved successfully in: " + result.data.path;
                vm.status.code = 202;
            }).catch(function (err) {
                console.log(err);
                vm.status.message = "Fail to save the song.";
                vm.status.code = 400
            });

        };
        function uploadS3() {
            // Upload configuration and invocation 
            console.log("hey");

            Upload.upload({
                url: '/uploadS3',
                data: {
                    "aud-file": vm.audFileS3,
                    "comment": vm.commentS3
                }
            }).then(function (result) {
                vm.statusS3.message = "The song is saved successfully in: " + result.data.path;
                vm.statusS3.code = 202;
                vm.audioFromS3 = result.data.path;
            }).catch(function (err) {
                console.log(err);
                vm.statusS3.message = "Fail to save the song.";
                vm.statusS3.code = 400
            });

        };
    }
})();