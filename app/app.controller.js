import { getCompetenceTitleByLevel } from './filters';
import sliderConfig from './slider.config';
import TagStorage from './tags.storage';

class AppController {
    constructor($http, $filter, SearchService) {
        this.$http = $http;
        this.$filter = $filter;
        this.searchService = SearchService;
        this.tagStorage = new TagStorage();
        this.selected = [];
        this.keywords = [];
        this.showTags = false;
        this.anySkills = false;

        this.sliderConfig = angular.merge(sliderConfig, {
            translate: getCompetenceTitleByLevel,
            onChange: this.updateSearchQuery.bind(this)
        });

        this.initialize();
    }

    initialize() {
        this.searchService.getEmployees()
            .then(result => this.employees = result.data);

        this.searchService.getKeywords()
            .then(response => {
                this.fields = response.data;
                this.prepareKeyWords();
            });
    }

    prepareKeyWords() {
        for (var key in this.fields) {
            if (!this.fields.hasOwnProperty(key))
                continue;
                
            this.fields[key].forEach(element => {
                this.keywords.push({
                    name: key,
                    value: element
                });
            });
        }
    }

    addTag(tag) {
        this.tagStorage.add(tag);
    }

    removeTag(tag) {
        this.tagStorage.remove(tag);
    }

    employeeFilter(employee) {
        let hasMatch = false,
            tags = this.tagStorage.records;

        for (let key in tags) {
            if (!tags.hasOwnProperty(key))
                continue;

            let filterName = key.toLowerCase(),
                value = tags[key];

            hasMatch = this.$filter(filterName)(value, employee);

            if (!hasMatch)
                break;
        }

        return hasMatch;
    }

    updateSearchQuery() {
        let _employees = angular.copy(this.employees);

        this.matchedPeople = _employees.filter(this.employeeFilter.bind(this));

        this.displaySkillsSetting();
    }

    autocomplete(query) {
        let _keywords = angular.copy(this.keywords);

        if (!query) {
            return _keywords;
        }

        return _keywords.filter(keyword => {
            return keyword.value.toLowerCase().indexOf(query.toLowerCase()) + 1;
        });
    }

    displayTags() {
        this.showTags = !this.showTags;
    }

    isSupportedFilter(filterName) {
        let support = true;

        try {
            this.$filter(filterName);
        } catch (e) {
            support = false;
        }

        return support;
    }

    isResultNotFound() {
        return this.tagStorage.isEmpty() && this.matchedPeople && !this.matchedPeople.length;
    }

    displaySkillsSetting(){
        let records = this.tagStorage.records;
        this.showSkillsSettings = records.skills && Object.keys(records.skills).length;
    }
}

AppController.$inject = ['$http', '$filter', 'SearchService'];

export default AppController;
