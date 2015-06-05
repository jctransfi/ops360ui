var myApp = angular.module('myApp',['cgBusy', 'ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'template/pa.html',
            controller  : 'dashboardController'
        })

        .when('/tdm', {
            templateUrl : 'template/pa.html',
            controller  : 'dashboardController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'template/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'template/contact.html',
            controller  : 'contactController'
        });
});

myApp.service('dataService', function($http) {
	delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function(qString) {
	    // $http() returns a $promise that we can add handlers with .then()
        var urlpath = '/api/bears/'+qString.descr+'/'+qString.endt+'/'+qString.stdt+'/'+qString.vhid;
        console.log(urlpath);
	    return $http({
	        method: 'GET',
	        url: urlpath
	     });
	}
});

myApp.service('searchService', function($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function(apiURL, searchTerm) {
        // $http() returns a $promise that we can add handlers with .then()
        var urlpath = "http://dcoeng1-nmswebdev-1:8080" + apiURL + searchTerm
        console.log(urlpath);
        return $http({
            method: 'GET',
            url: urlpath
        });
    }
});

myApp.controller('aboutController', function($scope) {
    $scope.message = 'Ticket Suppression';
});

myApp.controller('contactController', function($scope) {
    $scope.message = 'Another Page';
});

myApp.controller('dashboardController', function($scope, searchService) {
    $scope.searchTerm = "CA-CAEDUB12-1"

    //event listeners


    var vhid = "";

  	$scope.search = function (cpe){
  		// console.log("beep")
      var firstPromise = searchService.getData("/api/v1/nms/vcid/", $scope.searchTerm)
  		$scope.promise = searchService.getData("/api/v1/nms/vcid/", $scope.searchTerm).then(function(dataResponse) {
  			console.log(dataResponse.data);
        if(dataResponse.data){
          $scope.circuit = dataResponse.data;
          console.log(typeof(dataResponse.data));
          vhid = dataResponse.data.ORIGVHID;
        }else{
          $(".panel-container").append("No Circuit Data");
        }
	    }).then(function() {
        searchService.getData("/api/v1/nms/vhid/", vhid).then(function(dataResponse) {
          console.log(typeof(dataResponse.data));
          if(dataResponse.data){
            $scope.ifData = dataResponse.data;
            $(".panel-container").removeClass("panel-open");  
          }else{
            $(".panel-container").append("No Circuit Data");   
          }
        });
      });
  	}

    // $scope.promise = dataService.getData(defQ).then(function(dataResponse) {
    // 	if(dataResponse.data._embedded){
    // 		$scope.stats = dataResponse.data._embedded.stats;
	   //      $scope.gridOptions.data = dataResponse.data._embedded.stats;
	   //      dataMassage(dataResponse.data._embedded.stats);
	   //      $scope.totals = dataSummary(dataResponse.data._embedded.stats);
	   //      // console.log(totals);
    // 	}else {
    // 		console.log("NO DATA");
    // 		// $scope.gridOptions = {};
    // 		// $scope.gridOptions.data = {};
    // 	}
    // });

});

$(".side-icon").on("click", function(){
  console.log('click')
  if($(".panel-container").hasClass("panel-open")){
    $(".panel-container").removeClass("panel-open");
  }else{
    $(".panel-container").addClass("panel-open");
  }
});

function totalArray(arr){
	var total = 0;
	$.each(arr,function() {
	    total += this;
	});

	return total;
}