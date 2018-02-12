mainApp.factory('DataBaseFactory', function($state, $ionicPlatform, $ionicHistory, $timeout, $cordovaToast, $ionicNavBarDelegate, $http, $cordovaSQLite, $log, $q){
var DataBaseFactory = {};

DataBaseFactory.insertToBmTendersTable = function()
{
    return $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getMalayTender');   
}

DataBaseFactory.insertToBmInfoTable = function()
{
    return $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getMalayNews');   
}

DataBaseFactory.insertToEnTendersTable = function()
{
    return $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getEnglishTender');   
}

DataBaseFactory.insertToEnInfoTable = function()
{
    return $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getEnglishNews');   
}

DataBaseFactory.getTendersBm = function()
{
    var q = $q.defer();
    var query = "SELECT * from malayTenders;";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query)
        .then(function (result) {
          var i, len, allItems = [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                allItems.push(result.rows.item(i));
            }
            q.resolve(allItems);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

DataBaseFactory.getInfoBm = function()
{
    var q = $q.defer();
    var query = "SELECT * from malayInfo;";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db2, query)
        .then(function (result) {
          var i, len, allInfo= [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                allInfo.push(result.rows.item(i));
            }
            q.resolve(allInfo);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

DataBaseFactory.getTendersEn = function()
{
    var q = $q.defer();
    var query = "SELECT * from englishTenders;";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query)
        .then(function (result) {
          var i, len, allItems = [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                allItems.push(result.rows.item(i));
            }
            q.resolve(allItems);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

DataBaseFactory.getInfoEn = function()
{
    var q = $q.defer();
    var query = "SELECT * from englishInfo;";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db2, query)
        .then(function (result) {
          var i, len, allInfo= [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                allInfo.push(result.rows.item(i));
            }
            q.resolve(allInfo);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

DataBaseFactory.getUnreadTendersCountBm = function()
{
    var q = $q.defer();
    var query = "SELECT * from malayTenders WHERE status = 'unread'";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query)
        .then(function (result) {
            var i, len, unreadItems = [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                $log.debug("Tender Status ", result.rows.item(i).status);
                unreadItems.push(result.rows.item(i));
            }
            q.resolve(unreadItems);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

DataBaseFactory.getUnreadTendersCountEn = function()
{
    var q = $q.defer();
    var query = "SELECT * from englishTenders WHERE status = 'unread'";
	$ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query)
        .then(function (result) {
            var i, len, unreadItems = [];
            for(i = 0, len = result.rows.length; i < len; i++) {
                $log.debug("Tender Status ", result.rows.item(i).status);
                unreadItems.push(result.rows.item(i));
            }
            q.resolve(unreadItems);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
}

return DataBaseFactory;
});