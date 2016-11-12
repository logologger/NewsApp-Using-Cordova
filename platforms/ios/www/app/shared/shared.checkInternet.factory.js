//This function will serve as a common function that will serve for Checking Internet Connection
angular.module("newsApp")
.factory('CommonCheckInternetFactory', [ function(){
  return{
            checkInternet : function(){

                  document.addEventListener("online", onOnline, false);
                  document.addEventListener("offline", onOffline, false);
                  function onOnline() {
                      console.log("onOnline");
                }
                function onOffline() {
                    console.log("onOffline");
                }
            
  
              
  			}
}
   
}]);
