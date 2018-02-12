mainApp.controller('InfoPageCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $sce, $cordovaBadge) {

    $ionicLoading.show({
        template: '<p class="item-icon-center"><ion-spinner icon="ios"/></p>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 10000
    });
    
    $scope.localInfo = [];
    $scope.infoArray = [];
    $rootScope.loadDatabase();
    
    switch($rootScope.language) {
        case "ms-MS":
            $scope.title = 'Hebahan';
            $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getMalayNews')
            .success(function(data){
                $log.debug("Info List ", data);
                $scope.InfoFromServer = data;;
                angular.forEach(data, function(info){
                    var infoId = parseInt(info.ows_ID);
                    var query = "SELECT * from malayInfo WHERE infoId ="+infoId;
                    $cordovaSQLite.execute(db2, query)
                    .then(function (result) {
                    if(result.rows.length > 0) {
                        for(i = 0; i < result.rows.length; i++)
                        {
                            $scope.localInfo.push(result.rows.item(i));
                        }
                    }
                    $log.debug("Info from Local Database By Category ", $scope.localInfo);
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                });

                $timeout(function(){
                    angular.forEach($scope.InfoFromServer, function(data){
                        var matchObject = _.find($scope.localInfo, { 'infoId': parseInt(data.ows_ID) });
                        $log.debug("TEST ", matchObject);
                        if(matchObject){
                            if(matchObject.status == 'unread')
                            {
                                var infoObject = {
                                    ows_LinkTitle  : data.ows_LinkTitle ,
                                    ows_Details  : data.ows_Details ,
                                    ows_ID  : data.ows_ID ,
                                    ows_CreatedDate  : data.ows_CreatedDate ,
                                    ows_Description  : data.ows_Description,
                                    status : 'unread'
                                }

                                $scope.infoArray.push(infoObject);    
                            }
                            else
                            {
                                var infoObject = {
                                    ows_LinkTitle  : data.ows_LinkTitle ,
                                    ows_Details  : data.ows_Details ,
                                    ows_ID  : data.ows_ID ,
                                    ows_CreatedDate  : data.ows_CreatedDate,
                                    ows_Description  : data.ows_Description,
                                    status : 'read'
                                }

                                $scope.infoArray.push(infoObject);    
                            }
                        }
                    });
                    getBmUnreadTenderCount();
                    getBmUnreadInfoCount();
                    $ionicLoading.hide()
                }, 2000);
            }, function (error){
                $log.debug(error);
            });
            break;
        case "en-US":
            $scope.title = 'Info';
            $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getEnglishNews')
            .success(function(data){
                $log.debug("Info List ", data);
                $scope.InfoFromServer = data;
                angular.forEach(data, function(info){
                    var infoId = parseInt(info.ows_ID);
                    var query = "SELECT * from englishInfo WHERE infoId ="+infoId;
                    $cordovaSQLite.execute(db2, query)
                    .then(function (result) {
                    if(result.rows.length > 0) {
                        for(i = 0; i < result.rows.length; i++)
                        {
                            $scope.localInfo.push(result.rows.item(i));
                        }
                    }
                    $log.debug("Info from Local Database By Category ", $scope.localInfo);
                    }, function (error) {
                      console.warn('I found an error');
                      console.warn(error);
                    });
                });

                $timeout(function(){
                    angular.forEach($scope.InfoFromServer, function(data){
                        var matchObject = _.find($scope.localInfo, { 'infoId': parseInt(data.ows_ID) });
                        $log.debug("TEST ", matchObject);
                        if(matchObject){
                            if(matchObject.status == 'unread')
                            {
                                var infoObject = {
                                    ows_LinkTitle  : data.ows_LinkTitle ,
                                    ows_Details  : data.ows_Details ,
                                    ows_ID  : data.ows_ID ,
                                    ows_CreatedDate  : data.ows_CreatedDate ,
                                    ows_Description  : data.ows_Description ,
                                    status : 'unread' 
                                }

                                $scope.infoArray.push(infoObject);    
                            }
                            else
                            {
                                var infoObject = {
                                    ows_LinkTitle  : data.ows_LinkTitle ,
                                    ows_Details  : data.ows_Details ,
                                    ows_ID  : data.ows_ID ,
                                    ows_CreatedDate  : data.ows_CreatedDate ,
                                    ows_Description  : data.ows_Description ,
                                    status : 'read'
                                }

                                $scope.infoArray.push(infoObject);    
                            }
                        }
                    });
                    getEnUnreadTenderCount();
                    getEnUnreadInfoCount();
                    $ionicLoading.hide();
                }, 2000);
            }, function (error){
                $log.debug(error);
            });
            break;
    }
    
    
    $scope.toggleGroup = function(index) {
        switch($rootScope.language) {
            case "ms-MS":
                if($scope.infoArray[index].status == 'unread')
                {
                    $scope.infoArray[index].status = 'read';
                }
                $log.debug($scope.infoArray[index]);
                var query = "update malayInfo set status = 'read' where infoId="+$scope.infoArray[index].ows_ID;
                $cordovaSQLite.execute(db2, query)
                .then(function (result) {
                    $log.debug("Info Status Changed to True in Local Database");
                }, function (error) {
                  console.warn('I found an error');
                  console.warn(error);
                });
                $timeout(function() {
                    $ionicScrollDelegate.resize();
                }, 300);
                if ($scope.isGroupShown(index)) {
                    $scope.shownGroup = null;
                } 
                else 
                {
                    $scope.shownGroup = index;
                    $scope.shownReadGroup = null;
                }
                $location.hash($scope.infoArray[index].ows_ID);
                $log.debug($location.hash());
                $ionicScrollDelegate.anchorScroll();
                getBmUnreadTenderCount();
                getBmUnreadInfoCount();
                break;
            case "en-US":
                if($scope.infoArray[index].status == 'unread')
                {
                    $scope.infoArray[index].status = 'read';
                }
                $log.debug($scope.infoArray[index]);
                var query = "update englishInfo set status = 'read' where infoId="+$scope.infoArray[index].ows_ID;
                $cordovaSQLite.execute(db2, query)
                .then(function (result) {
                    $log.debug("Info Status Changed to True in Local Database");
                }, function (error) {
                  console.warn('I found an error');
                  console.warn(error);
                });
                $timeout(function() {
                    $ionicScrollDelegate.resize();
                }, 300);
                if ($scope.isGroupShown(index)) {
                    $scope.shownGroup = null;
                } 
                else 
                {
                    $scope.shownGroup = index;
                    $scope.shownReadGroup = null;
                }
                $location.hash($scope.infoArray[index].ows_ID);
                $log.debug($location.hash());
                $ionicScrollDelegate.anchorScroll();
                getEnUnreadTenderCount();
                getEnUnreadInfoCount();
                break;

        }
    };
    $scope.isGroupShown = function(index) {
        return $scope.shownGroup === index;
    };
    
    
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

mainApp.filter('hrefToJS', function ($sce, $sanitize, $log) {
    return function (text) {
        $log.debug("Text ", text);
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");
        $log.debug("New Text ", newString);
        return $sce.trustAsHtml(newString);
    }
});