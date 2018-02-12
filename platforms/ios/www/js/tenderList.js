mainApp.controller('TenderListPageCtrl', function($scope, $timeout, $state, $ionicLoading, store, $filter, $http, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaToast, $ionicPopup, $ionicHistory, $location, $log, DataBaseFactory, $cordovaSQLite, $stateParams, $cordovaEmailComposer, $cordovaCalendar, $cordovaSocialSharing, $cordovaBadge) {
    $scope.localTenders = [];
    $scope.unreadTendersArray = [];
    $scope.readTendersArray = [];
    $ionicLoading.show({
        template: '<p class="item-icon-center"><ion-spinner icon="ios"/></p>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 10000
    });
    $scope.paramsObject = $stateParams.obj;
    switch($rootScope.language) {
    case "ms-MS":
        $scope.title = "Tender";
        $scope.paramsObject = $scope.paramsObject.replace(/\&/g, "%26");
        $log.debug($scope.paramsObject);
        $scope.calendarEventMessage = "Acara Berjaya Ditambah";
        $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getTenderByCategoryName?categoryName=' + $scope.paramsObject)
        .success(function(data){
            $log.debug("Tender List ", data);
            $scope.tendersFromServer = data;
            angular.forEach(data, function(tenderInfo){
                var tenderId = parseInt(tenderInfo.ows_Id);
                var query = "SELECT * from malayTenders WHERE tenderId ="+tenderId;
                $cordovaSQLite.execute(db, query)
                .then(function (result) {
                if(result.rows.length > 0) {
                    for(i = 0; i < result.rows.length; i++)
                    {
                        $scope.localTenders.push(result.rows.item(i));
                    }
                }
                $log.debug("Tender from Local Database By Category ", $scope.localTenders);
                }, function (error) {
                  console.warn('I found an error');
                  console.warn(error);
                });
            });

            $timeout(function(){
                var dateNow = new Date().getTime()/1000;
                angular.forEach($scope.tendersFromServer, function(data){
                    var matchObject = _.find($scope.localTenders, { 'tenderId': parseInt(data.ows_Id) });
                    $log.debug("TEST ", matchObject);
                    var endingTime = Date.parse(data.ows_TarikhTenderDitutup).getTime()/1000;
                    $log.debug("++++++++ ", endingTime);
                    if(endingTime > dateNow)
                    {
                        if(matchObject.status == 'unread')
                        {
                            var tenderObject = {
                                attachmentFileName : data.attachmentFileName,
                                attachmentFileUrl : data.attachmentFileUrl,
                                ows_Attachments : data.ows_Attachments,
                                ows_DeskripsiTender : data.ows_DeskripsiTender,
                                ows_EmelPegawaiUntukDihubungi : data.ows_EmelPegawaiUntukDihubungi,
                                ows_Gred_x003a_Gred : data.ows_Gred_x003a_Gred,
                                ows_HargaJualanNaskahTender : data.ows_HargaJualanNaskahTender,
                                ows_Id : data.ows_Id,
                                ows_KategoriTender : data.ows_KategoriTender,
                                ows_LawatanTapakTaklimat : data.ows_LawatanTapakTaklimat,
                                ows_LokasiLawatanTapakTaklimat : data.ows_LokasiLawatanTapakTaklimat,
                                ows_Lokasi_x002f_Ladang : data.ows_Lokasi_x002f_Ladang,
                                ows_NoTelefon : data.ows_NoTelefon,
                                ows_PegawaiUntukDihubungi : data.ows_PegawaiUntukDihubungi,
                                ows_TahapPendaftaranKategori : data.ows_TahapPendaftaranKategori,
                                ows_TarikhLawatanTapak : data.ows_TarikhLawatanTapak,
                                ows_TarikhTenderDibuka : data.ows_TarikhTenderDibuka,
                                ows_TarikhTenderDitutup : data.ows_TarikhTenderDitutup,
                                ows_TarikhTerbitdiPortal : data.ows_TarikhTerbitdiPortal,
                                ows_TarikhdanMasaPenjualanDokumenTen : data.ows_TarikhdanMasaPenjualanDokumenTen,
                                ows_TenderDipanggilolehSyarikat : data.ows_TenderDipanggilolehSyarikat,
                                ows_TenderOpeningDateDisplay : data.ows_TenderOpeningDateDisplay,
                                ows_Title : data.ows_Title,
                                tenderIdInCms : data.tenderIdInCms,
                                favorite : matchObject.favorite  
                            }

                            $scope.unreadTendersArray.push(tenderObject);    
                        }
                        else
                        {
                            var tenderObject = {
                                attachmentFileName : data.attachmentFileName,
                                attachmentFileUrl : data.attachmentFileUrl,
                                ows_Attachments : data.ows_Attachments,
                                ows_DeskripsiTender : data.ows_DeskripsiTender,
                                ows_EmelPegawaiUntukDihubungi : data.ows_EmelPegawaiUntukDihubungi,
                                ows_Gred_x003a_Gred : data.ows_Gred_x003a_Gred,
                                ows_HargaJualanNaskahTender : data.ows_HargaJualanNaskahTender,
                                ows_Id : data.ows_Id,
                                ows_KategoriTender : data.ows_KategoriTender,
                                ows_LawatanTapakTaklimat : data.ows_LawatanTapakTaklimat,
                                ows_LokasiLawatanTapakTaklimat : data.ows_LokasiLawatanTapakTaklimat,
                                ows_Lokasi_x002f_Ladang : data.ows_Lokasi_x002f_Ladang,
                                ows_NoTelefon : data.ows_NoTelefon,
                                ows_PegawaiUntukDihubungi : data.ows_PegawaiUntukDihubungi,
                                ows_TahapPendaftaranKategori : data.ows_TahapPendaftaranKategori,
                                ows_TarikhLawatanTapak : data.ows_TarikhLawatanTapak,
                                ows_TarikhTenderDibuka : data.ows_TarikhTenderDibuka,
                                ows_TarikhTenderDitutup : data.ows_TarikhTenderDitutup,
                                ows_TarikhTerbitdiPortal : data.ows_TarikhTerbitdiPortal,
                                ows_TarikhdanMasaPenjualanDokumenTen : data.ows_TarikhdanMasaPenjualanDokumenTen,
                                ows_TenderDipanggilolehSyarikat : data.ows_TenderDipanggilolehSyarikat,
                                ows_TenderOpeningDateDisplay : data.ows_TenderOpeningDateDisplay,
                                ows_Title : data.ows_Title,
                                tenderIdInCms : data.tenderIdInCms,
                                favorite : matchObject.favorite  
                            }
                            $scope.readTendersArray.push(tenderObject);    
                        }
                    }
                });
                getBmUnreadTenderCount();
                getBmUnreadInfoCount();
                $ionicLoading.hide();
            }, 1000);
        }, function (error){
            $log.debug(error);
        });
        break;
    case "en-US":
        $scope.title = "Tenders";
        $scope.calendarEventMessage = "Event Added Successfully";
        $scope.paramsObject = $scope.paramsObject.replace(/\&/g, "%26");
        $log.debug($scope.paramsObject);
        $http.get('http://www.cloudbasha.com:8080/fgvedaftar/data/getTenderByCategoryName?categoryName=' + $scope.paramsObject)
        .success(function(data){
            $log.debug("Tender List ", data);
            $scope.tendersFromServer = data;
            angular.forEach(data, function(tenderInfo){
                var tenderId = parseInt(tenderInfo.ows_Id);
                var query = "SELECT * from englishTenders WHERE tenderId ="+tenderId;
                $cordovaSQLite.execute(db, query)
                .then(function (result) {
                if(result.rows.length > 0) {
                    for(i = 0; i < result.rows.length; i++)
                    {
                        $scope.localTenders.push(result.rows.item(i));
                    }
                }
                $log.debug("Tender from Local Database By Category ", $scope.localTenders);
                }, function (error) {
                  console.warn('I found an error');
                  console.warn(error);
                });
            });

            $timeout(function(){
                var dateNow = new Date().getTime()/1000;
                angular.forEach($scope.tendersFromServer, function(data){
                    var matchObject = _.find($scope.localTenders, { 'tenderId': parseInt(data.ows_Id) });
                    $log.debug("TEST ", matchObject);
                    var endingTime = Date.parse(data.ows_TarikhTenderDitutup).getTime()/1000;
                    $log.debug("++++++++ ", endingTime);
                    if(endingTime > dateNow)
                    {
                        if(matchObject.status == 'unread')
                        {
                            var tenderObject = {
                                attachmentFileName : data.attachmentFileName,
                                attachmentFileUrl : data.attachmentFileUrl,
                                ows_Attachments : data.ows_Attachments,
                                ows_DeskripsiTender : data.ows_DeskripsiTender,
                                ows_EmelPegawaiUntukDihubungi : data.ows_EmelPegawaiUntukDihubungi,
                                ows_Gred_x003a_Gred : data.ows_Gred_x003a_Gred,
                                ows_HargaJualanNaskahTender : data.ows_HargaJualanNaskahTender,
                                ows_Id : data.ows_Id,
                                ows_KategoriTender : data.ows_KategoriTender,
                                ows_LawatanTapakTaklimat : data.ows_LawatanTapakTaklimat,
                                ows_LokasiLawatanTapakTaklimat : data.ows_LokasiLawatanTapakTaklimat,
                                ows_Lokasi_x002f_Ladang : data.ows_Lokasi_x002f_Ladang,
                                ows_NoTelefon : data.ows_NoTelefon,
                                ows_PegawaiUntukDihubungi : data.ows_PegawaiUntukDihubungi,
                                ows_TahapPendaftaranKategori : data.ows_TahapPendaftaranKategori,
                                ows_TarikhLawatanTapak : data.ows_TarikhLawatanTapak,
                                ows_TarikhTenderDibuka : data.ows_TarikhTenderDibuka,
                                ows_TarikhTenderDitutup : data.ows_TarikhTenderDitutup,
                                ows_TarikhTerbitdiPortal : data.ows_TarikhTerbitdiPortal,
                                ows_TarikhdanMasaPenjualanDokumenTen : data.ows_TarikhdanMasaPenjualanDokumenTen,
                                ows_TenderDipanggilolehSyarikat : data.ows_TenderDipanggilolehSyarikat,
                                ows_TenderOpeningDateDisplay : data.ows_TenderOpeningDateDisplay,
                                ows_Title : data.ows_Title,
                                tenderIdInCms : data.tenderIdInCms,
                                favorite : matchObject.favorite  
                            }

                            $scope.unreadTendersArray.push(tenderObject);    
                        }
                        else
                        {
                            var tenderObject = {
                                attachmentFileName : data.attachmentFileName,
                                attachmentFileUrl : data.attachmentFileUrl,
                                ows_Attachments : data.ows_Attachments,
                                ows_DeskripsiTender : data.ows_DeskripsiTender,
                                ows_EmelPegawaiUntukDihubungi : data.ows_EmelPegawaiUntukDihubungi,
                                ows_Gred_x003a_Gred : data.ows_Gred_x003a_Gred,
                                ows_HargaJualanNaskahTender : data.ows_HargaJualanNaskahTender,
                                ows_Id : data.ows_Id,
                                ows_KategoriTender : data.ows_KategoriTender,
                                ows_LawatanTapakTaklimat : data.ows_LawatanTapakTaklimat,
                                ows_LokasiLawatanTapakTaklimat : data.ows_LokasiLawatanTapakTaklimat,
                                ows_Lokasi_x002f_Ladang : data.ows_Lokasi_x002f_Ladang,
                                ows_NoTelefon : data.ows_NoTelefon,
                                ows_PegawaiUntukDihubungi : data.ows_PegawaiUntukDihubungi,
                                ows_TahapPendaftaranKategori : data.ows_TahapPendaftaranKategori,
                                ows_TarikhLawatanTapak : data.ows_TarikhLawatanTapak,
                                ows_TarikhTenderDibuka : data.ows_TarikhTenderDibuka,
                                ows_TarikhTenderDitutup : data.ows_TarikhTenderDitutup,
                                ows_TarikhTerbitdiPortal : data.ows_TarikhTerbitdiPortal,
                                ows_TarikhdanMasaPenjualanDokumenTen : data.ows_TarikhdanMasaPenjualanDokumenTen,
                                ows_TenderDipanggilolehSyarikat : data.ows_TenderDipanggilolehSyarikat,
                                ows_TenderOpeningDateDisplay : data.ows_TenderOpeningDateDisplay,
                                ows_Title : data.ows_Title,
                                tenderIdInCms : data.tenderIdInCms,
                                favorite : matchObject.favorite  
                            }
                            $scope.readTendersArray.push(tenderObject);    
                        }
                    }
                });
                getEnUnreadTenderCount();
                getEnUnreadInfoCount();
                $ionicLoading.hide();
            }, 1000);
        }, function (error){
            $log.debug(error);
        });
        break;
    }
    
    $scope.setUnreadFavorite = function(index){
            switch($rootScope.language) {
                case "ms-MS":
                    if($scope.unreadTendersArray[index].favorite == 'false')
                    {
                        var query = "update malayTenders set favorite = 'true' where tenderId="+$scope.unreadTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to True in Local Database");
                            $scope.unreadTendersArray[index].favorite = 'true'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    else
                    {
                        var query = "update malayTenders set favorite = 'false' where tenderId="+$scope.unreadTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to False in Local Database");
                            $scope.unreadTendersArray[index].favorite = 'false'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    break;
                case "en-US":
                    if($scope.unreadTendersArray[index].favorite == 'false')
                    {
                        var query = "update englishTenders set favorite = 'true' where tenderId="+$scope.unreadTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to True in Local Database");
                            $scope.unreadTendersArray[index].favorite = 'true'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    else
                    {
                        var query = "update englishTenders set favorite = 'false' where tenderId="+$scope.unreadTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to False in Local Database");
                            $scope.unreadTendersArray[index].favorite = 'false'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    break;
    }
            
        }

        $scope.setReadFavorite = function(index){
            switch($rootScope.language) {
                case "ms-MS":
                    if($scope.readTendersArray[index].favorite == 'false')
                    {
                        var query = "update malayTenders set favorite = 'true' where tenderId="+$scope.readTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to True in Local Database");
                            $scope.readTendersArray[index].favorite = 'true'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    else
                    {
                        var query = "update malayTenders set favorite = 'false' where tenderId="+$scope.readTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to False in Local Database");
                            $scope.readTendersArray[index].favorite = 'false'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    break;
                case "en-US":
                    if($scope.readTendersArray[index].favorite == 'false')
                    {
                        var query = "update englishTenders set favorite = 'true' where tenderId="+$scope.readTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to True in Local Database");
                            $scope.readTendersArray[index].favorite = 'true'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    else
                    {
                        var query = "update englishTenders set favorite = 'false' where tenderId="+$scope.readTendersArray[index].ows_Id;
                        $cordovaSQLite.execute(db, query)
                        .then(function (result) {
                            $log.debug("Tender Favorite Changed to False in Local Database");
                            $scope.readTendersArray[index].favorite = 'false'
                        }, function (error) {
                          console.warn('I found an error');
                          console.warn(error);
                        });
                    }
                    break;

            }
        }
    
    
    $scope.goToUnreadTenderDetails = function(index){
        $state.go('app.enTenderDetails', {obj: $scope.unreadTendersArray[index]});
    }
    
    $scope.goToReadTenderDetails = function(index){
        $state.go('app.enTenderDetails', {obj: $scope.readTendersArray[index]});
    }
    
    $scope.shareUnreadTenderViaEmail = function(index){
        var formatedEmailAddresses = [];
        var serverEmail = $scope.unreadTendersArray[index].ows_EmelPegawaiUntukDihubungi;
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
                subject: $scope.unreadTendersArray[index].ows_Title,
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
    
    $scope.shareReadTenderViaEmail = function(index){
        var formatedEmailAddresses = [];
        var serverEmail = $scope.readTendersArray[index].ows_EmelPegawaiUntukDihubungi;
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
                subject: $scope.readTendersArray[index].ows_Title,
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
    
    $scope.addUnreadTenderEvent = function(index){
        var startFullDate = $scope.unreadTendersArray[index].ows_TarikhTenderDibuka.split(" ");
        $log.debug(startFullDate);
        var startFullDate2 = startFullDate[0].split("-");
        $log.debug(startFullDate2);
        var startTime = startFullDate[1].split(":");
        $log.debug(startTime);
        
        var closeFullDate = $scope.unreadTendersArray[index].ows_TarikhTenderDitutup.split(" ");
        $log.debug(closeFullDate);
        var closeFullDate2 = closeFullDate[0].split("-");
        $log.debug(closeFullDate2);
        var closeTime = closeFullDate[1].split(":");
        $log.debug(closeTime);
        
         switch($rootScope.platform) {
            case "Android":
                $cordovaCalendar.createEventInteractively({
                    title: $scope.unreadTendersArray[index].ows_Title,
                    location: $scope.unreadTendersArray[index].ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                }, function (err) {
                // error
                });    

                $cordovaCalendar.createEventInteractively({
                    title: $scope.unreadTendersArray[index].ows_Title,
                    location: $scope.unreadTendersArray[index].ows_Lokasi_x002f_Ladang,
                    startDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, closeFullDate2[2], closeTime[0], closeTime[1], 0, 0, 0),
                    endDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, parseInt(closeFullDate2[2]), closeTime[0], closeTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                }, function (err) {
                // error
                });
                break;
            case "iOS":
                 console.log("In iOS");
                $cordovaCalendar.createEvent({
                    title: $scope.unreadTendersArray[index].ows_Title,
                    location: $scope.unreadTendersArray[index].ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                    $cordovaCalendar.createEvent({
                        title: $scope.unreadTendersArray[index].ows_Title,
                        location: $scope.unreadTendersArray[index].ows_Lokasi_x002f_Ladang,
                        startDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, closeFullDate2[2], closeTime[0], closeTime[1], 0, 0, 0),
                        endDate: new Date(closeFullDate2[0], closeFullDate2[1]-1, parseInt(closeFullDate2[2]), closeTime[0], closeTime[1], 0, 0, 0)
                    }).then(function (result) {
                        console.log("Event Created", result);
                        $ionicPopup.alert({
                            title: 'Calendar Event',
                            template: $scope.calendarEventMessage
                        });
                    }, function (err) {
                        console.log("err ", err);
                    });
                }, function (err) {
                    console.log("err", err);
                });    

                break;
        }
    }
    
    $scope.addReadTenderEvent = function(index){
        var startFullDate = $scope.readTendersArray[index].ows_TarikhTenderDibuka.split(" ");
        $log.debug(startFullDate);
        var startFullDate2 = startFullDate[0].split("-");
        $log.debug(startFullDate2);
        var startTime = startFullDate[1].split(":");
        $log.debug(startTime);
        
        var closeFullDate = $scope.readTendersArray[index].ows_TarikhTenderDitutup.split(" ");
        $log.debug(closeFullDate);
        var closeFullDate2 = closeFullDate[0].split("-");
        $log.debug(closeFullDate2);
        var closeTime = closeFullDate[1].split(":");
        $log.debug(closeTime);
        
         switch($rootScope.platform) {
            case "Android":
                $cordovaCalendar.createEventInteractively({
                    title: $scope.readTendersArray[index].ows_Title,
                    location: $scope.readTendersArray[index].ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                }, function (err) {
                // error
                });    

                $cordovaCalendar.createEventInteractively({
                    title: $scope.readTendersArray[index].ows_Title,
                    location: $scope.readTendersArray[index].ows_Lokasi_x002f_Ladang,
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
                    title: $scope.readTendersArray[index].ows_Title,
                    location: $scope.readTendersArray[index].ows_Lokasi_x002f_Ladang,
                    startDate: new Date(startFullDate2[0], startFullDate2[1]-1, startFullDate2[2], startTime[0], startTime[1], 0, 0, 0),
                    endDate: new Date(startFullDate2[0], startFullDate2[1]-1, parseInt(startFullDate2[2]), startTime[0], startTime[1], 0, 0, 0)
                }).then(function (result) {
                    $log.debug("Event Created", result);
                    $cordovaCalendar.createEvent({
                        title: $scope.readTendersArray[index].ows_Title,
                        location: $scope.readTendersArray[index].ows_Lokasi_x002f_Ladang,
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
    
    $scope.shareUnreadTender = function(index){      
        var message = "Tender Title - " + $scope.unreadTendersArray[index].ows_Title + "\n\nTender Opening Date - " + $scope.unreadTendersArray[index].ows_TarikhTenderDibuka + "\n\nTender Closing Date - " + $scope.unreadTendersArray[index].ows_TarikhTenderDitutup + "\n\n" + $scope.unreadTendersArray[index].attachmentFileUrl;
        var subject = $scope.unreadTendersArray[index].ows_Title;
        $cordovaSocialSharing.share(message, subject)
        .then(function (result) {
        $log.debug("Share Successful", result);
      }, function (err) {
        // error
      });    
    }
    
    $scope.shareReadTender = function(index){      
        var message = "Tender Title - " + $scope.readTendersArray[index].ows_Title + "\n\nTender Opening Date - " + $scope.readTendersArray[index].ows_TarikhTenderDibuka + "\n\nTender Closing Date - " + $scope.readTendersArray[index].ows_TarikhTenderDitutup + "\n\n" + $scope.readTendersArray[index].attachmentFileUrl;
        var subject = $scope.readTendersArray[index].ows_Title;
        $cordovaSocialSharing.share(message, subject)
        .then(function (result) {
        $log.debug("Share Successful", result);
      }, function (err) {
        // error
      });    
    }
    
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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