var myApp = angular.module('myApp',['cgBusy', 'ngRoute', 'ngDropdowns', 'ngDialog']);

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
        .when('/webconsole', {
          templateUrl : 'template/webconsole.html',
          controller  : 'webconsoleController',
          activetab : 'webconsole'
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
        var urlpathdev = apiURL + searchTerm
        console.log(urlpathdev);
        // console.log(urlpath);
        return $http({
            method: 'GET',
            url: urlpathdev
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
  $scope.searchTerm = "CCPTOR20-REDHAT-RTR-1"

  //event listeners

  var vhid = "";

	$scope.search = function (cpe){
    console.log($route.current.activetab);
		// console.log("beep")
    // var firstPromise = searchService.getData("/api/v1/nms/vhid/", cpe)
		$scope.promise = searchService.getData("/api/v1/nms/vhid/", cpe).then(function(dataResponse) {
			console.log(dataResponse.data);
      if(dataResponse.data){
        // console.log(dataResponse.data.nercs.length)
        console.log(dataResponse.data.vcid)
        $scope.customer = dataResponse.data.customer_info;
        $scope.hardware = dataResponse.data.hardware;
        var nerc_arr = [];
        var oob_arr = [];
        var maint_arr = [];
        var vcid_arr = [];
        var comment_arr = [];
        try {
          $.each(dataResponse.data.nercs, function(key, value){
            nerc_arr.push(this);
            // console.log(this)
          });
        }catch (e){
          // console.log(e);
        }

        try {
          $.each(dataResponse.data.vcid, function(key, value){
            vcid_arr.push(this);
            // console.log(this)
          });
        }catch (e){
          // console.log(e);
        }

        try {
          $.each(dataResponse.data.comments, function(key, value){
            comment_arr.push(this);
            // console.log(this)
          });
        }catch (e){
          // console.log(e);
        }

        try {
          $.each(dataResponse.data.oob, function(key, value){
            oob_arr.push(this);
            // console.log(this)
          });
        }catch (e){

        }

        try {
          $.each(dataResponse.data.maintainence_tickets, function(key, value){
            maint_arr.push(this);
            // console.log(this)
          });
        }catch (e) {

        }

        $scope.oob = oob_arr;
        $scope.nerc = nerc_arr;
        $scope.maintenance = maint_arr;
        $scope.circuits = vcid_arr;
        $scope.comments = comment_arr;
        // var escal = "";
        // escal+=dataResponse.data.escalation_text;
        // $scope.escalation = escal.replace(/(?:\r\n|\r|\n)/g, '<br />');

        $scope.escalation = dataResponse.data.escalation_text;

        /* assign result to a main object in $scope then access through the controllers via
           $scope.mainObj.property
        */

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
    // $scope.circuits = dashboardObj.circuit;
    // $scope.comments = dashboardObj.comments;
    // $scope.oob = dashboardObj.oob;
    // $scope.ifData = dashboardObj.interface;
    // $scope.hardware = dashboardObj.hardware;
    // $scope.nerc = dashboardObj.nerc;
    $(".panel-container").removeClass("panel-open");  
	}

  $scope.handle = function (){
    console.log("woot");
  }

});

myApp.controller('commentController', function($scope, ngDialog) {
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
    console.log("comment handle");
    ngDialog.open({ template: 'templateId', className: 'ngdialog-theme-default'});
  }
});

myApp.controller('nercController', function($scope, ngDialog) {
  $scope.handle = function (){
    console.log("nerc handle");
    ngDialog.open({ template: 'nercExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

myApp.controller('escalController', function($scope, ngDialog) {
  $scope.handle = function (){
    console.log("escal handle");
    ngDialog.open({ template: 'escalationExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

myApp.controller('webconsoleController', function($scope, $route) {
    $scope.$route = $route;

    /*
      there will have to be two actions to load the data for the entire dashboard

      first, if on web console and vhid is exact search, then load data immediately
      second, if partial search load only happens when the actual vhid from results is clicked
      
      in both cases, do not attach promise tracker to dashboard call; sort of "lazy load" it
      in the background regardless of webconsole results;


    */
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
