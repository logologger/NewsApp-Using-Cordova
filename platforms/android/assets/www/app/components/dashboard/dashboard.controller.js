//Actual Code to See transaction Related 
//https://github.com/litehelpers/Cordova-sqlite-storage

// function addItem(first, last, acctNum) {

//     db.transaction(function (tx) {

//         var query = "INSERT INTO customerAccounts (firstname, lastname, acctNo) VALUES (?,?,?)";

//         tx.executeSql(query, [first, last, acctNum], function(tx, res) {
//             console.log("insertId: " + res.insertId + " -- probably 1");
//             console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
//         },
//         function(tx, error) {
//             console.log('INSERT error: ' + error.message);
//         });
//     }, function(error) {
//         console.log('transaction error: ' + error.message);
//     }, function() {
//         console.log('transaction ok');
//     });
// }



angular.module("newsApp")
.controller('DashboardController',['dashboardService','CommonServiceFactory','$mdDialog','$mdToast','CommonToastFactory',function(dashboardService,CommonServiceFactory,$mdDialog,$mdToast,CommonToastFactory){
    
    var vm=this;
    var p=0;
   var pop=0;
    var url="http://content.guardianapis.com/search?api-key=1fe52415-6e22-4d4d-8c83-2d1a129d3660&show-fields=thumbnail"; 
    var offlineData=[];



    CommonServiceFactory.ServiceCall(url,'',DashBoardURLSuccessCallBack,DashBoardURLErrorCallBack);
    vm.loading=true;

    function DashBoardURLErrorCallBack(){


        //Show the Toast that Service is not working
        //The Toast is a common thing so we should write it inside the shared Function as a service Implementation 
        //TODO Later

        console.log("Error Callback here");
        vm.loading=false;
        //CommonToastFactory.showToast("Please Check Your Internet Connection");
        CommonToastFactory.showToast("Loading Previous/Old News Offline Mode");

        //Select Query is Needed
    
        if(navigator.onLine===false){


              //Load the Data from DB
              var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});
    
    
                db.transaction(function(tx) {

          tx.executeSql("select TopNews from OfflineNewsData",[],function(tx,res){

          console.log("Response data is "+JSON.stringify(res));


          for (var i = 0; i < res.rows.length; i++) {

                  console.log("Row = " + i + ", id = " + res.rows.item(i).TopNews + ", log =  " +
                  res.rows.item(i).log);
                  offlineData=(JSON.parse(res.rows.item(i).TopNews));
                  console.log(offlineData)
// vm.newsData=offlineData;

    }


        if(offlineData.length>0){


          //Offline Data is available 
          vm.newsData=offlineData;
          //console.log("Offline Data is "+JSON.stringify(offlineData));

        }
        else{


          //Nothing found in Offline Data
          CommonToastFactory.showToast("No data found in LocalDB");
        }

      });//sql execute

        });//db event

      }//navigator online
      else{

            //Problem with Internet Connection
            CommonToastFactory.showToast("There some Problem with Internet Connection");

      }


        //Here We can load the Data from LocalDB

  


    }//ErrorCallback
    
    function DashBoardURLSuccessCallBack(data){
        vm.loading=false;
        vm.newsData=data.response.results;
    
        //Just Save this Data in LocalDB
    
       // console.log("News Data is "+JSON.stringify(vm.newsData));
        offlineData=vm.newsData;
        //Just replace the thumbnail jpg link with base64 data and save that in LocalDB
    
    
        //save the Entire Data here 
        //create the table
        var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});
    
    
         db.transaction(function(tx) {

    tx.executeSql('DROP TABLE IF EXISTS NewsAppData');
    tx.executeSql('DROP TABLE IF EXISTS OfflineNewsData');
    tx.executeSql('CREATE TABLE NewsAppData (webTitle,webUrl,thumbnail)');
    tx.executeSql('CREATE TABLE OfflineNewsData (ID,TopNews)');
 for(var i=0;i<data.response.results.length;i++)
 {
 
 
 //Convert the images to Base64 and then Store it in array
 
 
 var img = new Image();
img.setAttribute('crossOrigin', 'anonymous');
++pop;



var t=(function(p){

//Convert that image to base 64
      img.onload=function(){
      var canvas = document.createElement("canvas");
    
        canvas.width = this.width;
        canvas.height = this.height;
       // console.log("Stoppping "+img.src);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);
    
        var dataURL = canvas.toDataURL("image/png");

        offlineData[p].fields.thumbnail=dataURL;
    
        //Store them in the Database
        tx.executeSql("INSERT INTO NewsAppData (webTitle, webUrl,thumbnail) VALUES (?,?,?)", [data.response.results[p].webTitle, data.response.results[p].webUrl,dataURL], function(tx, res) {
      
      
            

        console.log("Done Transaction for "+p);
      
 
        }, function(e) {
                console.log("INSERT QUERY ERROR: " + JSON.stringify(e));
            });
          
          
          
        tx.executeSql("select * from NewsAppData",[],function(tx,res){
                        console.log("Length of Rows that got inserted "+res.rows+" length is   " +res.rows.length);

                        if(res.rows.length===offlineData.length){

                              //Insert into the New Table
                              var Alldata=JSON.stringify(offlineData);

                                   tx.executeSql("INSERT INTO OfflineNewsData (ID, TopNews) VALUES (?,?)", ["1", (Alldata)], function(tx, res) {
                                                console.log("Done Transaction for OfflineData");
      
                                         }, function(e) {
                                           console.log("INSERT QUERY ERROR: IN " + JSON.stringify(e));
                       });


                        }


                   },function(err){


                     console.log("Error in Select Query "+JSON.stringify(err) +" and message is "+err.message);
                   });
                //When the Count of Rows in the table goes to the length of the vm.newsData.length then we can insert data in the NewTable

    
 }//onload
 
 
 
 
 img.onerror=function(){
//Image Doesnt Get loads
    console.log("not able to load the image for p = "+p+" tx is "+tx);
    
     tx.executeSql("INSERT INTO NewsAppData (webTitle, webUrl,thumbnail) VALUES (?,?,?)", [data.response.results[p].webTitle, data.response.results[p].webUrl,""], function(tx, res) {
      
      
      
      console.log("Error NewsAPP ! Cant Insert the images");
 
      
 
    }, function(e) {
      console.log("ERROR: " + e.message);
    });



}

})(i);




    
    
    img.src = data.response.results[i].fields.thumbnail;
 
 
 
    
    }//End of for loop
  });
        

    
        
    }
    
    
    
    
    
    
    vm.viewMoreFunction=function(ev,webUrl){
        
        console.log("Viewing More "+ev+" WebUrl "+webUrl);
        cordova.InAppBrowser.open(webUrl, '_self', 'location=no');
        
        
    }
    vm.refresh=function()
    {
        vm.loading=true;
        console.log("Refreshing");
//Here i will show the Toast of Refreshing Message
        CommonToastFactory.showToast("Refresing ! Please Wait");

  
         CommonServiceFactory.ServiceCall(url,'',DashBoardURLSuccessCallBack,DashBoardURLErrorCallBack);
        
    }
    
    vm.exitApp=function(ev){
         var confirm = $mdDialog.confirm()
          .title('Are you sure you want to exit?')
         
          
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