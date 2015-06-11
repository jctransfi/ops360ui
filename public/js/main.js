var myApp = angular.module('myApp',['cgBusy', 'ngRoute', 'ngDropdowns']);

myApp.config(function($routeProvider) {
    // activetab variable allows for highlighting of 
    // current active navigational element
    $routeProvider
        // route for the home page
        .when('/dashboard', {
          templateUrl : 'template/pa.html',
          controller  : 'dashboardController',
          activetab : 'dashboard'
        })

        // route for the about page
        .when('/about', {
          templateUrl : 'template/about.html',
          controller  : 'aboutController',
          activetab : 'about'
        })

        // route for the contact page
        .when('/contact', {
          templateUrl : 'template/contact.html',
          controller  : 'contactController',
          activetab : 'contact'
        })

        .otherwise({
          redirectTo: '/dashboard'
        });;
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
        var urlpath = "http://172.16.92.73" + apiURL + searchTerm
        console.log(urlpath);
        return $http({
            method: 'GET',
            url: urlpath
        });
    }
});

myApp.controller('aboutController', function($scope, $route) {
    $scope.message = 'Ticket Suppression';
    $scope.$route = $route;
});

myApp.controller('contactController', function($scope, $route) {
    $scope.message = 'Another Page';
    $scope.$route = $route;
});

myApp.controller('dashboardController', function($scope, $route, searchService) {
  $scope.$route = $route;
  $scope.searchTerm = "CTWTAO9-NTT2989SONY-RTR-1"

  //event listeners


  var vhid = "";

	$scope.search = function (cpe){
		// console.log("beep")
    var firstPromise = searchService.getData("/api/v1/nms/vhid/", cpe)
		$scope.promise = searchService.getData("/api/v1/nms/vhid/", cpe).then(function(dataResponse) {
			console.log(dataResponse.data);
      if(dataResponse.data){
        console.log(dataResponse.data["customer-info"])
        $scope.customer = dataResponse.data["customer-info"];
      }else{
        // $(".panel-container").append("No Circuit Data");
      }
    });
    // .then(function() {
    //   searchService.getData("/api/v1/nms/vhid/", vhid).then(function(dataResponse) {
    //     console.log(typeof(dataResponse.data));
    //     if(dataResponse.data){
    //       // $scope.ifData = dataResponse.data;
    //       $scope.ifData = dashboardObj.interface;
    //       $(".panel-container").removeClass("panel-open");  
    //     }else{
    //       $(".panel-container").append("No Circuit Data");   
    //     }
    //   });
    // });
    $scope.circuits = dashboardObj.circuit;
    $scope.comments = dashboardObj.comments;
    $scope.oob = dashboardObj.oob;
    $scope.ifData = dashboardObj.interface;
    $scope.hardware = dashboardObj.hardware;
    $scope.nerc = dashboardObj.nerc;
    $(".panel-container").removeClass("panel-open");  
	}

  $scope.addComment = function (comment) {
    /* integration notes 
        DOM update happens on success handler of
        writing to DB
    */
    var now = moment().format("D-MMM-YY");
    var newcomment = { "date" : now , "comment" : comment, "user" : "JC Transfiguracion"}
    dashboardObj.comments.push(newcomment);
  }

  $scope.handle = function (){
    console.log("woot");
  }

  $scope.ddMenuOptions2 = [
    {
      name: 'Option2-1 Name',
      iconCls: 'someicon'
    }, {
      name: 'Option2-2 Name'
    }, {
      divider: true
    }, {
      name: 'A link',
      href: 'http://www.google.com'
    }
  ];

  $scope.ddMenuSelected2 = {};

});

myApp.controller('escalationController', function($scope) {
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