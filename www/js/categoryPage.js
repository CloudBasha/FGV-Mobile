mainApp.controller('CategoryPageCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $cordovaBadge) {

    $ionicLoading.show({
        template: '<p class="item-icon-center"><ion-spinner icon="ios"/></p>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 10000
    });
    var tenders = [];
    var tendersRead = [];
    $scope.groupedTenders2 = [];
    
    switch($rootScope.language) {
    case "ms-MS":
        $scope.title = 'Kategori';
        $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getTenderCategory?language=ms')
        .success(function(data){
            var dateNow = new Date().getTime()/1000;
            $log.debug("TimeStamp ", dateNow);
            $log.debug("Categories ", data);
            var query = "SELECT * from malayTenders";
            $cordovaSQLite.execute(db, query)
            .then(function (result) {
                if(result.rows.length > 0) 
                {
                    for(i = 0; i < result.rows.length; i++)
                    {
                        if((Date.parse(result.rows.item(i).closingDate).getTime()/1000) > dateNow)
                        {
                            if(result.rows.item(i).status == 'unread')
                            {
                                tenders.push(result.rows.item(i));
                            }
                            else
                            {
                                tendersRead.push(result.rows.item(i));
                            }
                        }
                    }
                    var groupedTenders = _.groupBy(tenders, 'catName');
                    var groupedTenders2 = _.groupBy(tendersRead, 'catName');
                    _.forEach(groupedTenders, function(value, key) {
                        var categoryUnreadObj = {
                            'name' : key,
                            'unread' : value.length,
                            'tenderArray' : value
                        }
                        $scope.groupedTenders2.push(categoryUnreadObj);
                    });
                    _.forEach(groupedTenders2, function(value, key) {
                        var checkServerArray = _.find($scope.groupedTenders2, _.matchesProperty('name', key));
                        $log.debug(key + " = " + checkServerArray);
                        if(checkServerArray == undefined)
                        {
                            var categoryReadObj = {
                                'name' : key,
                                'unread' : '0',
                                'tenderArray' : value
                            }
                            $scope.groupedTenders2.push(categoryReadObj);
                        }
                    });
                    $log.debug("Grouped Tenders ", $scope.groupedTenders2);
                    getBmUnreadTenderCount();
                    getBmUnreadInfoCount();
                    $ionicLoading.hide();
                }
            }, function (error) {
              console.warn('I found an error');
              console.warn(error);
            });
            $scope.categories = data;
        }, function (error){
             $log.debug(error);   
        });
        break;
    case "en-US":
        $scope.title = 'Categories';
        $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getTenderCategory?language=en')
        .success(function(data){
            var dateNow = new Date().getTime()/1000;
            $log.debug("TimeStamp ", dateNow);
            $log.debug("Categories ", data);
            var query = "SELECT * from englishTenders";
            $cordovaSQLite.execute(db, query)
            .then(function (result) {
                if(result.rows.length > 0) 
                {
                    for(i = 0; i < result.rows.length; i++)
                    {
                        if((Date.parse(result.rows.item(i).closingDate).getTime()/1000) > dateNow)
                        {
                            if(result.rows.item(i).status == 'unread')
                            {
                                tenders.push(result.rows.item(i));
                            }
                            else
                            {
                                tendersRead.push(result.rows.item(i));
                            }
                        }
                    }
                    var groupedTenders = _.groupBy(tenders, 'catName');
                    var groupedTenders2 = _.groupBy(tendersRead, 'catName');
                    _.forEach(groupedTenders, function(value, key) {
                        var categoryUnreadObj = {
                            'name' : key,
                            'unread' : value.length,
                            'tenderArray' : value
                        }
                        $scope.groupedTenders2.push(categoryUnreadObj);
                    });
                    _.forEach(groupedTenders2, function(value, key) {
                        var checkServerArray = _.find($scope.groupedTenders2, _.matchesProperty('name', key));
                        $log.debug(key + " = " + checkServerArray);
                        if(checkServerArray == undefined)
                        {
                            var categoryReadObj = {
                                'name' : key,
                                'unread' : '0',
                                'tenderArray' : value
                            }
                            $scope.groupedTenders2.push(categoryReadObj);
                        }
                    });
                    $log.debug("Grouped Tenders ", $scope.groupedTenders2);
                    getEnUnreadTenderCount();
                    getEnUnreadInfoCount();
                    $ionicLoading.hide();
                }
            }, function (error) {
              console.warn('I found an error');
              console.warn(error);
            });
            $scope.categories = data;
        }, function (error){
             $log.debug(error);   
        });
        break;

    } 
    
    $scope.goToCategory = function(catName){
        $state.go('app.enTenderList', {obj: catName});
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