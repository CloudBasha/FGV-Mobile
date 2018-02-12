mainApp.controller('TenderDetailsPageCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $stateParams, $cordovaEmailComposer, $cordovaCalendar, $cordovaSocialSharing, $cordovaInAppBrowser, $cordovaBadge) {
    
    $scope.paramsObject = $stateParams.obj;
    $log.debug("Tender Details ", $scope.paramsObject);
    
    switch($rootScope.language) {
        case "ms-MS":
            $scope.title = 'Butiran';
            $scope.calendarEventMessage = "Acara Berjaya Ditambah";
            var query = "update malayTenders set status='read' where tenderId="+parseInt($scope.paramsObject.ows_Id);
            $cordovaSQLite.execute(db, query)
            .then(function (result) {
                $log.debug("Tender Status Changed in Local Database");
                getBmUnreadTenderCount();
                getBmUnreadInfoCount();
            }, function (error) {
              console.warn('I found an error');
              console.warn(error);
            });
            break;
        case "en-US":
            $scope.title = 'Details';
            $scope.calendarEventMessage = "Event Added Succesfully";
            var query = "update englishTenders set status='read' where tenderId="+parseInt($scope.paramsObject.ows_Id);
            $cordovaSQLite.execute(db, query)
            .then(function (result) {
                $log.debug("Tender Status Changed in Local Database");
                getEnUnreadInfoCount();
                getEnUnreadTenderCount();
            }, function (error) {
              console.warn('I found an error');
              console.warn(error);
            });
            break;
    }
    
    $scope.setReadFavorite = function(index){
        switch($rootScope.language) {
            case "ms-MS":
                if($scope.paramsObject.favorite == 'false')
                {
                    var query = "update malayTenders set favorite = 'true' where tenderId="+$scope.paramsObject.ows_Id;
                    $cordovaSQLite.execute(db, query)
                    .then(function (result) {
                        $log.debug("Tender Favorite Changed to True in Local Database");
                        $scope.paramsObject.favorite = 'true'
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                }
                else
                {
                    var query = "update malayTenders set favorite = 'false' where tenderId="+$scope.paramsObject.ows_Id;
                    $cordovaSQLite.execute(db, query)
                    .then(function (result) {
                        $log.debug("Tender Favorite Changed to False in Local Database");
                        $scope.paramsObject.favorite = 'false'
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                }
                break;
            case "en-US":
                if($scope.paramsObject.favorite == 'false')
                {
                    var query = "update englishTenders set favorite = 'true' where tenderId="+$scope.paramsObject.ows_Id;
                    $cordovaSQLite.execute(db, query)
                    .then(function (result) {
                        $log.debug("Tender Favorite Changed to True in Local Database");
                        $scope.paramsObject.favorite = 'true'
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                }
                else
                {
                    var query = "update englishTenders set favorite = 'false' where tenderId="+$scope.paramsObject.ows_Id;
                    $cordovaSQLite.execute(db, query)
                    .then(function (result) {
                        $log.debug("Tender Favorite Changed to False in Local Database");
                        $scope.paramsObject.favorite = 'false'
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                }
                break;
        }
        
    }
    
    
    $scope.shareReadTenderViaEmail = function(index){
        var formatedEmailAddresses = [];
        var serverEmail = $scope.paramsObject.ows_EmelPegawaiUntukDihubungi;
        var splitEmailFromServer = serverEmail.split(" ");
        for(i=0;i<splitEmailFromServer.length;i++)
        {
            validateEmail(splitEmailFromServer[i]);
            if(validateEmail(splitEmailFromServer[i]) == true)
            {
                formatedEmailAddresses.push(splitEmailFromServer[i]);
            }
        }
        $log.debug("Email From Server ", splitEmailFromServer);
        $log.debug("Formatted Email ", formatedEmailAddresses);
        $cordovaEmailComposer.isAvailable().then(function() {
            $log.debug("Found Email ");     
            var email = {
                to: formatedEmailAddresses,
                subject: $scope.paramsObject.ows_Title,
                isHtml: true
            };

            $cordovaEmailComposer.open(email).then(function () {
                $log.debug("Opening Email");
            }, function(err){
                $log.debug("Cancel Email Client");
            }); 
         }, function (err) {
            $ionicPopup.alert({
                title: 'Email Composer Error',
                template: 'There are no registered Email Accounts on this device. Please add an Email account to this device before using this feature.'
            });
            $log.debug("No Email ");
         });
    }
    
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    $scope.addReadTenderEvent = function(index){
        var startFullDate = $scope.paramsObject.ows_TarikhTenderDibuka.split(" ");
        $log.debug(startFullDate);
        var startFullDate2 = startFullDate[0].split("-");
        $log.debug(startFullDate2);
        var startTime = startFullDate[1].split(":");
        $log.debug(startTime);
        
        var closeFullDate = $scope.paramsObject.ows_TarikhTenderDitutup.split(" ");
        $log.debug(closeFullDate);
        var closeFullDate2 = closeFullDate[0].split("-");
        $log.debug(closeFullDate2);
        var closeTime = closeFullDate[1].split(":");
        $log.debug(closeTime);
        
        switch($rootScope.platform) {
            case "Android":
                $cordovaCalendar.createEventInteractively({
                    title: $scope.paramsObject.ows_Title,
                    location: $scope.paramsObject.ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                }, function (err) {
                // error
                });    

                $cordovaCalendar.createEventInteractively({
                    title: $scope.paramsObject.ows_Title,
                    location: $scope.paramsObject.ows_Lokasi_x002f_Ladang,
                    startDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, closeFullDate2[2], closeTime[0], closeTime[1], 0, 0, 0),
                    endDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, parseInt(closeFullDate2[2]), closeTime[0], closeTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                }, function (err) {
                // error
                });
                break;
            case "iOS":
                $cordovaCalendar.createEvent({
                    title: $scope.paramsObject.ows_Title,
                    location: $scope.paramsObject.ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                    $cordovaCalendar.createEvent({
                        title: $scope.paramsObject.ows_Title,
                        location: $scope.paramsObject.ows_Lokasi_x002f_Ladang,
                        startDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, closeFullDate2[2], closeTime[0], closeTime[1], 0, 0, 0),
                        endDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, parseInt(closeFullDate2[2]), closeTime[0], closeTime[1], 0, 0, 0)
                    }).then(function (result) {
                        $log.debug("Event Created", result);
                        $ionicPopup.alert({
                            title: 'Calendar Event',
                            template: $scope.calendarEventMessage
                        });
                    }, function (err) {
                    // error
                    });
                }, function (err) {
                // error
                });    

                break;
        }
            
    }
    
    $scope.shareReadTender = function(index){      
        var message = "Tender Title - " + $scope.paramsObject.ows_Title + "\n\nTender Opening Date - " +        $scope.paramsObject.ows_TarikhTenderDibuka + "\n\nTender Closing Date - " + $scope.paramsObject.ows_TarikhTenderDitutup + "\n\n" + $scope.paramsObject.attachmentFileUrl;
        var subject = $scope.paramsObject.ows_Title;
        $cordovaSocialSharing.share(message, subject)
        .then(function (result) {
        $log.debug("Share Successful", result);
      }, function (err) {
        // error
      });    
    }
    
    $scope.openPDF = function(){
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        $cordovaInAppBrowser.open($scope.paramsObject.attachmentFileUrl, '_system', options)
          .then(function(event) {
            $log.debug("PDF Open Successful");
          })
          .catch(function(event) {
            // error
          });
    }
    
    
    function getBmUnreadTenderCount(){
        var dateNow = new Date().getTime()/1000;
        $log.debug("TimeStamp ", dateNow);
        var query = "SELECT * from malayTenders WHERE status = 'unread'";
        $cordovaSQLite.execute(db, query)
        .then(function (result) 
        {
            var i, len, allItems = [];
            for(i = 0, len = result.rows.length; i < len; i++)
            {
                if((Date.parse(result.rows.item(i).closingDate).getTime()/1000) > dateNow)
                {
                    allItems.push(result.rows.item(i));
                }
            }
            $scope.tenderBadgeActive = false; 
            $scope.unreadTenderCountEn = allItems.length;
            if( $scope.unreadTenderCountEn != 0)
            {
                $scope.tenderBadgeActive = true;    
            }
            else
            {
                $scope.tenderBadgeActive = false;    
            }
            $log.debug('Unread Tender Count ', $scope.unreadTenderCountEn);
            $timeout(function(){
                setOutterBadgeCount();    
            }, 1000);
            $ionicLoading.hide();
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
        });
    }

    function getBmUnreadInfoCount(){
        var query = "SELECT * from malayInfo WHERE status = 'unread'";
        $cordovaSQLite.execute(db2, query)
        .then(function (result) 
        {
            var i, len, allInfo = [];
            for(i = 0, len = result.rows.length; i < len; i++)
            {
                allInfo.push(result.rows.item(i));
            }
            $scope.InfoBadgeActive = false; 
            $scope.unreadInfoCountEn = allInfo.length;
            if( $scope.unreadInfoCountEn != 0)
            {
                $scope.InfoBadgeActive = true;    
            }
            else
            {
                $scope.InfoBadgeActive = false;    
            }
            $log.debug('Unread Info Count ', $scope.unreadInfoCountEn);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
        });
    }
    
    
    function getEnUnreadTenderCount(){
        var dateNow = new Date().getTime()/1000;
        $log.debug("TimeStamp ", dateNow);
        var query = "SELECT * from englishTenders WHERE status = 'unread'";
        $cordovaSQLite.execute(db, query)
        .then(function (result) 
        {
            var i, len, allItems = [];
            for(i = 0, len = result.rows.length; i < len; i++)
            {
                if((Date.parse(result.rows.item(i).closingDate).getTime()/1000) > dateNow)
                {
                    allItems.push(result.rows.item(i));
                }
            }
            $scope.tenderBadgeActive = false; 
            $scope.unreadTenderCountEn = allItems.length;
            if( $scope.unreadTenderCountEn != 0)
            {
                $scope.tenderBadgeActive = true;    
            }
            else
            {
                $scope.tenderBadgeActive = false;    
            }
            $log.debug('Unread Tender Count ', $scope.unreadTenderCountEn);
            $timeout(function(){
                setOutterBadgeCount();    
            }, 1000);
            $ionicLoading.hide();
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
        });
    }

    function getEnUnreadInfoCount(){
        var query = "SELECT * from englishInfo WHERE status = 'unread'";
        $cordovaSQLite.execute(db2, query)
        .then(function (result) 
        {
            var i, len, allInfo = [];
            for(i = 0, len = result.rows.length; i < len; i++)
            {
                allInfo.push(result.rows.item(i));
            }
            $scope.InfoBadgeActive = false; 
            $scope.unreadInfoCountEn = allInfo.length;
            if( $scope.unreadInfoCountEn != 0)
            {
                $scope.InfoBadgeActive = true;    
            }
            else
            {
                $scope.InfoBadgeActive = false;    
            }
            $log.debug('Unread Info Count ', $scope.unreadInfoCountEn);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
        });
    }
    
    function setOutterBadgeCount(){
        var outterBadgeCount = $scope.unreadInfoCountEn + $scope.unreadTenderCountEn;
        $cordovaBadge.hasPermission().then(function(yes) {
            $cordovaBadge.set(outterBadgeCount)
            .then(function() {
            $log.debug("Outter badge set", outterBadgeCount);
            }, function(err) {
            $log.debug(err);
            });    
        }, function(no) {
        
        });
    }
   
});