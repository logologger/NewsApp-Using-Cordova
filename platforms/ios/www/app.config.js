
angular.module("newsApp",['ui.router','ngMaterial','ngMessages']);

angular.module("newsApp").config(config);

function config($stateProvider,$urlRouterProvider){
  
    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('home', {
		url : '/home',
		templateUrl : 'app/components/dashboard/dashboard.html',
        controller  :  'DashboardController as DC'
    }).state('splash',{
        url:'/',
        templateUrl:'app/components/splash/splash.html',
        controller:'splashController'
        
    })
}


