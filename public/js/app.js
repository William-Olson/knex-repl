
// init angular
angular.module('knexrepl', [ ])

// services
.service('editorSvc', [ '$http', function($http) {

  /**
   * Note:
   *  a ref is just a string with all whitespace stripped.
   *  service._lastRef is used to avoid excessive events
   *  (ie. when only whitespace or indentation change).
   */
  const service = { _lastRef: null };
  const EDITOR_DEBOUNCE = 420;

  service.parse = function(str) {
    return $http.post('/parse', { code: str });
  };

  service.getRef = function(str) {
    return str.replace(/\s|\n/gim, '');
  };

  service.hasSame = function(str) {
    const ref = service.getRef(str);
    return ref === service._lastRef;
  };

  service.init = function() {
    service._editor = ace.edit('editor');
    service._editor.setTheme('ace/theme/ambiance');
    service._editor.getSession().setMode('ace/mode/javascript');
    service._editor.getSession().setTabSize(2);
    service._editor.getSession().setUseSoftTabs(true);
    return service._editor;
  };

  service.setDefaultText = function(text) {
    service._editor.setValue('\n\t', 1);
    service._editor.insert(text);
    service._editor.findPrevious(text);
    service._editor.focus();
  };

  service.clear = function() {
    service._editor.setValue('');
    service._editor.focus();
  };

  service.onRefChange = function(fn, debounceTime) {
    service._editor.getSession().on('change', _.debounce(function() {
        const input = service._editor.getValue();
        const ref = service.getRef(input);

        if (ref !== service._lastRef) {
          service._lastRef = ref;
          fn(input, ref);
        }

      }, debounceTime || EDITOR_DEBOUNCE));
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
.controller('mainCtrl', [ '$scope', 'editorSvc', function($scope, editorSvc) {

    /**
     * for clearing all displays
     */
    $scope.clear = function()
    {
      $scope.output = '';
      $scope.error = '';
      editorSvc.clear();
    };

    /**
     * submit a query to the backend
     */
    const submit = function(input)
    {
      editorSvc.parse(input)
        .then(r => {
          if ($scope.output !== r.data && editorSvc.hasSame(input)) {
            $scope.error = '';
            $scope.output = r.data;
          }
        })
        .catch(err => {
          const toDisplay = err.data.message.replace(/\n/gim, '<br>');
          if ($scope.error !== toDisplay && editorSvc.hasSame(input)) {
            $scope.output = '';
            $scope.error = toDisplay;
          }
        });
    };

    /**
     * handle editor setup and change events
     */
    editorSvc.init();
    editorSvc.onRefChange(submit);
    editorSvc.setDefaultText('knex.from(\'users\')');
  }

]);




