var paApp = angular.module('paApp',['ui.grid', 'ui.grid.pagination','cgBusy', 'ngRoute', 'ngDialog', 'ngAnimate', 'scrollable-table','ui.grid.exporter']);

paApp.config(function($routeProvider) {
    // activetab variable allows for highlighting of 
    // current active navigational element
    // more discussion on http://stackoverflow.com/questions/12295983/set-active-tab-style-with-angularjs
    $routeProvider
        // route for the home page
        .when('/pa', {
          templateUrl : '../template/pa/pamain.html',
          controller  : 'paController',
          activetab : 'pamain'
        })

        // route for the about page
        .when('/pa/healthindex', {
          templateUrl : '../template/pa/healthindex.html',
          controller  : 'hiController',
          activetab : 'healthindex'
        })

        .otherwise({
          redirectTo: '/pa'
        });;
});

paApp.directive('ngEnter', function () {
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

paApp.service('dataService', function($http) {
  delete $http.defaults.headers.common['X-Requested-With'];
  this.getData = function(qString) {
      // $http() returns a $promise that we can add handlers with .then()
      var urlpath = '/bears/'+qString.descr+'/'+qString.endt+'/'+qString.stdt+'/'+qString.vhid;
      console.log(urlpath);
      return $http({
          method: 'GET',
          url: urlpath
       });
  }
});

paApp.service('loginService', function($http) {
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

paApp.controller('painitController', function($scope, $route, $filter, ngDialog, loginService,dataService, uiGridConstants) {
  $scope.$route = $route;
  $scope.searchOpen = false;
  $scope.offCanvasOpen = false;
  // $scope.searchTerm = "CCPTOR20-REDHAT-RTR-1";

  $scope.useridentity = {
    "email" : sessionStorage.getItem("email"),
    "fname" : sessionStorage.getItem("firstName"),
    "lname" : sessionStorage.getItem("lastName")
  }

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
      template: '../template/login.html', 
      className: 'ngdialog-theme-login', 
      controller: 'loginController',
      closeByDocument: false,
      closeByEscape: false,
      showClose: false
    });
  }

  $scope.openOffCanvas = function(){
    $scope.offCanvasOpen = true;
    console.log("openOC");
  }

  $scope.closeOffCanvas = function(){
    $scope.offCanvasOpen = false;
    console.log("closeOC");
  }

  $scope.logout = function(){
    sessionStorage.clear();
    location.reload();
  }
});

paApp.controller('paController', function($scope, $route, $filter, dataService, uiGridConstants) {
  $scope.$route = $route;
  console.log("you're in PA");

  var defQ = {"vhid":"CPAHOR9-AODNCO-RTR-2", "descr":"Serial0%2F1%2F0", "stdt":"2015-08-20+00:00:00", "endt":"2015-08-21+23:59:00"};

  $scope.master = {vhid:"CPAHOR9-AODNCO-RTR-2", desc: "Serial0/1/0", stdt: "2015-08-20", sttm: "00:00:00", enddt: "2015-08-27", endtm: "00:00:00"};
  $scope.cpe = angular.copy($scope.master);

  $scope.gridOptions = {};

  $scope.totals = {};

  var columnOpts = [
    {displayName:'Interval End Date/Time', field: 'enddt', width: '20%', sort: { direction: uiGridConstants.DESC }},
    {displayName:'ESs', field: 'es', type:'number', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'UASs', field: 'uas', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'PCVs', field: 'pcv', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'SESs', field: 'ses', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'SEFs', field: 'sef', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'CSSs', field: 'css', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'BESs', field: 'bes', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'DMs', field: 'dm', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'LESs', field: 'les', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
    {displayName:'LCV', field: 'lcv', type:'number',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true}
  ]

  $scope.gridOptions = {
    enableGridMenu: true,
    showGridFooter: true,
    // footerTemplate: 'ui-grid/ui-footer-template-custom.html',
    // gridFooterTemplate: 'ui-grid/ui-footer-template-custom.html',
    enableFiltering: true,
    exporterMenuCsv: true,
    exporterMenuPdf: false,
    exporterCsvFilename: $scope.cpe.stdt + ' to ' + $scope.cpe.enddt + '.csv',
    // showColumnFooter: true,
    enablePaginationControls: false,
    enableColumnMenus: false,
    paginationPageSize: 10,
    // enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
    columnDefs: columnOpts
  };

  $scope.gridOptions.onRegisterApi = function (gridApi) {
    $scope.gridApi2 = gridApi;
  }

  $scope.update = function (cpe){
    // console.log("beep")
    var descRaw = $scope.cpe.desc;
    var descSerial = descRaw.replace(/\//g, "%2F");
    var descSerial2 = descSerial.replace(" ", "+");
    console.log("serialized - " + descSerial2)
    var updateQ = {"vhid": $scope.cpe.vhid, "descr": descSerial2,
    "stdt":  $scope.cpe.stdt + "+" + $scope.cpe.sttm, "endt":  $scope.cpe.enddt + "+" + $scope.cpe.endtm }

    console.log(updateQ);

    $scope.promise = dataService.getData(updateQ).then(function(dataResponse) {
      console.log(dataResponse);
      try {
        if(dataResponse.data._embedded.stats != undefined){
          $scope.stats = dataResponse.data;
          $scope.gridOptions.data = dataResponse.data._embedded.stats;
          console.log(dataResponse.data._embedded.stats);
          dataMassage(dataResponse.data._embedded.stats);
          $scope.totals = dataSummary(dataResponse.data._embedded.stats);
        }else{
          console.log("NO DATA"); 
          //$scope.gridOptions = {};
          $scope.stats = {};
          // $("#line-chart").empty();
          var emptyObj = {};
          dataMassage(emptyObj);
          $scope.totals = {};
          $scope.gridOptions.data = {};
        }
      }catch (e) {
          console.log("NO DATA"); 
          //$scope.gridOptions = {};
          $scope.stats = {};
          // $("#line-chart").empty();
          var emptyObj = {};
          dataMassage(emptyObj);
          $scope.totals = {};
          $scope.gridOptions.data = [];
      }
      
    });
  }

});

paApp.controller('loginController', function($scope, $route, ngDialog, loginService) {
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

      // mixpanel.identify($scope.userInfo.emailAddress); // eventually place this in the event handler of login
      // mixpanel.people.set({
      //     "$first_name": $scope.userInfo.firstName,
      //     "$last_name": $scope.userInfo.lastName,
      //     "$role": "Super Admin"
      // });

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

function dataSummary(stats){

  var arr_es = [];
  var arr_uas = [];
  var arr_pcv = [];
  var arr_ses = [];
  var arr_sef = [];
  var arr_css = [];
  var arr_bes = [];
  var arr_dm = [];
  var arr_les = [];
  var arr_los = [];
  var arr_lof = [];
  var arr_rem = [];
  var arr_ais = [];
  var arr_lcv = [];

  var totals_obj = {
      "es": {
        "count": 0,
        "instances": []
      },
      "uas": {
        "count": 0,
        "instances": []
      },
      "pcv": {
        "count": 0,
        "instances": []
      },
      "ses": {
        "count": 0,
        "instances": []
      },
      "sef": {
        "count": 0,
        "instances": []
      },
      "css": {
        "count": 0,
        "instances": []
      },
      "bes": {
        "count": 0,
        "instances": []
      },
      "dm": {
        "count": 0,
        "instances": []
      },
      "les": {
        "count": 0,
        "instances": []
      },
      "lcv": {
          "count": 0,
          "instances": []
      },
      "los": {
        "count": 0,
        "instances": []
      },
      "lof": {
        "count": 0,
        "instances": []
      },
      "rem": {
        "count": 0,
        "instances": []
      },
      "ais": {
        "count": 0,
        "instances": []
      },
      "total_err": 0
    }

  for(i=0; i != stats.length; i++){
    // console.log(stats[i].enddt)
    if(parseInt(stats[i].es) !== 0){
      totals_obj.es.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].uas) !== 0){
      totals_obj.uas.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].pcv) !== 0){
      totals_obj.pcv.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].ses) !== 0){
      totals_obj.ses.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].sef) !== 0){
      totals_obj.sef.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].css) !== 0){
      totals_obj.css.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].bes) !== 0){
      totals_obj.bes.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].dm) !== 0){
      totals_obj.dm.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].les) !== 0){
      totals_obj.les.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].lcv) !== 0){
      totals_obj.lcv.instances.push(stats[i].endt)
    }

    if(parseInt(stats[i].alarmlos) !== 0){
      totals_obj.los.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].alarmlof) !== 0){
      totals_obj.lof.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].alarmrem) !== 0){
      totals_obj.rem.instances.push(stats[i].enddt)
    }

    if(parseInt(stats[i].alarmais) !== 0){
      totals_obj.ais.instances.push(stats[i].enddt)
    }

    arr_es.push(parseInt(stats[i].es));
    arr_uas.push(parseInt(stats[i].uas));
    arr_pcv.push(parseInt(stats[i].pcv));
    arr_ses.push(parseInt(stats[i].ses));
    arr_sef.push(parseInt(stats[i].sef));
    arr_css.push(parseInt(stats[i].css));
    arr_bes.push(parseInt(stats[i].bes));
    arr_dm.push(parseInt(stats[i].dm));
    arr_les.push(parseInt(stats[i].les));
    arr_lcv.push(parseInt(stats[i].lcv));
    arr_los.push(parseInt(stats[i].alarmlos));
    arr_lof.push(parseInt(stats[i].alarmlof));
    arr_rem.push(parseInt(stats[i].alarmrem));
    arr_ais.push(parseInt(stats[i].alarmais));
  }

  totals_obj.es.count = totalArray(arr_es);
  totals_obj.uas.count = totalArray(arr_uas);
  totals_obj.pcv.count = totalArray(arr_pcv);
  totals_obj.ses.count = totalArray(arr_ses);
  totals_obj.sef.count = totalArray(arr_sef);
  totals_obj.css.count = totalArray(arr_css);
  totals_obj.bes.count = totalArray(arr_bes);
  totals_obj.dm.count = totalArray(arr_dm);
  totals_obj.les.count = totalArray(arr_les);
  totals_obj.lcv.count = totalArray(arr_lcv);
  totals_obj.los.count = totalArray(arr_los);
  totals_obj.lof.count = totalArray(arr_lof);
  totals_obj.rem.count = totalArray(arr_rem);
  totals_obj.ais.count = totalArray(arr_ais);

  var err_total = 0;

  $.each( totals_obj, function( key, value ) {
    if(key === 'total_err' || key === 'los' || key === 'lof' || key === 'rem' || key === 'ais'){
            //no op
    }else {
            err_total += this.count;
            console.log(key + ":" + this.count)
        }
    console.log(err_total)
  });

  totals_obj.total_err = err_total;

    return totals_obj;
}

function dataMassage(stats){

  var arr_cat = [];
  var arr_es = [];
  var arr_uas = [];
  var arr_pcv = [];
  var arr_ses = [];
  var arr_sef = [];
  var arr_css = [];
  var arr_bes = [];
  var arr_dm = [];
  var arr_les = [];
  var arr_lcv = [];
  var steps = 0;
  // var arr_los = [];
  // var arr_lof = [];
  // var arr_rem = [];
  // var arr_ais = [];

  // set steps
  //TODO: change this to something more algorithmin
  if(stats.length < 17){
    steps = 1;
  }else if(stats.length < 33){
    steps = 2;
  }else if(stats.length < 65){
    steps = 4;
  }else if(stats.length < 129){
    steps = 8;
  }else if(stats.length < 257){
    steps = 16;
  }else if(stats.length < 513){
    steps = 32;
  }else if(stats.length < 1025){
    steps = 64;
  }else if(stats.length < 2049){
    steps = 128;
  }else if(stats.length > 2048){
    steps = 256;
  }

  try{
    console.log(stats.length);
    for(i=0; i != stats.length; i++){
      arr_cat.push(stats[i].enddt);
      arr_es.push(parseInt(stats[i].es));
      arr_uas.push(parseInt(stats[i].uas));
      arr_pcv.push(parseInt(stats[i].pcv));
      arr_ses.push(parseInt(stats[i].ses));
      arr_sef.push(parseInt(stats[i].sef));
      arr_css.push(parseInt(stats[i].css));
      arr_bes.push(parseInt(stats[i].bes));
      arr_dm.push(parseInt(stats[i].dm));
      arr_les.push(parseInt(stats[i].les));
      arr_lcv.push(parseInt(stats[i].lcv));
      // arr_los.push(parseInt(stats[i].alarmlos));
      // arr_lof.push(parseInt(stats[i].alarmlof));
      // arr_rem.push(parseInt(stats[i].alarmrem));
      // arr_ais.push(parseInt(stats[i].alarmais));
    }
  }catch(err) {
    //probably empty
    console.log(err)
  }

  // console.log(arr_les)

  $('#line-chart').highcharts({
    chart: {
      height: 280,
      zoomType: 'x',
      // panning: true,
      spacingLeft: 2,
      events: {
        selection: function (event) {
          console.log(event);
          if(event.resetSelection === true){
            var resetStep = this.xAxis[0].dataMax+1;
            console.log("loggin reset:" + resetStep);
            if(resetStep < 17){
              this.xAxis[0].options.labels.step = 1;
              console.log("reset zoom");
            }else if(resetStep < 33){
              this.xAxis[0].options.labels.step = 2;
              console.log("reset zoom");
            }else if(resetStep < 65){
              this.xAxis[0].options.labels.step = 4;
              console.log("reset zoom");
            }else if(resetStep < 129){
              this.xAxis[0].options.labels.step = 8;
              console.log("reset zoom");
            }else if(resetStep < 257){
              this.xAxis[0].options.labels.step = 16;
              console.log("reset zoom");
            }else if(resetStep < 513){
              this.xAxis[0].options.labels.step = 32;
              console.log("reset zoom");
            }else if(resetStep < 1025){
              this.xAxis[0].options.labels.step = 64;
              console.log("reset zoom");
            }else if(resetStep < 2049){
              this.xAxis[0].options.labels.step = 128;
              console.log("reset zoom");
            }else if(resetStep > 2048){
              this.xAxis[0].options.labels.step = 256;
              console.log("reset zoom");
            }
          }else {
            var resetStep2 = event.xAxis[0].max - event.xAxis[0].min;
            // console.log(resetStep2);
            // console.log("zoom MAX: " + event.xAxis[0].max);
            if(resetStep2 < 17){
              this.xAxis[0].options.labels.step = 1;
            }else if(resetStep2 < 33){
              this.xAxis[0].options.labels.step = 2;
            }else if(resetStep2 < 65){
              this.xAxis[0].options.labels.step = 4;
            }else if(resetStep2 < 129){
              this.xAxis[0].options.labels.step = 8;
            }else if(resetStep2 < 257){
              this.xAxis[0].options.labels.step = 16;
            }else if(resetStep2 < 513){
              this.xAxis[0].options.labels.step = 32;
            }else if(resetStep2 < 1025){
              this.xAxis[0].options.labels.step = 64;
            }else if(resetStep2 < 2049){
              this.xAxis[0].options.labels.step = 128;
            }else if(resetStep2 > 2048){
              this.xAxis[0].options.labels.step = 256;
            }
          }
        }
      }
    },
    title: {
      text: '',
      x: -20 //center
    },
    xAxis: {
      categories: arr_cat,
      labels: {
        step: steps,
        formatter: function () {
          var s = this.value;
          var split = s.split(" ");
          return split[0] + '<br/>' + split[1].slice(0,5);
        }
      }
    },
    yAxis: {
      allowDecimals: false,  
      min: 0,
      title: {
          text: 'Errors'
      },
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
    },
    tooltip: {
      valueSuffix: ''
    },
    legend: {
      layout: 'horizontal',
      align: 'left',
      verticalAlign: 'top',
      borderWidth: 0,
      y: 10
    },
      series: [{
          name: 'ESs',
          data: arr_es
      }, {
          name: 'UASs',
          data: arr_uas
      }, {
          name: 'PCVs',
          data: arr_pcv
      }, {
          name: 'SESs',
          data: arr_ses
      }, {
          name: 'SEFs',
          data: arr_sef
      }, {
          name: 'CSSs',
          data: arr_css
      }, {
          name: 'BESs',
          data: arr_bes
      }, {
          name: 'DMs',
          data: arr_dm
      }, {
          name: 'LESs',
          data: arr_les
      }, {
          name: 'LCVs',
          data: arr_lcv
      }]
      // , {
      //     name: 'LOS',
      //     data: arr_los
      // }, {
      //     name: 'LOF',
      //     data: arr_lof
      // }, {
      //     name: 'REM',
      //     data: arr_rem
      // }, {
      //     name: 'AIS',
      //     data: arr_ais
      // }]
  });
}

function totalArray(arr){
  var total = 0;
  $.each(arr,function() {
      total += this;
  });

  return total;
}