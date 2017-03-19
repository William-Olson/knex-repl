//  Knex-Repl AngularJs App

/**
 * editor themes
 */
const aceThemes = [
  'ambiance','chaos','chrome','clouds','clouds_midnight',
  'cobalt','crimson_editor','dawn','dreamweaver','eclipse',
  'github','idle_fingers','iplastic','katzenmilch','kr_theme',
  'kuroir','merbivore','merbivore_soft','mono_industrial',
  'monokai','pastel_on_dark','solarized_dark','solarized_light',
  'sqlserver','terminal','textmate','tomorrow','tomorrow_night',
  'tomorrow_night_blue','tomorrow_night_bright',
  'tomorrow_night_eighties','twilight','vibrant_ink', 'xcode'
];


const iife = `
(function() {

  const sql = q => q
    .from('ballers')


  // // flow example:
  // const sel = q => q.select('id');
  // return flow(sql, sel)(knex);

  return sql(knex);

}());
`;

/**
 * mainCtrl
 *
 *  handles parsing editor input and displaying results
 */
function mainCtrl($scope, editorSvc)
{
  function submit(input)
  {
    editorSvc.parse(input).then(r => {
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
  }

  function clear()
  {
    $scope.output = '';
    $scope.error = '';
    editorSvc.clear();
  }

  function setTheme()
  {
    editorSvc.selectTheme($scope.currentTheme);
  }

  editorSvc.init().onChange(submit);
  editorSvc.setDefaultText('knex.from(\'users\')');

  $scope.clear = clear;
  $scope.themes = aceThemes;
  $scope.currentTheme = editorSvc.currentTheme();
  $scope.setTheme = setTheme;
  $scope.getCode = editorSvc.getInput;
  $scope.selectAll = editorSvc.selectAll;
  $scope.insertIife = editorSvc.insertIife;
  $scope.focus = editorSvc.focus;

}


/**
 * editorSvc
 *
 *  provides methods for interaction with the ace editor
 *  as well as http methods for sending input to the backend
 *  to be parsed etc.
 *
 *  note: editorSvc uses the term ref to represent a state of
 *   the editor (stored as the input with whitespace stripped).
 *
 *   editorSvc._lastRef is the current ref state of the editor.
 *
 *   the purpose of tracking _lastRef is to avoid extra calls to
 *   the server when only whitespace has changed in the editor
 *   input.
 */
function editorSvc($http, $rootScope, $localStorage)
{
  const service = { _lastRef: null };
  const EDITOR_DEBOUNCE = 360;

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

    // use cached data / set defaults
    $rootScope.config = $localStorage.$default({
        theme: aceThemes[0],
        lastText: ''
    });

    service._editor = ace.edit('editor');
    service._editor.setTheme('ace/theme/' + $rootScope.config.theme);
    service._editor.getSession().setMode('ace/mode/javascript');
    service._editor.getSession().setTabSize(2);
    service._editor.getSession().setUseSoftTabs(true);

    // init clipboards
    service._codeClp = new Clipboard('.cp-code');
    service._sqlClp = new Clipboard('.cp-sql');
    return service;
  };

  service.selectTheme = function(theme) {
    if ($rootScope.config.theme !== theme) {
      $rootScope.config.theme = theme;
    }
    service._editor.setTheme('ace/theme/' + theme);
  };

  service.currentTheme = function() {
    return $rootScope.config.theme;
  };

  service.setDefaultText = function(text) {
    if ($rootScope.config.lastText) {
      service._editor.setValue($rootScope.config.lastText);
    }
    else {
      service._editor.setValue('\n\t', 1);
      service._editor.insert(text);
      service._editor.findPrevious(text);
    }
    service._editor.focus();
    return service;
  };

  service.clear = function() {
    service._editor.setValue('');
    service._editor.focus();
    return service;
  };

  service.insertIife = function() {
    service.clear();
    service._editor.insert(iife);
    service._editor.findPrevious('ballers');
    service._editor.focus();
  };

  service.getInput = function() {
    return service._editor.getValue().trim();
  };

  service.focus = function(ms = 200) {
    return _.debounce(function() {
      service._editor.focus();
    }, ms)();
  };

  service.selectAll = function() {
    const txt = service._editor.getValue().trim();
    service._editor.findPrevious(txt);
    service._editor.focus();
  };

  service.onChange = function(fn, optDebounceMs) {
    service._editor.getSession().on('change', _.debounce(function() {
        const input = service._editor.getValue();
        const ref = service.getRef(input);

        if (ref !== service._lastRef) {
          service._lastRef = ref;
          $rootScope.config.lastText = input;
          fn(input, ref);
        }

      }, optDebounceMs || EDITOR_DEBOUNCE));
      return service;
  };

  return service;
}


/**
 * simple filter to trust the html we bind to err div
 */
function toTrusted($sce)
{
  return function(text) {
      return $sce.trustAsHtml(text);
  };
}


/**
 * angular initialization stuff
 */
angular.module('knexrepl', [ 'ngStorage' ])
  .service('editorSvc', [ '$http', '$rootScope', '$localStorage', editorSvc ])
  .filter('to_trusted', [ '$sce', toTrusted ])
  .controller('mainCtrl', [ '$scope', 'editorSvc', mainCtrl ]);

