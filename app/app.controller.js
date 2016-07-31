class AppController {
    constructor($http, $filter, SearchService) {
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

    initialize() {
        this.searchService.getEmployees()
            .then(result => this.employees = result.data);

        this.searchService.getKeywords()
            .then(response => {
                let result = response.data;
                for (var key in result) {
                    if (!result.hasOwnProperty(key))
                        continue;

                    result[key].forEach(element => {
                        this.keywords.push({
                            name: key,
                            value: element
                        });
                    });
                }

                console.log(this.keywords)
            })
    }

    addTag(tag) {
        let entity = this.tagsMap[tag.name];
        console.log(tag)

        if (!entity)
            entity = this.tagsMap[tag.name] = [];

        this.tagsMap[tag.name].push(tag.value);
    }

    removeTag(tag) {
        var index = this.tagsMap[tag.name].indexOf(tag.value);

        if (index + 1) {
            this.tagsMap[tag.name].splice(index, 1);
        }
    }

    applyFilter(name, context){
        return this.$filter(name.toLowerCase)(context.source, context.target);
    }

    employeeFilter(employee) {
        let hasMatch = false;

        for(let key in this.tagsMap){
            if(!this.tagsMap.hasOwnProperty(key))
                continue;

            let filterName = key.toLowerCase(),
                value = this.tagsMap[key];

            hasMatch = this.$filter(filterName)(value, employee);     
        }

        return hasMatch;
    }

    updateSearchQuery() {
        let _employees = angular.copy(this.employees);
        this.matchedPeople = _employees.filter(this.employeeFilter.bind(this));

        console.log(this.matchedPeople);
    }

    autocomplete(query) {
        let _keywords = angular.copy(this.keywords);

        if (query === '') {
            return _keywords;
        }

        return _keywords.filter(keyword => {
            return keyword.value.toLowerCase().indexOf(query.toLowerCase()) + 1;
        });
    }
}

AppController.$inject = ['$http', '$filter', 'SearchService'];

export default AppController;