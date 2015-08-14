var myApp = angular.module('myApp',['cgBusy', 'ngRoute', 'ngDropdowns', 'ngDialog', 'ngAnimate']);

myApp.config(function($routeProvider) {
    // activetab variable allows for highlighting of 
    // current active navigational element
    // more discussion on http://stackoverflow.com/questions/12295983/set-active-tab-style-with-angularjs
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

// a formatter for dates stored or passed as plain strings.
// uses MomentJS for JS date formatting.
// pass the date string, the format of the stringified data
// and the desired date output format available in moment.
// TO DO: add default dateFormat if not specified
myApp.filter('momentdate', function() {
   return function(dateString, dateFormat, outputFormat) {
      var output = "";
      if(dateString == 'nil' || dateString == 'Unknown'){
        output = "Unknown";
      }else {
        output = moment(dateString, dateFormat).format(outputFormat);
      }

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

myApp.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          elem[0].focus();
        }
      });
   };
});

myApp.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
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

myApp.service('loginService', function($http) {
  delete $http.defaults.headers.common['X-Requested-With'];
  this.login = function(username, password, appid, ipaddress) {
      // $http() returns a $promise that we can add handlers with .then()
        var urlpath = 'http://dcoeng1-ncoptst-2:8080/VirtelaAccountWS/rest/account/v1.0/user/login';
        var urlpathprod = 'http://dcoeng1-ncopws-1.tnc.virtela.cc:8080/VirtelaAccountWS/rest/account/v1.0/user/login';
        console.log(urlpath);
      return $http({
        method: "post",
        url: urlpathprod,
        // transformRequest: transformRequestAsFormPost,
        data: {
          "username": username,
          "password": password,
          "applicationId": appid,
          "ipAddress": ipaddress
        }
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

myApp.controller('loginController', function($scope, $route, ngDialog, loginService) {
  // $scope.$route = $route;

  $scope.login = function (cpe){
    // call web service and pass un/pw

    $scope.userInfo = {};

    loginService.login($scope.username, $scope.password, 25, "172.168.1.16").then(function(dataResponse) {
      console.log(dataResponse);
      console.log(dataResponse.data);
      $scope.userInfo = dataResponse.data;

      //set session
      sessionStorage.setItem("authToken", $scope.userInfo.securityToken);
      sessionStorage.setItem("firstName", $scope.userInfo.firstName);
      sessionStorage.setItem("lastName", $scope.userInfo.lastName);
      sessionStorage.setItem("email", $scope.userInfo.emailAddress);
      sessionStorage.setItem("role", "Super Admin");

      //TODO: also add cookie option

      $scope.$parent.fullname = $scope.userInfo.firstName + " " + $scope.userInfo.lastName;
      $scope.$parent.role = 'Super Admin';

      ngDialog.closeAll();
    }, function(error) {
      // Do something with the error if it fails
      console.log(error)
      console.log("an error occurred.");
      if(error.status === 406){
        $scope.login.error = "Your username or password is incorrect. Please check and try again.";
      }else{
        $scope.login.error = "An error " + error.status + ": " + error.statusText + " occured. Please try again.";  
      }
    });
  }
});



myApp.controller('initController', function($scope, $route, $filter, searchService, ngDialog, autosuggestService, loginService) {
  $scope.$route = $route;
  $scope.searchOpen = false;
  $scope.offCanvasOpen = false;
  // $scope.searchTerm = "CCPTOR20-REDHAT-RTR-1";

  $scope.useridentity = {
    "email" : sessionStorage.getItem("email"),
    "fname" : sessionStorage.getItem("firstName"),
    "lname" : sessionStorage.getItem("lastName")
  }

  mixpanel.identify($scope.useridentity.email); // eventually place this in the event handler of login
  mixpanel.people.set({
      "$first_name": $scope.useridentity.fname,
      "$last_name": $scope.useridentity.lname,
      "$role": "Super Admin"
  });

  $scope.initvars = {
    "histogram" : [],
    "vhidnow" : null
  }

  //Login check - turn this into a service for reusability
  if(sessionStorage.getItem('authToken')){
    //no op
    $scope.fullname = sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName");
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
    $scope.offCanvasOpen = true;
    console.log("openOC");
  }

  $scope.closeOffCanvas = function(){
    $scope.offCanvasOpen = false;
    console.log("closeOC");
  }

  var vhid = "";

	$scope.search = function (cpe, searchLoc){
    console.log($route.current.activetab);
    var cleanStr = "";
    cleanStr += cpe;
		// console.log("beep")
    mixpanel.track("Search", {
    "Search Type": searchLoc,
    "ID": cleanStr
    });
    if($route.current.activetab == 'dashboard'){
      $scope.promise = searchService.getData("/api/v1/nms/dashboard/vhid/", cleanStr.trim()).then(function(dataResponse, responseError) {
        console.log("Calling DASHBOARD data");
        console.log(dataResponse);
        console.log(responseError);
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
            $scope.selectedVHID = cleanStr;
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

          mixpanel.track("Data Loaded", {
              "Screen": "Dashboard",
              "Search Type": searchLoc,
              "ID": cleanStr
          });


          /* assign result to a main object in $scope then access through the controllers via
             $scope.mainObj.property
          */
        }else if(dataResponse.data.Error === "Invalid vhid") {
          // alert("Invalid VHID");
          $scope.errormsg = "The VHID you are trying to load is either invalid or no data was avaiable. You can try again or search for a different device.";
          mixpanel.track("Error", {
              "Screen": "Dashboard",
              "ID": cleanStr,
              "Search Type": searchLoc,
              "Error Type": "Invalid VHID"
          });
          ngDialog.open({ 
            template: 'errorTemplate', 
            className: 'ngdialog-theme-error',
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
      }, function(error) {
        // Do something with the error if it fails
        console.log(error)
        console.log("an error occurred.");
        $scope.errormsg = "An error " + error.status + ": " + error.statusText + " occured. Please try again.";
        mixpanel.track("Error", {
            "Screen": "Dashboard",
            "ID": cleanStr,
            "Search Type": searchLoc,
            "Error Type": "Server Error",
            "Error Code": error.status
        });
        ngDialog.open({ 
          template: 'errorTemplate', 
          className: 'ngdialog-theme-error',
          scope: $scope
        });       
      });
    }else if($route.current.activetab == 'webconsole'){
      console.log("Calling WEB CONSOLE data");
      var strset = cleanStr.trim();
      $scope.promise = searchService.getData("/api/v1/nms/wc/vhid/", cleanStr.trim()).then(function(dataResponse, responseError) {
        console.log(dataResponse);
        console.log(responseError);
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

          if($scope.intinfo.last_transition_time !== 'Unknown'){
            $scope.intinfo.lastTransition = moment(dataResponse.data.info.last_transition_time, "YYYY-MM-DD HH:mm:ss ZZ").format("d-MMM-YY HH:mm:ss ZZ");
          }else{
            $scope.intinfo.lastTransition = "Unknown"
          }

          mixpanel.track("Data Loaded", {
              "Screen": "Web Console",
              "Search Type": searchLoc,
              "ID": cleanStr
          });
        }else if(dataResponse.data.Error === "Invalid vhid") {
          // alert("Invalid VHID");
          $scope.errormsg = "This device does not appear to be monitored by NG-NMS.";
          mixpanel.track("Error", {
              "Screen": "Dashboard",
              "ID": cleanStr,
              "Search Type": searchLoc,
              "Error Type": "Invalid VHID"
          });
          ngDialog.open({ 
            template: 'errorTemplate', 
            className: 'ngdialog-theme-error',
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
      }, function(error) {
        // Do something with the error if it fails
        console.log(error)
        console.log("an error occurred.");
        $scope.errormsg = "An error " + error.status + ": " + error.statusText + " occured. Please try again.";
        mixpanel.track("Error", {
            "Screen": "Dashboard",
            "ID": cleanStr,
            "Search Type": searchLoc,
            "Error Type": "Server Error",
            "Error Code": error.status
        });
        ngDialog.open({ 
          template: 'errorTemplate', 
          className: 'ngdialog-theme-error',
          scope: $scope
        });       
      });
    }
  
    console.log("Current VHID:" + $scope.initvars.vhidnow)
    console.log($scope.initvars.histogram)
    ngDialog.closeAll();
    $scope.searchOpen = false;
    // $(".panel-container").removeClass("panel-open");
    // $(".cardui").removeClass("side-push");
    // $(".overlay").addClass("fade-out");


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
    $scope.$parent.search($scope.$parent.initvars.vhidnow, 'Dashboard On Load');
  }
  // $scope.search($scope.$parent.initvars.vhidnow)
});

myApp.controller('webconsoleController', function($scope, $route, $filter, searchService) {
    $scope.$route = $route;
    // console.log($scope.$parent.initvars);
    if($scope.$parent.initvars.vhidnow != null) {
      $scope.$parent.search($scope.$parent.initvars.vhidnow, 'WC On Load');
    }

    /*
      there will have to be two actions to load the data for the entire dashboard

      first, if on web console and vhid is exact search, then load data immediately
      second, if partial search load only happens when the actual vhid from results is clicked
      
      in both cases, do not attach promise tracker to dashboard call; sort of "lazy load" it
      in the background regardless of webconsole results;


    */
});

/* sidebar controllers */

myApp.controller('searchPanelCtrl', function($scope, ngDialog) {
  $scope.openSearch = function (){
    console.log("search panel");

    if($scope.$parent.searchOpen == false){
      $scope.$parent.searchOpen = true;
      console.log("woot");
    }else{
      $scope.$parent.searchOpen = false;
      console.log("no woot");
    }
    
    // if($("#searchPane").hasClass("panel-open")){
    //   $("#searchPane").removeClass("panel-open");
    //   // $(".cardui").removeClass("side-push");
    //   $(".overlay").addClass("fade-out");
    // }else{
    //   $(".panel-container").removeClass("panel-open");
    //   $("#searchPane").addClass("panel-open");
    //   // $(".cardui").addClass("side-push");
    //   $(".overlay").removeClass("fade-out");
    // }

  }
});

myApp.controller('alarmPanelCtrl', function($scope, ngDialog) {
  $scope.openAlarm = function (){
    $scope.panelIsOpen = true;

    console.log("alarm panel");
    
    if($("#alarmPane").hasClass("panel-open")){
      $("#alarmPane").removeClass("panel-open");
      // $(".cardui").removeClass("side-push");
      $(".overlay").addClass("fade-out");
    }else{
      $(".panel-container").removeClass("panel-open");
      $("#alarmPane").addClass("panel-open");
      // $(".cardui").addClass("side-push");
      $(".overlay").removeClass("fade-out");
    }

  }
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
    mixpanel.track("Expand", {
      "Dialog": "NERC"
    });
    ngDialog.open({ template: 'nercExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

myApp.controller('escalController', function($scope, ngDialog) {
  $scope.handle = function (){
    console.log("escal handle");
    mixpanel.track("Expand", {
      "Dialog": "Escalation"
    });
    ngDialog.open({ template: 'escalationExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

myApp.controller('ticketController', function($scope, ngDialog) {
  $scope.handle = function (){
    console.log("tix handle");
    mixpanel.track("Expand", {
      "Dialog": "Tickets"
    });
    ngDialog.open({ template: 'ticketsExpand', className: 'ngdialog-theme-webconsole', scope: $scope.$parent });
  }
});

myApp.controller('wcintController', function($scope, ngDialog) {
  $scope.sortType     = 'ifindex'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.handle = function (){
    console.log("interface web console handle");
    mixpanel.track("Expand", {
      "Dialog": "Device Information"
    });
          //     ngDialog.open({ 
          //   template: 'template/srp.html', 
          //   className: 'ngdialog-theme-default',
          //   scope: $scope
          // });
    ngDialog.open({ template: 'template/interface-details.html', className: 'ngdialog-theme-webconsole', scope: $scope.$parent });
  }
});

myApp.controller('locsummaryController', function($scope, ngDialog) {
  $scope.sortType     = 'vhid'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.handle = function (){
    console.log("interface web console handle");
    mixpanel.track("Expand", {
      "Dialog": "Location Summary"
    });
    ngDialog.open({ template: 'locationExpand', className: 'ngdialog-theme-default', scope: $scope.$parent });
  }
});

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