class SearchService {
    constructor($http){
        this.$http = $http;
    }

    getEmployees() {
        return this.$http.get('./users.json');
    }

    getKeywords() {
        return this.$http.get('./keywords.json');
    }
}

SearchService.$inject = ['$http'];

export default SearchService;