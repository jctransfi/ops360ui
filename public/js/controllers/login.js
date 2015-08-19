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

      mixpanel.identify($scope.userInfo.emailAddress); // eventually place this in the event handler of login
      mixpanel.people.set({
          "$first_name": $scope.userInfo.firstName,
          "$last_name": $scope.userInfo.lastName,
          "$role": "Super Admin"
      });

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