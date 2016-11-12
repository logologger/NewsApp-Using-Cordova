angular.module("newsApp")
.controller("splashController",splashController);
function splashController($timeout,$state){
    
    $timeout(function(){
        
        $state.go('home');
        
    },2000)
    
    
    
}