var app = angular.module("searchStaff", ['ngTagsInput']);
app.controller("ctrl", function($http, $scope) {
  var url = "https://someurl.com/api/v1/getUsers"
  $scope.selected = [];
  $scope.users = [];
  $scope.keywords = [];
  $scope.filteredUsers = [];
  $scope.formattedSelected = {}

  $scope.addingTag = function(tag) {
    $scope.formattedSelected[tag.name] = $scope.formattedSelected[tag.name] || [];
    $scope.formattedSelected[tag.name].push(tag.value);

    return true;
  }

  $scope.removingTag = function(tag) {
    var index = $scope.formattedSelected[tag.name].indexOf(tag.value);
    if(index !== -1) {
      $scope.formattedSelected[tag.name].splice(index, 1);
    }

    return true;
  }

  $scope.updateSearchQuery = function() {

      var users = angular.copy($scope.users);

      $scope.filteredUsers = users.filter(function(user){
        var match = true;

        for(const key in $scope.formattedSelected) {
          if(!$scope.formattedSelected.hasOwnProperty(key))
            continue;

          const prop = $scope.formattedSelected[key];

          for(const propItem of prop) {
            const userProp = user[key];
            if(Array.isArray(userProp)) {
              for(const userPropItem of userProp) {
                if(userPropItem.name.toLowerCase() === propItem.toLowerCase()) {
                    match = true;
                    break;
                } else {
                  match = false;
                }
              }
            } else {
              if(propItem === userProp) {
                match = true;
                break;
              } else {
                match = false;
              }
            }

            if(match === false){
              break;
            }
          }

          if(match === false)
            break;

        }

        return match;
      })
  }

  $scope.autocomplete = function(query) {
    var keywords = angular.copy($scope.keywords);
    console.log(query)
    if(query === '') {
      return keywords;
    }

    var filtered = keywords.filter(function(keyword){
      return keyword.value.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return filtered;
  }

  $http.get('users.json').then(function(result){
      $scope.users = result.data;
  })

  $http.get('keywords.json').then(function(result){
    return result.data;
  }).then(function(result){
    for(var key in result) {
      result[key].forEach(function(value) {
        $scope.keywords.push({
          name: key,
          value: value
        });
      });
    }
  });
});
