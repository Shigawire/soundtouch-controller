angular.module('starter.controllers', [])

.service ('SoundTouchDeviceProperties', function($http, cordovaHTTP) {

  _p = {}

  _p.getProperty = function (device, host, port, property) {

    //window.plugins.CordovaHttpPlugin.get("http://google.de", {}, {hdrs}, makeRequest, makeRequestError);

    console.log("request");

    device_http_address = 'http://'+host+':'+port+'/info';


    cordovaHTTP.get("http://192.168.2.192:8090/info", {

    }, {}, function(response) {
    }, function(response) {
    }).then(function(response) {
      console.log(JSON.stringify(response))
    }, function (response) {
      console.log(JSON.stringify(response))
    });

/*
    cordovaHTTP.get("https://google.com/", {
        id: 12,
        message: "test"
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log(response.status);
    }, function(response) {
        console.error(response.error);
    });
    */


    /*
    device_http_address = "http://localhost:2222";

    $http.get(device_http_address).then(function(resp) {
       console.log('Success', resp);
       // For JSON responses, resp.data contains the result
     }, function(err) {
       console.error('ERR', JSON.stringify(err));
       // err.status will contain the status code
     })

     */
  }

  return _p;
})
.factory('SoundTouchDevices', function ($timeout) {

  _factory = {};
  _factory.devices = {};
  _factory.discovering = false;
  _factory.current_device = null

  sizeOf = function(obj) {
    return Object.keys(obj).length;
  };
  return _factory
})

.service ('helper', function (){

  _h = {}

  _h.sizeOf = function(obj) {
    return Object.keys(obj).length;
  };

  return _h;
})

.controller('AppCtrl', function($scope, $ionicModal, $interval, $ionicPlatform, SoundTouchDevices, SoundTouchDeviceProperties, helper) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.SoundTouchDevices = SoundTouchDevices;
    $scope.sizeOf = helper.sizeOf;

    addService = function (hostName, port, serviceName, regType, domain) {
    	console.log("ADD: "+ serviceName+" is at "+hostName+":"+port);
      SoundTouchDevices.devices[serviceName] = ({host: hostName, port: port});


      if ($scope.sizeOf(SoundTouchDevices.devices) == 1) {
        SoundTouchDevices.current_device = serviceName
      }

      $scope.$apply();

      SoundTouchDeviceProperties.getProperty(serviceName, hostName, port, '/info')
      }

    removeService = function (serviceName) {
    	console.log("REMOVE: " + serviceName);
      delete SoundTouchDevices.devices[serviceName];
      if (serviceName == SoundTouchDevices.current_device) {
        console.log("HELP! Lost my current device!");
        SoundTouchDevices.current_device = "";
      }
      $scope.$apply();
    }

    serviceFound = function (serviceName, regType, domain, moreComing) {
      console.log("js serviceFound "+serviceName+" "+regType+" "+moreComing);
      dnssd.resolve(serviceName, regType, domain, addService);

    }

    serviceLost = function (serviceName, regType, domain, moreComing) {
      console.log("js serviceLost "+serviceName+" "+regType+" "+moreComing);
      removeService (serviceName);
    }

    discover = function (start) {
      if (start) {
        SoundTouchDevices.discovering = true;
        $ionicPlatform.ready(function() {

          dnssd.browse("_soundtouch._tcp", "local", serviceFound, serviceLost);
        });

      } else {
        $ionicPlatform.ready(function() {
          dnssd.browse(null, null);
          //_factory.discovering = false;
          console.log("cancelled browsing");
        });
      }
    }

    discover(true);

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ManageCtrl', function ($scope, SoundTouchDevices, $interval, helper){
  $scope.SoundTouchDevices = SoundTouchDevices;

  $scope.helper = helper

})
.controller('HomeCtrl', function ($scope, SoundTouchDevices, helper){
  $scope.SoundTouchDevices = SoundTouchDevices;

  $scope.helper = helper

})

.controller('SettingsCtrl', function () {
  console.log("settings");

});
