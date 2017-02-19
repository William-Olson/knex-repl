
// init angular
angular.module('knexrepl', [ ])

// services
.service('mainSvc', [ '$http', function($http) {
  const service = {};

  service.getParsed = function(str) {
    return $http.post('/parse', { code: str });
  };

  return service;
}])

.filter('to_trusted', [ '$sce', function($sce) {
  return function(text) {
      return $sce.trustAsHtml(text);
  };
}])

// controllers
.controller('mainCtrl', [ '$scope', 'mainSvc', function($scope, mainSvc) {

  $scope.clear = function() {
    $scope.editor.setValue('');
    $scope.output = '';
    $scope.error = '';
  };

  $scope.submit = function() {
    $scope.error = '';
    mainSvc.getParsed($scope.editor.getValue())
      .then(r => {
        $scope.output = r.data;
      })
      .catch(err => {
        console.log('caught err:', err);
        $scope.error = err.data.message.replace(/\n/gim, '<br>');
      });
  };

  // init ace editor
  $scope.editor = ace.edit('editor');
  $scope.editor.setTheme('ace/theme/ambiance');
  $scope.editor.getSession().setMode('ace/mode/javascript');

}]);




