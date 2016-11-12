//This function will serve as a common function that will serve for Checking Internet Connection
angular.module("newsApp")
.factory('CommonToastFactory', ['$mdToast', function($mdToast){
  return{
            showToast : function(message){

                  var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
  toastPosition = angular.extend({},last);
  getToastPosition = function() {
    sanitizePosition();
    return Object.keys(toastPosition)
      .filter(function(pos) { return  toastPosition[pos]; })
      .join(' ');
  };
  function sanitizePosition() {
    var current = toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }
  
//Code For Toast
        
    var pinTo = getToastPosition();
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position(pinTo)
        .hideDelay(3000)
    );
            
  
              
  			}
}
   
}]);
