mainApp.controller('MenuCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $stateParams, $cordovaEmailComposer, $cordovaCalendar, $cordovaSocialSharing, $cordovaInAppBrowser) {
    
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