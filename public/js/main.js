var myApp = angular.module('myApp',['cgBusy', 'ngRoute', 'ngDropdowns', 'ngDialog', 'ngAnimate']);

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

// check http://stackoverflow.com/questions/20222555/angularjs-remove-duplicate-elements-in-ng-repeat?lq=1
// for more discussion on this filter
myApp.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
});

myApp.directive('ngEnter', function () {
  // this directive is attribute to 
  // http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
  return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
          if(event.which === 13) {
              scope.$apply(function (){
                  scope.$eval(attrs.ngEnter);
              });

              event.preventDefault();
          }
      });
  };
});

myApp.service('deviceService', function($http) {
  delete $http.defaults.headers.common['X-Requested-With'];
  this.getData = function() {
      // $http() returns a $promise that we can add handlers with .then()
        var urlpath = '/api/v1/nms/wc/alldevices';
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

myApp.service('autosuggestService', function($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function(apiURL, searchTerm, limit) {
        // $http() returns a $promise that we can add handlers with .then()
        var urlpath = "http://172.16.92.73" + apiURL + searchTerm;
        var urlpathdev = apiURL + searchTerm + "/" + limit;
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

myApp.controller('loginController', function($scope, $route, ngDialog) {
  // $scope.$route = $route;
  $scope.login = function (cpe){
    // call web service and pass un/pw

    //set session
    sessionStorage.setItem("authToken", "authorized");
    sessionStorage.setItem("username", $scope.username);
    sessionStorage.setItem("role", "Super Admin");
    //TODO: also add cookie option

    $scope.$parent.fullname = $scope.username;
    $scope.$parent.role = 'Super Admin';

    ngDialog.closeAll();
  }
});

myApp.controller('initController', function($scope, $route, $filter, searchService, ngDialog, autosuggestService) {
  $scope.$route = $route;
  $scope.searchTerm = "CCPTOR20-REDHAT-RTR-1";

  mixpanel.identify("testuser"); // eventually place this in the event handler of login
  mixpanel.people.set({
      "$first_name": "Test",
      "$last_name": "User",
      "$role": "Super Admin"
  });

  $scope.initvars = {
    "histogram" : [],
    "vhidnow" : null
  }

  //Login check - turn this into a service for reusability
  if(sessionStorage.getItem('authToken')){
    //no op
    $scope.fullname = sessionStorage.getItem('username');
    $scope.role = sessionStorage.getItem('role');
  }else {
    ngDialog.open({ 
      template: 'template/login.html', 
      className: 'ngdialog-theme-login', 
      controller: 'loginController',
      closeByDocument: false,
      closeByEscape: false,
      showClose: false
    });
  }

  //event listeners

  $scope.openOffCanvas = function(){
    if($("#st-container").hasClass("st-menu-open") === true){
      $("#st-container").removeClass("st-menu-open");
      $("#st-container").removeClass("st-effect-9");
    }else{
      $("#st-container").addClass("st-menu-open");
      $("#st-container").addClass("st-effect-9");
    }
  }

  $scope.closeOffCanvas = function(){
    if($("#st-container").hasClass("st-menu-open") === true){
      $("#st-container").removeClass("st-effect-9");
      $("#st-container").removeClass("st-menu-open");
    }
  }

  var vhid = "";

	$scope.search = function (cpe){
    console.log($route.current.activetab);
    var cleanStr = "";
    cleanStr += cpe;
		// console.log("beep")
    mixpanel.track("Searched for " + cleanStr);
    if($route.current.activetab == 'dashboard'){
      $scope.promise = searchService.getData("/api/v1/nms/dashboard/vhid/", cleanStr.trim()).then(function(dataResponse) {
        console.log("Calling DASHBOARD data");
        console.log(dataResponse);
        console.log(dataResponse.data);
        var strset = cleanStr.trim();
        console.log("the clean string: " + strset);
        // console.log(hist_array);
        
        if(!dataResponse.data.Error){
          $scope.initvars.vhidnow = strset;
          var timenow = new Date();
          hist_obj = {"date": timenow, "vhid": strset};
          $scope.initvars.histogram.push(hist_obj);

          console.log("histogram length " + $scope.initvars.histogram.length);
          
          $scope.customer = dataResponse.data.customer_info;
          $scope.hardware = dataResponse.data.hardware;
          $scope.siteinfo = dataResponse.data.siteinfo;
          try {
            $scope.vhids = dataResponse.data.siteinfo.vhid;  
            console.log($scope.vhids);
          }catch(e){
            console.log("error fetching vhids")
          }

          var nerc_arr = [];
          var oob_arr = [];
          var maint_arr = [];
          var vcid_arr = [];
          var comment_arr = [];
          var interfaces_arr = [];

          //try-catch segment for data in arrays/collections
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
            console.log("VCID error");
          }

          try {
            $.each(dataResponse.data.comments, function(key, value){
              comment_arr.push(this);
              // console.log(this)
            });
          }catch (e){
            console.log("COMMENTS error");
          }

          try {
            $.each(dataResponse.data.oob, function(key, value){
              oob_arr.push(this);  
            });
          }catch (e){
            console.log("OOB error");
          }

          try {
            $.each(dataResponse.data.maintainence_tickets, function(key, value){
              maint_arr.push(this);
              // console.log(this)
            });
          }catch (e) {
            console.log("TICKETS error");
          }

          try {
            $.each(dataResponse.data.interfaces, function(key, value){
              interfaces_arr.push(this);
              // console.log(this)
            });
          }catch (e) {
            console.log("INTERFACES error");
          }

          $scope.oob = oob_arr;
          $scope.nerc = nerc_arr;
          $scope.maintenance = maint_arr;
          $scope.circuits = vcid_arr;
          $scope.comments = comment_arr;
          $scope.interfaces = interfaces_arr;

          $scope.escalation = dataResponse.data.escalation_text;


          /* assign result to a main object in $scope then access through the controllers via
             $scope.mainObj.property
          */
        }else if(dataResponse.data.Error === "Invalid vhid") {
          // alert("Invalid VHID");
          $scope.errormsg = "The VHID you are trying to load is either invalid or no data was avaiable. You can try again or search for a different device.";
          ngDialog.open({ 
            template: 'errorTemplate', 
            className: 'ngdialog-theme-default',
            scope: $scope
          });
        }else {
          // alert("Invalid VHID");
          //pop out search results page dialog by calling the autocomplete script without limits
          $scope.autosuggest('2000');
          ngDialog.open({ 
            template: 'template/srp.html', 
            className: 'ngdialog-theme-default',
            scope: $scope
          });
        }
      });
    }else if($route.current.activetab == 'webconsole'){
      console.log("Calling WEB CONSOLE data");
      var strset = cleanStr.trim();
      $scope.promise = searchService.getData("/api/v1/nms/wc/vhid/", cleanStr.trim()).then(function(dataResponse) {
        console.log(dataResponse);
        console.log(dataResponse.data);
        if(!dataResponse.data.Error){
          $scope.initvars.vhidnow = strset;
          var timenow = new Date();
          hist_obj = {"date": timenow, "vhid": strset};
          $scope.initvars.histogram.push(hist_obj);

          var intstatus_arr = [];
          var location_arr = [];

          //try-catch segment for data in arrays/collections
          try {
            $.each(dataResponse.data.intstatus, function(key, value){
              intstatus_arr.push(this);
              // console.log(this)
            });
          }catch (e){
            // console.log(e);
          }

          try {
            $.each(dataResponse.data.location, function(key, value){
              location_arr.push(this);
              // console.log(this)
            });
          }catch (e){
            console.log("location error");
          }

          $scope.interfacedevices = intstatus_arr;
          $scope.locations = location_arr;
          $scope.intinfo = dataResponse.data.info;
          $scope.intstatus = dataResponse.data.status;
        }else if(dataResponse.data.Error === "Invalid vhid") {
          // alert("Invalid VHID");
          $scope.errormsg = "This device does not appear to be monitored by NG-NMS.";
          ngDialog.open({ 
            template: 'errorTemplate', 
            className: 'ngdialog-theme-default',
            scope: $scope
          });
        }else {
          // alert("Invalid VHID");
          //pop out search results page dialog by calling the autocomplete script without limits
          $scope.autosuggest('2000');
          ngDialog.open({ 
            template: 'template/srp.html', 
            className: 'ngdialog-theme-default',
            scope: $scope
          });
        }
      });
    }
  
    console.log("Current VHID:" + $scope.initvars.vhidnow)
    console.log($scope.initvars.histogram)
    ngDialog.closeAll();
    $(".panel-container").removeClass("panel-open");
    $(".cardui").removeClass("push");
    $(".overlay").addClass("fade-out");


	}

  $scope.autosuggest = function (limit){
    var str = $scope.searchTerm.length;
    if(str > 2){
      $scope.aspromise = autosuggestService.getData("/api/v1/nms/search/vhid/", $scope.searchTerm, limit).then(function(dataResponse) {
        console.log(dataResponse);
        console.log(dataResponse.data);
        $scope.results = dataResponse.data;
        var tmp_obj = dataResponse.data;
        $scope.aslength = Object.keys(tmp_obj).length;
      });
    }
  }

  $scope.logout = function(){
    sessionStorage.clear();
    location.reload();
  }

});

myApp.controller('dashboardController', function($scope, $route, $filter, searchService) {
  $scope.$route = $route;
  console.log($scope.$parent.initvars);
  if($scope.$parent.initvars.vhidnow != null) {
    $scope.$parent.search($scope.$parent.initvars.vhidnow);
  }
  // $scope.search($scope.$parent.initvars.vhidnow)
});

myApp.controller('webconsoleController', function($scope, $route, $filter, searchService) {
    $scope.$route = $route;
    // console.log($scope.$parent.initvars);
    if($scope.$parent.initvars.vhidnow != null) {
      $scope.$parent.search($scope.$parent.initvars.vhidnow);
    }

    /*
      there will have to be two actions to load the data for the entire dashboard

      first, if on web console and vhid is exact search, then load data immediately
      second, if partial search load only happens when the actual vhid from results is clicked
      
      in both cases, do not attach promise tracker to dashboard call; sort of "lazy load" it
      in the background regardless of webconsole results;


    */
});

/* hanlde controllers */

myApp.controller('commentController', function($scope, ngDialog) {
  $scope.addComment = function (comment) {
    /* integration notes 
        DOM update happens on success handler of
        writing to DB
    */
    var now = moment().format("D-MMM-YY");
    var newcomment = { "date_added" : now , "comment" : comment, "user_name" : "JC Transfiguracion"};
    $scope.comments.push(newcomment);
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

myApp.controller('ticketController', function($scope, ngDialog) {
  $scope.handle = function (){
    console.log("tix handle");
    ngDialog.open({ template: 'ticketsExpand', className: 'ngdialog-theme-webconsole', scope: $scope.$parent });
  }
});

myApp.controller('wcintController', function($scope, ngDialog) {
  $scope.sortType     = 'ifindex'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.handle = function (){
    console.log("interface web console handle");
    ngDialog.open({ template: 'devicesExpand', className: 'ngdialog-theme-webconsole', scope: $scope.$parent });
  }
});

myApp.controller('locsummaryController', function($scope, ngDialog) {
  $scope.sortType     = 'vhid'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.handle = function (){
    console.log("interface web console handle");
    ngDialog.open({ template: 'locationExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

$(".side-icon").on("click", function(){
  console.log('click')
  if($(".panel-container").hasClass("panel-open")){
    $(".panel-container").removeClass("panel-open");
    $(".cardui").removeClass("push");
    $(".overlay").addClass("fade-out");
  }else{
    $(".panel-container").addClass("panel-open");
    $(".cardui").addClass("push");
    $(".overlay").removeClass("fade-out");
  }
});

// $(".st-content").on("click", function(){
//   if($("#st-container").hasClass("st-menu-open") === true){
//     $("#st-container").removeClass("st-menu-open");
//     $("#st-container").removeClass("st-effect-9");
//   }
// });

function totalArray(arr){
	var total = 0;
	$.each(arr,function() {
	    total += this;
	});

	return total;
}

function convertVHID(str){
  var expression = /[A-Z]+[0-9]+-([A-Z]+-)?[A-Z]+-[0-9]+/;
  // find the expression in the string first
  // and then match it again with a replacement
  var vhidster = str.match(expression);
  console.log(vhidster);
  var res = str.replace("")
}