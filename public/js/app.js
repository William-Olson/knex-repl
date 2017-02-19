
// init angular
angular.module('knexrepl', [ ])

// services
.service('mainSvc', [ '$http', function($http) {
  const service = {};

  service.getParsed = function(str) {
    return $http.post('/parse', { code: str });
  };

  service.initEditor = function() {
    // init ace editor
    service._editor = ace.edit('editor');
    service._editor.setTheme('ace/theme/ambiance');
    service._editor.getSession().setMode('ace/mode/javascript');
    service._editor.getSession().setTabSize(2);
    service._editor.getSession().setUseSoftTabs(true);
    return service._editor;
  };

  return service;
}])

// filters
.filter('to_trusted', [ '$sce', function($sce) {
  return function(text) {
      return $sce.trustAsHtml(text);
  };
}])

// controllers
.controller('mainCtrl', [ '$scope', 'mainSvc',

  function($scope, mainSvc) {

    const editor = mainSvc.initEditor();
    let lastChecked = '';

    /**
     * for clearing all displays
     */
    $scope.clear = function()
    {
      editor.setValue('');
      $scope.output = '';
      $scope.error = '';
      editor.focus();
    };

    /**
     * submit a query to the backend
     */
    const submit = function(input)
    {
      mainSvc.getParsed(input)
        .then(r => {
          if ($scope.output !== r.data && input === lastChecked) {
            $scope.error = '';
            $scope.output = r.data;
          }
        })
        .catch(err => {
          const toDisplay = err.data.message.replace(/\n/gim, '<br>');
          if ($scope.error !== toDisplay && input === lastChecked) {
            $scope.output = '';
            $scope.error = toDisplay;
          }
        });
    };

    /**
     * handle editor change event and call submit if needed
     */
    editor.getSession().on('change', _.debounce(function() {

      const input = editor.getValue();
      if (input !== lastChecked) {
        lastChecked = input;
        submit(input);
      }

    }, 800));

    // set some default text & select it
    editor.setValue('\n\t', 1);
    editor.insert('knex.from(\'users\')');
    editor.findPrevious('knex.from(\'users\')');
    editor.focus();

  }

]);




