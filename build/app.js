(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var app = angular.module("searchStaff", ['ngTagsInput']);
app.controller("ctrl", function ($http, $scope) {
  var url = "https://someurl.com/api/v1/getUsers";
  $scope.selected = [];
  $scope.users = [];
  $scope.keywords = [];
  $scope.filteredUsers = [];
  $scope.formattedSelected = {};

  $scope.addingTag = function (tag) {
    $scope.formattedSelected[tag.name] = $scope.formattedSelected[tag.name] || [];
    $scope.formattedSelected[tag.name].push(tag.value);

    return true;
  };

  $scope.removingTag = function (tag) {
    var index = $scope.formattedSelected[tag.name].indexOf(tag.value);
    if (index !== -1) {
      $scope.formattedSelected[tag.name].splice(index, 1);
    }

    return true;
  };

  $scope.updateSearchQuery = function () {

    var users = angular.copy($scope.users);

    $scope.filteredUsers = users.filter(function (user) {
      var match = true;

      for (var key in $scope.formattedSelected) {
        if (!$scope.formattedSelected.hasOwnProperty(key)) continue;

        var prop = $scope.formattedSelected[key];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = prop[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var propItem = _step.value;

            var userProp = user[key];
            if (Array.isArray(userProp)) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = userProp[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var userPropItem = _step2.value;

                  if (userPropItem.name.toLowerCase() === propItem.toLowerCase()) {
                    match = true;
                    break;
                  } else {
                    match = false;
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            } else {
              if (propItem === userProp) {
                match = true;
                break;
              } else {
                match = false;
              }
            }

            if (match === false) {
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (match === false) break;
      }

      return match;
    });
  };

  $scope.autocomplete = function (query) {
    var keywords = angular.copy($scope.keywords);
    console.log(query);
    if (query === '') {
      return keywords;
    }

    var filtered = keywords.filter(function (keyword) {
      return keyword.value.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return filtered;
  };

  $http.get('users.json').then(function (result) {
    $scope.users = result.data;
  });

  $http.get('keywords.json').then(function (result) {
    return result.data;
  }).then(function (result) {
    for (var key in result) {
      result[key].forEach(function (value) {
        $scope.keywords.push({
          name: key,
          value: value
        });
      });
    }
  });
});

},{}]},{},[1]);
