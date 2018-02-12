mainApp.controller('ContactUsCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $cordovaEmailComposer, $cordovaBadge) {

    $scope.feedbackForm = {};
    
    switch($rootScope.language) {
        case "ms-MS":
            $scope.title = 'Hubungi Kami';
            $scope.thankYouFeedback = "Terima kasih atas maklum balas anda";
            getBmUnreadTenderCount();
            getBmUnreadInfoCount();
            break;
        case "en-US":
            $scope.title = 'Contact Us';
            $scope.thankYouFeedback = "Thank you for your feedback";
            getEnUnreadTenderCount();
            getEnUnreadInfoCount();
            break;

    } 
    
    $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getCorporateEmailAddress')
    .success(function(data){
        $scope.emailAddress = data.emailAddress;
    }, function (error){
         $log.debug(error);   
    });
    
    $scope.submitForm = function(){
        console.log("Submit Form", $scope.feedbackForm);
        $http({url: "http://www.cloudbasha.com:8080/fgvedaftar/data/saveFeedBack", method: "POST", params: $scope.feedbackForm
        }).success(function(result){ 
        $ionicPopup.alert({
            title: 'FeedbackForm',
            template: $scope.thankYouFeedback
        });
        $cordovaEmailComposer.isAvailable().then(function() {
            $log.debug("Found Email ");
            var test = "test"
            var email = {
                to : $scope.emailAddress,
                subject : "Feedback",
                body : "Name : " + $scope.feedbackForm.name + "<br><br> Email : " + $scope.feedbackForm.emailAddress + "<br><br> Message : " + $scope.feedbackForm.content, 
                isHtml: true
            };

            $cordovaEmailComposer.open(email).then(function () {
                $log.debug("Opening Email");
                $timeout(function(){
                    $scope.feedbackForm = {};
                }, 2000);
            }, function(err){
                $log.debug("Cancel Email Client");
            }); 
         }, function (err) {
            $ionicPopup.alert({
                title: 'Email Composer Error',
                template: 'There are no registered Email Accounts on this device. Please add an Email account to this device before using this feature.'
            });
        });
        $log.debug("Feedback form success", result);   
        }, function(err){
        $log.debug("Error ", err);
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
