class AppController {
    constructor($http, $filter, $timeout, SearchService) {
        this.$http = $http;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.searchService = SearchService;
        this.selected = [];
        this.keywords = [];
        this.tagsMap = {};
        this.showTags = false;
        this.anySkills = false;

        this.slider = {
          value: 1,
          options: {
            showTicksValues: true,
            floor: 1,
            ceil: 5,
            step: 1,
            translate: function(value) {
              let title;

              switch(value) {
                case 1:
                  title = 'Novice';
                  break;
                case 2:
                  title = 'Competent';
                  break;
                case 3:
                  title = 'Advanced';
                  break;
                case 4:
                  title = 'Master';
                  break;
                case 5:
                  title = 'Expert';
              }

              return title;
            },
            onChange: () => {
              this.updateSearchQuery();
            }
          }
        }

        this.initialize();
    }

    initialize() {
        this.searchService.getEmployees()
            .then(result => this.employees = result.data);

        this.searchService.getKeywords()
            .then(response => {
                this.fields = response.data;
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
            })
    }

    addTag(tag) {
        let type = tag.name === 'skills' ? {} : [];
        this.tagsMap[tag.name] = this.tagsMap[tag.name] || type;

        if(tag.name === 'skills') {
            this.tagsMap[tag.name][tag.value] = 1;
            this.anySkills = !!Object.keys(this.tagsMap['skills']).length;
        } else {
            this.tagsMap[tag.name].push(tag.value);
        } 
    }

    removeTag(tag) {
      if(tag.name === "skills") {
        delete this.tagsMap[tag.name][tag.value];
        this.anySkills = Object.keys(this.tagsMap[tag.name]).length !== 0;

        if(!Object.keys(this.tagsMap[tag.name]).length) {
          delete this.tagsMap[tag.name];
        }
      } else {
        var index = this.tagsMap[tag.name].indexOf(tag.value);

        if (index == -1)
            return;

        this.tagsMap[tag.name].splice(index, 1);

        if(!this.tagsMap[tag.name].length)
            delete this.tagsMap[tag.name];
      }

    }

    employeeFilter(employee) {
        let hasMatch = false;

        for(let key in this.tagsMap){
            if(!this.tagsMap.hasOwnProperty(key))
                continue;

            let filterName = key.toLowerCase(),
                value = this.tagsMap[key];

            hasMatch = this.$filter(filterName)(value, employee);

            if(!hasMatch)
                break;
        }

        return hasMatch;
    }

    updateSearchQuery() {
        let _employees = angular.copy(this.employees);

        this.matchedPeople = _employees.filter(this.employeeFilter.bind(this));
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

    displayTags(){
        this.showTags = !this.showTags;
    }

    isSupportedFilter(filterName){
        let support = true;

        try {
            this.$filter(filterName);
        } catch(e) {
            support = false;
        }

        return support;
    }

    isResultNotFound(){
        return Object.keys(this.tagsMap).length && this.matchedPeople && !this.matchedPeople.length;
    }
}

AppController.$inject = ['$http', '$filter', '$timeout', 'SearchService'];

export default AppController;
