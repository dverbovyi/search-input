import AppController from './app.controller';
import SearchService from './search.service';
import applyFilters from './filters';

let module = angular.module("searchStaff", ['ngTagsInput']);

module
  .controller('AppController', AppController)
  .service('SearchService', SearchService);

  applyFilters(module);
