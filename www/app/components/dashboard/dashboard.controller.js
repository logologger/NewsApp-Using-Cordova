angular.module("newsApp")
.controller('DashboardController',['dashboardService','CommonServiceFactory','$mdDialog','$mdToast',function(dashboardService,CommonServiceFactory,$mdDialog,$mdToast){
    
    var vm=this;
   
    var url="http://content.guardianapis.com/search?api-key=1fe52415-6e22-4d4d-8c83-2d1a129d3660&show-fields=thumbnail"; 
    CommonServiceFactory.ServiceCall(url,'',DashBoardURLSuccessCallBack);
    
    function DashBoardURLSuccessCallBack(data){
        
        vm.newsData=data.response.results;
       var webTitle=data.response.results[0].webTitle;
        vm.news=webTitle;
        vm.imgLink=data.response.results[0].fields.thumbnail;
        vm.viewMore=data.response.results[0].webUrl;
        //save the Entire Data here 
        //create the table
        var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});
        
                    db.sqlBatch([
              'DROP TABLE IF EXISTS NewsAppData',
              'CREATE TABLE NewsAppData (webTitle,webUrl,thumbnail)',
              [ 'INSERT INTO NewsAppData VALUES (?,?,?)', [data.response.results[0].webTitle,data.response.results[0].webUrl,data.response.results[0].fields.thumbnail] ],
            ], function() {
              db.executeSql('SELECT * FROM NewsAppData', [], function (resultSet) {
                console.log('Sample column value: ' + JSON.stringify(resultSet.rows.item(0)));
              });
            }, function(error) {
              console.log('Populate table error: ' + error.message);
            });
                    
        
    }
    vm.viewMoreFunction=function(ev,webUrl){
        
        console.log("Viewing More "+ev+" WebUrl "+webUrl);
        cordova.InAppBrowser.open(webUrl, '_self', 'location=no');
        
        
    }
    vm.refresh=function()
    {
        
        console.log("Refreshing");
//Here i will show the Toast of Refreshing Message
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
        .textContent('Refresing ! Please Wait ')
        .position(pinTo)
        .hideDelay(3000)
    );
  
         CommonServiceFactory.ServiceCall(url,'',DashBoardURLSuccessCallBack);
        
    }
    
    vm.exitApp=function(ev){
         var confirm = $mdDialog.confirm()
          .title('Are you Sure you want to Exit?')
         
          
          .targetEvent(ev)
          .ok('Exit')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
       navigator.app.exitApp();
    }, function() {
      console.log("Do Nothing");
    });
//       
        console.log("Exiting the Application");
//         navigator.app.exitApp();
        
        
    }
    //Code to Open Menu for Refresh and other Options
    var originatorEv;
   
    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
     
    
}])