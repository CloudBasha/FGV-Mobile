mainApp.controller('LandingPageCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $cordovaBadge) {

    $ionicLoading.show({
        template: '<p class="item-icon-center"><ion-spinner icon="ios"/></p>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 10000
    });
    
    document.addEventListener('pause', function () {
        switch($rootScope.language) {
            case "ms-MS":
                getBmUnreadTenderCount();
                getBmUnreadInfoCount();
                break;
            case "en-US":
                getEnUnreadTenderCount();
                getEnUnreadInfoCount();
                break;
        } 
    }, false);
    
    $timeout(function(){
        getAll();
    }, 3000);
    $scope.existingTenders = [];
    function getAll()
    {
        $log.debug($rootScope.language);
        switch($rootScope.language) {
		case "ms-MS":
            DataBaseFactory.getTendersBm()
            .then(function(data){
                $scope.existingTenders = data;  
                insertTendersBm();
            });

            DataBaseFactory.getInfoBm()
            .then(function(data){
                $scope.existingInfo = data;  
                insertInfoBm();
            });
            break;
        case "en-US":
            DataBaseFactory.getTendersEn()
            .then(function(data){
                $scope.existingTenders = data;  
                insertTendersEn();
            });

            DataBaseFactory.getInfoEn()
            .then(function(data){
                $scope.existingInfo = data;  
                insertInfoEn();
            });
            break;
            
        }
        
    }
    
    function insertTendersBm()
    {
        DataBaseFactory.insertToBmTendersTable()
        .then(function(data){
            $scope.tenders = data.data;
            angular.forEach($scope.tenders, function(tender){
                var tenderIdFromServer = parseInt(tender.ows_Id);
                $log.debug(tenderIdFromServer);
                var checkServerArray = _.find($scope.existingTenders, _.matchesProperty('tenderId', tenderIdFromServer));
                $log.debug(checkServerArray);
                if(checkServerArray == undefined)
                {
                    var query = "INSERT INTO malayTenders (cmsID, tenderId, closingDate, status, catName, language, favorite) VALUES (?,?,?,?,?,?,?)";
//                    var endingTime = Date.parse(tender.ows_TarikhTenderDitutup).getTime()/1000;
//                    $log.debug("++++++++ ", endingTime);
                    $cordovaSQLite.execute(db, query, [tender.tenderIdInCms, tender.ows_Id, tender.ows_TarikhTenderDitutup, 'unread', tender.ows_KategoriTender, 'ms', 'false'])
                    .then(function(res) {
                        $log.debug("Added New Tender - INSERT ID -> " + res.insertId);
                    }, function (err) {
                        $log.debug(err);
                    });
                }
                else if(checkServerArray != undefined || checkServerArray != null)
                {
                    $log.debug("Do nothing");       
                }
            });
            getBmUnreadTenderCount();
            $log.debug("Tenders from Server ", $scope.tenders);   
        });
    }
    
    function insertInfoBm()
    {
        DataBaseFactory.insertToEnInfoTable()
        .then(function(data){
            $scope.info = data.data;
            $log.debug("Server Info");
            angular.forEach($scope.info, function(info){
                var infoIdFromServer = parseInt(info.ows_ID);
                $log.debug(infoIdFromServer);
                var checkServerArray = _.find($scope.existingInfo, _.matchesProperty('infoId', infoIdFromServer));
                $log.debug(checkServerArray);
                if(checkServerArray == undefined)
                {
                    var query = "INSERT INTO malayInfo (infoId, language, status) VALUES (?,?,?)";
                    $cordovaSQLite.execute(db2, query, [info.ows_ID, 'ms', 'unread'])
                    .then(function(res) {
                        $log.debug("Added New Info - INSERT ID -> " + res.insertId);
                    }, function (err) {
                        $log.debug(err);
                    });
                }
                else if(checkServerArray != undefined || checkServerArray != null)
                {
                    $log.debug("Do nothing");       
                }
            });
            getBmUnreadInfoCount();
            $log.debug("Info from Server ", $scope.info);   
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
            }, 2000);
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
    
    
    function insertTendersEn()
    {
        DataBaseFactory.insertToEnTendersTable()
        .then(function(data){
            $scope.tenders = data.data;
            angular.forEach($scope.tenders, function(tender){
                var tenderIdFromServer = parseInt(tender.ows_Id);
                $log.debug(tenderIdFromServer);
                var checkServerArray = _.find($scope.existingTenders, _.matchesProperty('tenderId', tenderIdFromServer));
                $log.debug(checkServerArray);
                if(checkServerArray == undefined)
                {
                    var query = "INSERT INTO englishTenders (cmsID, tenderId, closingDate, status, catName, language, favorite) VALUES (?,?,?,?,?,?,?)";
//                    var endingTime = Date.parse(tender.ows_TarikhTenderDitutup).getTime()/1000;
//                    $log.debug("++++++++ ", endingTime);
                    $cordovaSQLite.execute(db, query, [tender.tenderIdInCms, tender.ows_Id, tender.ows_TarikhTenderDitutup, 'unread', tender.ows_KategoriTender, 'en', 'false'])
                    .then(function(res) {
                        $log.debug("Added New Tender - INSERT ID -> " + res.insertId);
                    }, function (err) {
                        $log.debug(err);
                    });
                }
                else if(checkServerArray != undefined || checkServerArray != null)
                {
                    $log.debug("Do nothing");       
                }
            });
            getEnUnreadTenderCount();
            $log.debug("Tenders from Server ", $scope.tenders);   
        });
    }
    
    function insertInfoEn()
    {
        DataBaseFactory.insertToEnInfoTable()
        .then(function(data){
            $scope.info = data.data;
            $log.debug("Server Info");
            angular.forEach($scope.info, function(info){
                var infoIdFromServer = parseInt(info.ows_ID);
                $log.debug(infoIdFromServer);
                var checkServerArray = _.find($scope.existingInfo, _.matchesProperty('infoId', infoIdFromServer));
                $log.debug(checkServerArray);
                if(checkServerArray == undefined)
                {
                    var query = "INSERT INTO englishInfo (infoId, language, status) VALUES (?,?,?)";
                    $cordovaSQLite.execute(db2, query, [info.ows_ID, 'en', 'unread'])
                    .then(function(res) {
                        $log.debug("Added New Info - INSERT ID -> " + res.insertId);
                    }, function (err) {
                        $log.debug(err);
                    });
                }
                else if(checkServerArray != undefined || checkServerArray != null)
                {
                    $log.debug("Do nothing");       
                }
            });
            getEnUnreadInfoCount();
            $log.debug("Info from Server ", $scope.info);   
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
            }, 2000);
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
            $log.debug("Outter badge set");
            }, function(err) {
            $log.debug(err);
            });    
        }, function(no) {
        
        });
    }
    
    $scope.goToTenders = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.enCategories');  
    }
    
    $scope.goToInfo = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.enInfo');  
    }
    
    $scope.goToSettings = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.settings');  
    }
    
    $scope.goToContactUs = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.enContactAbout');  
    }
    
    $scope.goToFavourites = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.favorites');  
    }                    
    
});