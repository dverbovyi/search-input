(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filters = require('./filters');

var _slider = require('./slider.config');

var _slider2 = _interopRequireDefault(_slider);

var _tags = require('./tags.storage');

var _tags2 = _interopRequireDefault(_tags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = function () {
    function AppController($http, $filter, SearchService) {
        _classCallCheck(this, AppController);

        this.$http = $http;
        this.$filter = $filter;
        this.searchService = SearchService;
        this.tagStorage = new _tags2.default();
        this.selected = [];
        this.keywords = [];
        this.showTags = false;
        this.anySkills = false;

        this.sliderConfig = angular.merge(_slider2.default, {
            translate: _filters.getCompetenceTitleByLevel,
            onChange: this.updateSearchQuery.bind(this)
        });

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
                _this.prepareKeyWords();
            });
        }
    }, {
        key: 'prepareKeyWords',
        value: function prepareKeyWords() {
            var _this2 = this;

            for (var key in this.fields) {
                if (!this.fields.hasOwnProperty(key)) continue;

                this.fields[key].forEach(function (element) {
                    _this2.keywords.push({
                        name: key,
                        value: element
                    });
                });
            }
        }
    }, {
        key: 'addTag',
        value: function addTag(tag) {
            this.tagStorage.add(tag);
        }
    }, {
        key: 'removeTag',
        value: function removeTag(tag) {
            this.tagStorage.remove(tag);
        }
    }, {
        key: 'employeeFilter',
        value: function employeeFilter(employee) {
            var hasMatch = false,
                tags = this.tagStorage.records;

            for (var key in tags) {
                if (!tags.hasOwnProperty(key)) continue;

                var filterName = key.toLowerCase(),
                    value = tags[key];

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

            this.displaySkillsSetting();
        }
    }, {
        key: 'autocomplete',
        value: function autocomplete(query) {
            var _keywords = angular.copy(this.keywords);

            if (!query) {
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
            return this.tagStorage.isEmpty() && this.matchedPeople && !this.matchedPeople.length;
        }
    }, {
        key: 'displaySkillsSetting',
        value: function displaySkillsSetting() {
            var records = this.tagStorage.records;
            this.showSkillsSettings = records.skills && Object.keys(records.skills).length;
        }
    }]);

    return AppController;
}();

AppController.$inject = ['$http', '$filter', 'SearchService'];

exports.default = AppController;

},{"./filters":4,"./slider.config":9,"./tags.storage":10}],2:[function(require,module,exports){
'use strict';

var _app = require('./app.controller');

var _app2 = _interopRequireDefault(_app);

var _search = require('./search.service');

var _search2 = _interopRequireDefault(_search);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = angular.module("searchStaff", ['ngTagsInput', 'rzModule']);

_module.controller('AppController', _app2.default).service('SearchService', _search2.default);

(0, _filters2.default)(_module);

},{"./app.controller":1,"./filters":4,"./search.service":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gradeFilter = gradeFilter;

var _index = require('./index');

function gradeFilter() {
    return (0, _index.getMatchPropertyFilter)(_index.FILTER_NAMES.GRADE);
}

},{"./index":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FILTER_NAMES = undefined;
exports.default = applyFilters;
exports.getMatchPropertyFilter = getMatchPropertyFilter;
exports.getCompetenceTitleByLevel = getCompetenceTitleByLevel;

var _skills = require('./skills');

var _location = require('./location');

var _grade = require('./grade');

var _position = require('./position');

function applyFilters(module) {
    module.filter('skills', _skills.skillsFilter).filter('location', _location.locationFilter).filter('grade', _grade.gradeFilter).filter('position', _position.positionFilter);
}

function getMatchPropertyFilter(prop) {
    return function (tags, target) {
        return !!(tags.indexOf(target[prop]) + 1);
    };
}

var FILTER_NAMES = exports.FILTER_NAMES = {
    LOCATION: 'location',
    SKILLS: 'skills',
    GRADE: 'grade',
    POSITION: 'position'
};

var SKILL_LEVEL = {
    NOVICE: 1,
    COMPETENT: 2,
    ADVANCED: 3,
    MASTER: 4,
    EXPERT: 5
};

function getCompetenceTitleByLevel(level) {
    var title = void 0;

    switch (level) {
        case SKILL_LEVEL.NOVICE:
            title = 'Novice';
            break;
        case SKILL_LEVEL.COMPETENT:
            title = 'Competent';
            break;
        case SKILL_LEVEL.ADVANCED:
            title = 'Advanced';
            break;
        case SKILL_LEVEL.MASTER:
            title = 'Master';
            break;
        case SKILL_LEVEL.EXPERT:
            title = 'Expert';
            break;
        default:
            console.error('Unknow competence level: ' + level);
    }

    return title;
}

},{"./grade":3,"./location":5,"./position":6,"./skills":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.locationFilter = locationFilter;

var _index = require('./index');

function locationFilter() {
    return (0, _index.getMatchPropertyFilter)(_index.FILTER_NAMES.LOCATION);
}

},{"./index":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.positionFilter = positionFilter;

var _index = require('./index');

function positionFilter() {
    return (0, _index.getMatchPropertyFilter)(_index.FILTER_NAMES.POSITION);
}

},{"./index":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.skillsFilter = skillsFilter;
function skillsFilter() {
    return function (skills, target) {
        var test = false;

        var _loop = function _loop(skillName) {
            if (!skills.hasOwnProperty(skillName)) return "continue";

            var skillLevel = skills[skillName];

            test = !!target.skills.find(function (skill) {
                return skill.name === skillName && skill.level >= skillLevel;
            });

            if (!test) return {
                    v: false
                };
        };

        for (var skillName in skills) {
            var _ret = _loop(skillName);

            switch (_ret) {
                case "continue":
                    continue;

                default:
                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
            }
        }

        return test;
    };
}

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sliderConfig = {
    showTicksValues: true,
    floor: 1,
    ceil: 5,
    step: 1
};

exports.default = sliderConfig;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filters = require('./filters');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagStorage = function () {
    function TagStorage() {
        _classCallCheck(this, TagStorage);

        this.table = {};
    }

    _createClass(TagStorage, [{
        key: 'add',
        value: function add(tag) {
            this.execute('add', tag);
        }
    }, {
        key: 'remove',
        value: function remove(tag) {
            this.execute('remove', tag);
        }
    }, {
        key: 'execute',
        value: function execute(command, tag) {
            var storage = null;

            switch (tag.name) {
                case _filters.FILTER_NAMES.SKILLS:
                    ObjectStorage[command].call(this, tag, 1);
                    break;
                default:
                    ArrayStorage[command].call(this, tag);
                    break;
            }
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return !!Object.keys(this.records).length;
        }
    }, {
        key: 'records',
        get: function get() {
            return this.table;
        }
    }]);

    return TagStorage;
}();

exports.default = TagStorage;

var ObjectStorage = function () {
    function ObjectStorage() {
        _classCallCheck(this, ObjectStorage);
    }

    _createClass(ObjectStorage, null, [{
        key: 'add',
        value: function add(tag, defaultValue) {
            this.records[tag.name] = this.records[tag.name] || {};
            this.records[tag.name][tag.value] = defaultValue;
        }
    }, {
        key: 'remove',
        value: function remove(tag) {
            var record = this.records[tag.name];
            delete record[tag.value];

            if (!Object.keys(record).length) delete this.records[tag.name];
        }
    }]);

    return ObjectStorage;
}();

var ArrayStorage = function () {
    function ArrayStorage() {
        _classCallCheck(this, ArrayStorage);
    }

    _createClass(ArrayStorage, null, [{
        key: 'add',
        value: function add(tag) {
            this.records[tag.name] = this.records[tag.name] || [];
            this.records[tag.name].push(tag.value);
        }
    }, {
        key: 'remove',
        value: function remove(tag) {
            var record = this.records[tag.name],
                index = record.indexOf(tag.value);

            if (index === -1) return;

            record.splice(index, 1);

            if (!record.length) delete this.records[tag.name];
        }
    }]);

    return ArrayStorage;
}();

},{"./filters":4}]},{},[2]);
