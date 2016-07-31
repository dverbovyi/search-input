(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = function () {
    function AppController($http, $filter, SearchService) {
        _classCallCheck(this, AppController);

        this.$http = $http;
        this.$filter = $filter;
        this.searchService = SearchService;
        this.selected = [];
        this.employees = [];
        this.keywords = [];
        this.matchedPeople = [];
        this.tagsMap = {};

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
                var result = response.data;
                for (var key in result) {
                    if (!result.hasOwnProperty(key)) continue;

                    result[key].forEach(function (element) {
                        _this.keywords.push({
                            name: key,
                            value: element
                        });
                    });
                }

                console.log(_this.keywords);
            });
        }
    }, {
        key: 'addTag',
        value: function addTag(tag) {
            var entity = this.tagsMap[tag.name];
            console.log(tag);

            if (!entity) entity = this.tagsMap[tag.name] = [];

            this.tagsMap[tag.name].push(tag.value);
        }
    }, {
        key: 'removeTag',
        value: function removeTag(tag) {
            var index = this.tagsMap[tag.name].indexOf(tag.value);

            if (index + 1) {
                this.tagsMap[tag.name].splice(index, 1);
            }
        }
    }, {
        key: 'applyFilter',
        value: function applyFilter(name, context) {
            return this.$filter(name.toLowerCase)(context.source, context.target);
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
            }

            return hasMatch;
        }
    }, {
        key: 'updateSearchQuery',
        value: function updateSearchQuery() {
            var _employees = angular.copy(this.employees);
            this.matchedPeople = _employees.filter(this.employeeFilter.bind(this));

            console.log(this.matchedPeople);
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
    }]);

    return AppController;
}();

AppController.$inject = ['$http', '$filter', 'SearchService'];

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
        return (0, _index.testTags)(grades, function (value) {
            return target.grade.toUpperCase() === value.toUpperCase();
        });
    };
}

},{"./index":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = applyFilters;
exports.testTags = testTags;

var _skills = require('./skills');

var _location = require('./location');

var _grade = require('./grade');

function applyFilters(module) {
    module.filter('skills', _skills.skillsFilter).filter('location', _location.locationFilter).filter('grade', _grade.gradeFilter);
}

function testTags(tags, compare) {
    var test = true;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var value = _step.value;

            test = compare(value);

            if (!test) return false;
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
        return (0, _index.testTags)(locations, function (value) {
            return target.location.toUpperCase() === value.toUpperCase();
        });
    };
}

},{"./index":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.skillsFilter = skillsFilter;

var _index = require('./index');

function skillsFilter() {
    return function (skills, target) {
        return (0, _index.testTags)(skills, function (value) {
            return !!target.skills.find(function (skill) {
                return skill.name === value;
            });
        });
    };
}

},{"./index":4}],7:[function(require,module,exports){
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
            return this.$http.get('./users.json');
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
