angular.module("newsApp")
.factory('CommonServiceFactory', ['$http', '$location', '$rootScope','$q',  function($http, $location, $rootScope, $q){
  return{
            ServiceCall : function(url,input, successCallBack,errorCallback){
              $http({
                    method : "GET",
                    url : url,
                   // data:input,
                    headers: {
                    contentType: "application/json",
                    dataType:"json"
                    },
                    timeout : 3000
                    }).success(function(data, status, headers, config) {
                              
                     successCallBack(data);
                           
                               
                   }).error(function(data, status, headers, config) {
                        //Need to handled For this Case
                        //Whether Internet is down or something else
                        errorCallback();
                   });
  			}
}
   
}]);
                                                      