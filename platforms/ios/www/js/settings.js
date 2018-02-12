mainApp.controller('SettingsCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $cordovaEmailComposer, $cordovaCalendar, $cordovaSocialSharing, locale, $cordovaAppVersion, $cordovaBadge) {

    var languageObj = store.get('language').localeSetting;
    $scope.settingsObj = {};
    $scope.settingsObj.language = languageObj;
    $cordovaAppVersion.getVersionNumber()
    .then(function (version) {
        $scope.appVersion = version;
    });
    
    switch($rootScope.language) {
        case "ms-MS":
            $scope.title = 'Tetapan';
            getBmUnreadTenderCount();
            getBmUnreadInfoCount();
            break;
        case "en-US":
            $scope.title = 'Settings';
            getEnUnreadTenderCount();
            getEnUnreadInfoCount();
            break;

    } 
    
  $scope.changeLanguage = function(){
      db.close();
      db2.close();
      if($scope.settingsObj.language == ('en-US'))
      {
          $scope.title = 'Settings';
          $scope.localeSetting = "en-US"; 
          $rootScope.language = $scope.localeSetting;

          var myNewObject2 = {
            localeSetting : "en-US"
          } 

          store.set('language', myNewObject2);
          locale.setLocale($scope.localeSetting);
          $rootScope.loadDatabase();
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go('app.enLandingPage');
      }
      else if($scope.settingsObj.language == ('ms-MS'))
      {
          $scope.title = 'Tetapan';
          var myNewObject = store.get('language');
          $scope.localeSetting = "ms-MS"; 
          $rootScope.language = $scope.localeSetting;
          
          var myNewObject2 = {
            localeSetting : "ms-MS"
          } 

          store.set('language', myNewObject2);
          locale.setLocale($scope.localeSetting);
          $rootScope.loadDatabase();
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go('app.enLandingPage');
      }    
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