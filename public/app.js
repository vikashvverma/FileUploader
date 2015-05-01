angular.module('uploadExample', [])
  .directive('fileUpload', function() {
    return {
      scope: true,
      link: function(scope, el, attrs) {
        el.bind('change', function(event) {
          var files = event.target.files;
          if(!files.length)
            return;
          var img = document.createElement("img");
          img.src = window.URL.createObjectURL(files[0]);
          img.onload = function() {
            window.URL.revokeObjectURL(this.src);
          }
          document.getElementById('thumbnail').appendChild(img);
          scope.$emit('fileSelected', {
            file: files[0]
          });
        });
      }
    }
  })
  .controller('uploadController', ['$scope', 'uploadService', function($scope, uploadService) {
    $scope.user = {
      username: 'vikash',
      first_name: 'Vikash',
      last_name: 'Verma'
    };
    $scope.files = [];
    $scope.$on('fileSelected', function(event, data) {
      $scope.$apply(function() {
        $scope.files = data.file;
      })
      $scope.upload = function() {
        uploadService.upload({user:$scope.user,files:$scope.files});
      };
    });

  }])
  .factory('uploadService', ['$http','$q','$log', function($http,$q,$log) {
    var uploadService={};
    return {
      upload:function(model){
        $log.debug(model);
        return $http({
          method:'POST',
          url:'/upload',
         headers:{'Content-Type':undefined},
          transformRequest:function(data){
            var formData=new FormData();
                formData.append('user',angular.toJson(data.user));
                formData.append('file',data.files);
                $log.debug(formData);
                $log.debug(data);
                return formData;
          },
          data:{user:model.user,files:model.files}
        }).success(function(data, status, headers, config){
          $log.info('File Uploaded Successfully!');
          return ({status:'success'});
        }).error(function(data, status, headers, config){
          $log.error('File could not be uploaded!');
          $q.reject({status:'failure'});
        });
      }
    }
  }]);
