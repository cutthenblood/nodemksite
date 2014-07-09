
var PhoneList = angular.module('PhoneList',['ui.bootstrap','ngCookies','ngResource','ngRoute']).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});

PhoneList.factory('UPLFactory',function($resource){
    return $resource('/phonelist/getUserPhoneList');
});


PhoneList.controller('phoneListCtrl',function($scope,UPLFactory){

    $scope.phonelist = UPLFactory.query();
    
});