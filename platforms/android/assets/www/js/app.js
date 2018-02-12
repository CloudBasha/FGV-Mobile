// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var mainApp = angular.module('fgvApp', ['ionic', 'ngCordova', 'angular-storage', 'ngLocalize', 'ngSanitize', 'ngMessages']);

mainApp.value('localeConf', {
    basePath: 'languages',
    defaultLocale: 'ms-Ms',
    sharedDictionary: 'common',
    fileExtension: '.lang.json',
    persistSelection: true,
    cookieName: 'COOKIE_LOCALE_LANG',
    observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
    delimiter: '::'
    });

  mainApp.value('localeSupported', [
    'en-US',
    'ms-MS'
  ]);

mainApp.run(function($ionicPlatform, backcallFactory, DataBaseFactory, $cordovaSQLite, store, $rootScope, $timeout, locale, $cordovaDevice, $log, $cordovaPush, $http, $cordovaBadge) {
  $ionicPlatform.ready(function() {
    var platform = $cordovaDevice.getPlatform();
    $rootScope.platform = $cordovaDevice.getPlatform();
    $log.debug("---------",platform);
    var device = $cordovaDevice.getModel();
    $log.debug("---------",device);
      
    switch(platform) {
        case "Android":
            var androidConfig = {
                "senderID": "816802078359",
            };
            $cordovaPush.register(androidConfig).then(function(result) {
              $log.debug("GCM Registration Succesful", result);
            }, function(err) {
              // Error
            });
            
            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
              switch(notification.event) {
                case 'registered':
                  if (notification.regid.length > 0 ) {
                      $http({
                        url: "http://www.cloudbasha.com:8080/fgvedaftar/data/registerDevice", 
                        method: "POST",
                        params: {'model': device,'longitude': "0.0",'latitude': "0.0",'deviceId':notification.regid}
                      })
                      .success(function(result){
                        $log.debug("GCM ID", notification.regid);   
                        $log.debug("Registration Success on Server", result);   
                      }, function(err){
                        $log.debug("Error ", err);
                      });
                  }
                  break;

                case 'message':
                    console.log("Testing1", notification);
                    var tenderCounter = notification.message.split(" ");
                    var tenderCount = parseInt(tenderCounter[0]);
                    document.addEventListener('pause', function () {
                        $cordovaBadge.increase(tenderCount).then(function() {
                            $log.debug("Badge Increase Working", tenderCount);
                        }, function(err) {
                        // You do not have permission.
                            $log.debug("Badge Increase Not Working", err);
                        });
                    }, false);
                  break;

                case 'error':
                  $log.debug('GCM error = ' + notification.msg);
                  break;

                default:
                  $log.debug('An unknown GCM event has occurred');
                  break;
              }
            });
           
            break;
        case "iOS":
            var iosConfig = {
                "badge": true,
                "sound": true,
                "alert": true,
            };
            $cordovaPush.register(iosConfig).then(function(deviceToken) {
                console.log("Device Token For Server ", deviceToken);
                $http({
                    url: "http://www.cloudbasha.com:8080/fgvedaftar/data/registerDevice", 
                    method: "POST",
                    params: {'model': device,'longitude': "0.0",'latitude': "0.0",'deviceId': deviceToken}
                })
                .success(function(result){
                    console.log("GCM ID", deviceToken);   
                    console.log("Registration Success on Server", result);   
                }, function(err){
                    console.log("Error ", err);
                });
            }, function(error){
               console.log("GCM Error for Ios" , error);    
            });
    


            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                if (notification.alert)
                {
                    console.log("Push Received");
                    navigator.notification.alert(notification.alert);
                }

                if (notification.sound) 
                {
                    var snd = new Media(event.sound);
                    snd.play();
                }

                if (notification.badge) 
                {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                      // Success!
                    }, function(err) {
                      // An error occurred. Show a message to the user
                    });
                }
            });
            break;
    }
      
    var newDB = store.get('newDB');
      $log.debug("New Database ",newDB);
    if(newDB == undefined || null)
    {
        window.sqlitePlugin.deleteDatabase({name: 'my.db'}, successcb, errorcb);    
        var newDBSet = {
          newDatabase : true
        } 
        store.set('newDB', newDBSet);
    }

    function successcb(){
        $log.debug("Delete Database working");    
    }

    function errorcb(){
        $log.debug("Delete Database Error");    
    } 
      
    var language = store.get('language');
    if(language != undefined)
    {
        $rootScope.language = language.localeSetting; 
        locale.setLocale($rootScope.language);
    }
    else
    {
        $rootScope.language = 'ms-MS'; 
        locale.setLocale($rootScope.language);
        var myNewObject2 = {
          localeSetting : "ms-MS"
        } 

        store.set('language', myNewObject2);
    }
    $rootScope.loadDatabase = function(){
        switch($rootScope.language) {
            case "ms-MS":
                db = $cordovaSQLite.openDB("malayTenders.db");
                db2 = $cordovaSQLite.openDB("malayInfo.db");
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS malayTenders (id integer primary key,  cmsId integer, tenderId integer, closingDate DATETIME, status text, catName text, language text, favorite text)");
                $cordovaSQLite.execute(db2, "CREATE TABLE IF NOT EXISTS malayInfo (id integer primary key, infoId integer, language text, status text)");
                break;
            case "en-US":
                db = $cordovaSQLite.openDB("englishTenders.db");
                db2 = $cordovaSQLite.openDB("englishInfo.db");
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS englishTenders (id integer primary key,  cmsId integer, tenderId integer, closingDate DATETIME, status text, catName text, language text, favorite text)");
                $cordovaSQLite.execute(db2, "CREATE TABLE IF NOT EXISTS englishInfo (id integer primary key, infoId integer, language text, status text)");
                break;
        }
    }
    $rootScope.loadDatabase();
//    switch($rootScope.language) {
//        case "ms-MS":
//            $rootScope.loadDatabase();
//            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS malayTenders (id integer primary key,  cmsId integer, tenderId integer, closingDate DATETIME, status text, catName text, language text, favorite text)");
//            $cordovaSQLite.execute(db2, "CREATE TABLE IF NOT EXISTS malayInfo (id integer primary key, infoId integer, language text, status text)");
//            break;
//        case "en-US":
//            $rootScope.loadDatabase();
//            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS englishTenders (id integer primary key,  cmsId integer, tenderId integer, closingDate DATETIME, status text, catName text, language text, favorite text)");
//            $cordovaSQLite.execute(db2, "CREATE TABLE IF NOT EXISTS englishInfo (id integer primary key, infoId integer, language text, status text)");
//            break;
//
//    }
      
    backcallFactory.backcallfun();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
  });
})

mainApp.config(function($stateProvider, $urlRouterProvider, $logProvider) {

  $logProvider.debugEnabled(false);
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller : 'MenuCtrl'
  })

  .state('app.enLandingPage', {
    url: '/enLandingPage',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-landing-page.html',
        controller : 'LandingPageCtrl'
      }
    },
    cache:false
  })
  
  .state('app.enCategories', {
    url: '/enCategories',
    views: {
      'menuContent': {
        templateUrl: 'templates/enCategories.html',
        controller : 'CategoryPageCtrl'
      }
    },
    cache:false
  })
  
  .state('app.enTenderList', {
    url: '/enTenderList',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-tender-list.html',
        controller : 'TenderListPageCtrl'
      }
    },
    params: {obj: null},
    cache: false
  })
  
  .state('app.enTenderDetails', {
    url: '/enTenderDetails',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-tender-details.html',
        controller : 'TenderDetailsPageCtrl'
      }
    },
    params: {obj: null},
    cache:false
  })
  
  .state('app.enInfo', {
    url: '/enInfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-info.html',
        controller : 'InfoPageCtrl'
      }
    },
    params: {obj: null},
    cache:false
  })
  
  .state('app.enContactAbout', {
    url: '/enContactAbout',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-contact-about.html',
        controller : 'ContactAboutUsCtrl'
      }
    },
    cache:false
  })
  
  .state('app.enContactUs', {
    url: '/enContactUs',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-contact-us.html',
        controller : 'ContactUsCtrl'
      }
    },
    cache:false
  })
  
  .state('app.enAboutUs', {
    url: '/enAboutUs',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-about-us.html',
        controller : 'AboutUsCtrl'
      }
    },
    cache:false
  })
  
  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-favourite.html',
        controller : "FavoritesCtrl"
      }
    },
    cache:false
  })
  
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/en-settings.html',
        controller : "SettingsCtrl"
      }
    },
    cache:false
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/enLandingPage');
});

mainApp.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout','$cordovaToast','$ionicNavBarDelegate',function($state,$ionicPlatform,$ionicHistory,$timeout, $cordovaToast, $ionicNavBarDelegate){
var backTap = 0;
var obj={}
    obj.backcallfun=function(){
  
       $ionicPlatform.registerBackButtonAction(function () {
            if ($state.current.name == "app.enLandingPage") 
            {
                if(backTap === 0)
                {
                    backTap++;
                    $cordovaToast.showShortBottom("Press again to exit");
                    $timeout(function(){
                      backTap = 0;
                    }, 2000);
                }   
                else
                {
                    navigator.app.exitApp();
                }
            }
            else if($state.current.name == "app.enCategories" || $state.current.name == "app.enInfo" || $state.current.name == "app.settings" || $state.current.name == "app.enContactAbout" || $state.current.name == "app.favorites")
            {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.enLandingPage'); 
            }
            else
            {
                $ionicHistory.goBack();       
            }
       }, 100);
    }
return obj;
}]);

mainApp.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      return config;
    }
  };
});
