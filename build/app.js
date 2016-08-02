(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = function () {
    function AppController($http, $filter, $timeout, SearchService) {
        _classCallCheck(this, AppController);

        this.$http = $http;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.searchService = SearchService;
        this.selected = [];
        this.keywords = [];
        this.tagsMap = {};
        this.showTags = false;

        this.initialize();
    }

    _createClass(AppController, [{
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            this.searchService.getEmployees().then(function (result) {
                return _this.employees = result.data;
            });

            this.searchService.getKeywords().then(function (response) {
                _this.fields = response.data;
                for (var key in _this.fields) {
                    if (!_this.fields.hasOwnProperty(key)) continue;

                    _this.fields[key].forEach(function (element) {
                        _this.keywords.push({
                            name: key,
                            value: element
                        });
                    });
                }
            });
        }
    }, {
        key: 'addTag',
        value: function addTag(tag) {
            var entity = this.tagsMap[tag.name];

            if (!entity) entity = this.tagsMap[tag.name] = [];

            this.tagsMap[tag.name].push(tag.value);
        }
    }, {
        key: 'removeTag',
        value: function removeTag(tag) {
            var index = this.tagsMap[tag.name].indexOf(tag.value);

            if (index == -1) return;

            this.tagsMap[tag.name].splice(index, 1);

            if (!this.tagsMap[tag.name].length) delete this.tagsMap[tag.name];
        }
    }, {
        key: 'employeeFilter',
        value: function employeeFilter(employee) {
            var hasMatch = false;

            for (var key in this.tagsMap) {
                if (!this.tagsMap.hasOwnProperty(key)) continue;

                var filterName = key.toLowerCase(),
                    value = this.tagsMap[key];

                hasMatch = this.$filter(filterName)(value, employee);

                if (!hasMatch) break;
            }

            return hasMatch;
        }
    }, {
        key: 'updateSearchQuery',
        value: function updateSearchQuery() {
            var _employees = angular.copy(this.employees);

            this.matchedPeople = _employees.filter(this.employeeFilter.bind(this));
        }
    }, {
        key: 'autocomplete',
        value: function autocomplete(query) {
            var _keywords = angular.copy(this.keywords);

            if (query === '') {
                return _keywords;
            }

            return _keywords.filter(function (keyword) {
                return keyword.value.toLowerCase().indexOf(query.toLowerCase()) + 1;
            });
        }
    }, {
        key: 'displayTags',
        value: function displayTags() {
            this.showTags = !this.showTags;
        }
    }, {
        key: 'isSupportedFilter',
        value: function isSupportedFilter(filterName) {
            var support = true;

            try {
                this.$filter(filterName);
            } catch (e) {
                support = false;
            }

            return support;
        }
    }, {
        key: 'isResultNotFound',
        value: function isResultNotFound() {
            return Object.keys(this.tagsMap).length && this.matchedPeople && !this.matchedPeople.length;
        }
    }]);

    return AppController;
}();

AppController.$inject = ['$http', '$filter', '$timeout', 'SearchService'];

exports.default = AppController;

},{}],2:[function(require,module,exports){
'use strict';

var _app = require('./app.controller');

var _app2 = _interopRequireDefault(_app);

var _search = require('./search.service');

var _search2 = _interopRequireDefault(_search);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = angular.module("searchStaff", ['ngTagsInput']);

_module.controller('AppController', _app2.default).service('SearchService', _search2.default);

(0, _filters2.default)(_module);

},{"./app.controller":1,"./filters":4,"./search.service":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gradeFilter = gradeFilter;

var _index = require('./index');

function gradeFilter() {
    return function (grades, target) {
        return !!(grades.indexOf(target.grade) + 1);
    };
}

},{"./index":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = applyFilters;

var _skills = require('./skills');

var _location = require('./location');

var _grade = require('./grade');

function applyFilters(module) {
    module.filter('skills', _skills.skillsFilter).filter('location', _location.locationFilter).filter('grade', _grade.gradeFilter);
}

},{"./grade":3,"./location":5,"./skills":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.locationFilter = locationFilter;

var _index = require('./index');

function locationFilter() {
    return function (locations, target) {
        return !!(locations.indexOf(target.location) + 1);
    };
}

},{"./index":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.skillsFilter = skillsFilter;
function skillsFilter() {
    return function (skills, target) {
        var test = false;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var value = _step.value;

                test = !!target.skills.find(function (skill) {
                    return skill.name === value; //TODO: level
                });

                if (!test) return {
                        v: false
                    };
            };

            for (var _iterator = skills[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ret = _loop();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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

        return test;
    };
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchService = function () {
    function SearchService($http) {
        _classCallCheck(this, SearchService);

        this.$http = $http;
    }

    _createClass(SearchService, [{
        key: 'getEmployees',
        value: function getEmployees() {
            return this.$http.get('./employees.json');
        }
    }, {
        key: 'getKeywords',
        value: function getKeywords() {
            return this.$http.get('./keywords.json');
        }
    }]);

    return SearchService;
}();

SearchService.$inject = ['$http'];

exports.default = SearchService;

},{}]},{},[2]);
