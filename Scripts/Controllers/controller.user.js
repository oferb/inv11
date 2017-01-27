// manage users
app.expandControllerUser = function ($scope, $http) {
    // account-user data
    $scope.userData = {};
    $scope.userDataBac = {};
    $scope.userCompanyCustomer = {}; // cross table

    $scope.docSelectedDate = moment().format("DD/MM/YYYY");
   
    $scope.isAllDataLoaded = false;

    // for document
    $scope.docSelectedCompany = {};
    $scope.docSelectedCustomer = {};
    $scope.docEditItem = null;
    
    $scope.docNewItem = {};
    $scope.allUsers = []; // for admin
   
    $scope.objByID = function (o, id) {
        return Enumerable.From(o)
                .Where(function (s) { return s.Id == id })
                .FirstOrDefault();
    }

    // get user data
    $scope.loadData = function () {
        Tracer.Log("request for data");
        $http.get('Tasks.aspx?tp=4')
            .success(function (o) {
                Tracer.Log("data received");
                // user
                $scope.userDataBac = angular.copy(o.Table[0]);
                $scope.userData = angular.copy(o.Table[0]);

                if (isAdmin) {
                    LoadUsersList();
                }

                console.log($scope.userData);

                // companies
                $scope.userCompaniesBac = angular.copy(o.Table1);
                $scope.userCompanies = angular.copy(o.Table1);

                // customers
                $scope.userCustomersBac = angular.copy(o.Table2);
                //$scope.userCustomers = angular.copy(o.Table2);
                // products
                $.each(o.Table3, function (i, p) {
                    p["Selected"] = false;
                    p["Amount"] = 1;
                })
                $scope.userProductsBac = angular.copy(o.Table3);
                $scope.userProducts = angular.copy(o.Table3);
                // company-customer cross
                $scope.userCompanyCustomer = angular.copy(o.Table4);
                // init settings
                $scope.docSelectedCompany = $scope.userCompaniesBac[0];
                $scope.docSelectedCustomer = $scope.userCustomersBac[0]; // temp - TBD (filtered by company)
                // doc config
                $scope.docConfig = angular.copy(o.Table5);
                $scope.docConfigBac = angular.copy(o.Table5);
                // common parameters (like NDS)
                $scope.dataCommon = angular.copy(o.Table6[0]);
                // document types (must be before prepareUserDocs)
                $scope.docTypes = angular.copy(o.Table7);
                // user documents (saved and emitted)
                var uDocs = $scope.prepareUserDocs(o.Table8);
                $scope.userDocuments = angular.copy(uDocs);
                $scope.userDocumentsBac = angular.copy(uDocs);
                $scope.showPage($scope.userDocuments.length > 0 ? 101 : 11);
                //$scope.selectedPage = $scope.userDocuments.length > 0 ? 101 : 11;

                // document products
                $scope.docProducts = angular.copy(o.Table9);
                // banks
                $scope.banks = angular.copy(o.Table10);
                $scope.selectedPayment.Bank = angular.copy($scope.banks[0]);
                $scope.branches = angular.copy(o.Table11);
                $scope.initBranch();
                $scope.selectedPaymentBac = angular.copy($scope.selectedPayment);
                // payments
                $scope.userPayments = angular.copy(o.Table12);
                $scope.userPaymentsBac = angular.copy(o.Table12);

                // user state
                //$scope.calcNewUserState();

                if ($scope.userCompanies.length > 0) {
                    $scope.selectedCompany = $scope.userCompanies[0];
                    $scope.selection.compId = $scope.selectedCompany.Id;
                }
                $scope.search.docCompany = $scope.selectedCompany.Id;
               
                $scope.prepareCustomers(); // set $scope.userCustomers

                // chart data
                //$scope.recalculateChartData(); // included in $scope.search.docCompany watch

                

                //$scope.loadAuto();
                LoadAutoSelects(); // with auto complete

                // load reports
                $scope.reportData = $scope.loadReportData();
                console.log($scope.reportData);

                setTimeout(function () {
                    CloseWaitingMessage();
                }, 100);

                // load doc template
                $scope.loadInitDoc();

                $scope.isAllDataLoaded = true;

                Tracer.Log("data is processed");
                console.log(o);
                $("#tempArea").val(JSON.stringify(o));
            }).error(function (status) {
                //temp
            });
    }
    //$scope.loadData();


    $scope.prepareCustomers = function () {

        if (!$scope.isAllDataLoaded) return;

        var list = Enumerable.From($scope.userCompanyCustomer)
            .Where(function (s) {
                return s.CompanyID == $scope.search.docCompany;
            }).Select(function (i) { return i.CustomerID }).ToArray();
        var custumers = Enumerable.From($scope.userCustomersBac)
            .Where(function (s) {
                return list.indexOf(s.Id)>-1;
            }).ToArray();
        $scope.userCustomers = angular.copy(custumers);
        LoadCustomersAuto();
    }

    $scope.resetErrorUserForms = function () {
        $scope.userData = angular.copy($scope.userDataBac);
        $scope.resetMessages();
        $("label.error").hide();
    }

    $scope.isChangedAccField = function () {
        var b = $scope.userDataBac;
        var u = $scope.userData;
        return (b.FName != u.FName) || (b.LName != u.LName);
    }

    $scope.tmpPassword = "";
    $scope.isChangedAccFieldP = function () {
        return $scope.tmpPassword.trim() != "";
    }

    $scope.loadReportData = function () {
        var dh = [], dp = [];
        var listH = Enumerable.From($scope.userDocuments)
                        .Where(function (s) {
                            return !s.IsDraft
                                && (s.DocumentType <=4);
                        }).ToArray();
        $.each(listH, function (i, o) {
            if (o["IsCanceled"] == null || !o["IsCanceled"]) {
                var sn = o.DocumentType == 4 ? (-1) : 1;
                var d = {
                    Id: o.Id,
                    Year: moment(o.Date).year(),
                    Month: moment(o.Date).month(),
                    CompanyID: o.CompanyID,
                    CustomerID: o.CustomerID,
                    DocumentType: o.DocumentType,
                    DocumentNumber: o.DocumentNumber,
                    Total: o.Total * (o.DocumentType == 4 ? (-1) : 1),
                    PaidTotal: o.PaidTotal == null ? 0 : o.PaidTotal,
                    Date: o.Date
                }
                dh.push(d);
            }
        });

        $.each($scope.userPayments, function (i, o) {
            var d = angular.copy(o);
            var doc = Enumerable.From($scope.userDocuments)
                        .Where(function (s) {
                            return !s.IsCanceled
                                && (s.DocumentNumber != 0)
                                && (s.Id == d.DocID);
                        }).FirstOrDefault();
            if (doc != null) {
                d["CompanyID"] = doc.CompanyID;
                d["CustomerID"] = doc.CustomerID;
                d["DocumentNumber"] = doc.DocumentNumber;
                d["Year"] = moment(o.Date).year(),
                d["Month"] = moment(o.Date).month(),
                dp.push(d);
            }
        });
        
        
        return {
            Incomes: dh,
            Methods: dp
        }
        //console.log($scope.reportData);
        //Enumerable.From(scope.docConfig).Where(function (x) { return x.CompanyID == scope.search.docCompany }).ToArray();
        //var customers = Enumerable.From($scope.userCustomers).Select(function (i) { return i.Name }).ToArray();
        //var customers = Enumerable.From($scope.userCustomers).Select("value,index=>{id:index,value:value}").ToObject("$.id", "$.value");
        //var customers = Enumerable.From($scope.userCustomers).Select("value,index=>{id:index,value:value.Name}").ToObject("$.id", "$.value");
        
    }

}