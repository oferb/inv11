/// <reference path="../../Inc/rep.payments.htm" />
// manage customers
app.expandControllerCust = function ($scope, $http) {
    // settings for edit form inc validations
    $scope.custEditConfig = custEditConfig;
    // user customers array
    $scope.userCustomersBac = [];
    $scope.userCustomers = [];
    $scope.selectedCustomer = angular.copy(custTemplate);
    $scope.isCustSelectedTab = 0;

    $scope.cardCustTabs = [
       { name: "custGeneral", title: "פרטי לקוח" },
       { name: "custCommunication", title: "פרטי התקשרות" },
       { name: "custBank", title: "חשבון בנק" }];


    $scope.custFilter = {
        active: true,
        notActive: true
    }
   
    $scope.changeCustomerActive = function (id) {
        $http.get('Tasks.aspx?tp=101&id=' + id)
            .success(function (o) {
                if (o == "ok") {
                    var bac = Enumerable
                        .From($scope.userCustomersBac)
                        .Where(function (s) { return s.Id == id })
                        .FirstOrDefault();
                    bac.IsActive = !bac.IsActive;
                    $scope.tempMessage(0, "שינוי סטטוס בוצע בהצלחה");
                } else {
                    $scope.tempMessage(1, "הפעולה לא הצליחה");
                }
            }).error(function (status) {
                $scope.tempMessage(1, "הפעולה לא הצליחה");
            });
    }

    // edit customer validators
    $scope.customerValidator = null;
    $scope.custValidatorErrors = [0, 0, 0];
    $scope.custValidatorErrorsSum = function () {
        return $scope.custValidatorErrors[0] + $scope.custValidatorErrors[1] + $scope.custValidatorErrors[2];
    }

   

    $scope.tabCustomerCardClick = function (event) {
        var a = event.target;
        $scope.isCustSelectedTab = $($(a).attr('href')).index();
        //location.hash = $(a).attr('href');
    }


    $scope.selectedCustomerTitle = function () {
        if (typeof ($scope.selectedCustomer) == 'undefined') $scope.selectedCustomer = angular.copy(custTemplate);
        if ($scope.selection.custId == null || $scope.isCustSelectedTab == 0) {
            return "כל הלקוחות";
        } else if ($scope.selection.custId == 0) {
            return "הוספת לקוח חדש";
        } else {
            var comp = Enumerable
                .From($scope.userCustomers)
                .Where(function (s) { return s.Id == $scope.selection.custId })
                .FirstOrDefault();
            return comp.Name;
        }
    }

    // sort customers table
    $scope.customerSort = {
        column: 'Id',
        descending: false
    };

    $scope.deleteCustomer = function (id) {
        $scope.userCustomersBac = Enumerable
                       .From($scope.userCustomersBac)
                       .Where(function (s) { return s.Id != id })
                       .ToArray();
        $scope.userCustomers = Enumerable
            .From($scope.userCustomers)
            .Where(function (s) { return s.Id != id })
            .ToArray();
        $scope.selectedCustomer.Id = null;
        $http.get('Tasks.aspx?tp=72&id=' + id)
            .success(function (o) {
                if (o == "ok") {
                    //$scope.userCustomersBac = Enumerable
                    //    .From($scope.userCustomersBac)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.userCustomers = Enumerable
                    //    .From($scope.userCustomers)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.selectedCustomer.Id = null;
                    $scope.tempMessage(0, "מחיקה בוצע בהצלחה");
                } else {
                    $scope.tempMessage(1, "הפעולה לא הצליחה");
                }
            }).error(function (status) {
                $scope.tempMessage(1, "הפעולה לא הצליחה");
            });
    }

    // active customer change
    $scope.$watch("selection.custId", function (newVal, oldVal) {
        $scope.selectCustomer(newVal);
    });

    $scope.selectCustomer = function (newVal) {
        $scope.selection.custId = newVal;
        $scope.tempUserCust = angular.copy($scope.userCustomers);//Ola edited
        $scope.resetErrorCustomerForms();
        
      
        
        if (newVal == null) { // 
            $scope.userCustomers = $scope.tempUserCust;// Ola edited
            $('#f431 .nav-tabs li:first a').tab('show');
            $scope.isCustSelectedTab = 0;
            $scope.selectedCustomer = angular.copy(custTemplate);
            $scope.selectedCustomer.Id = null;
        } else {
            $scope.userCustomers = $scope.tempUserCust;//Ola edited
            $('#f431 .nav-tabs li:eq(1) a').tab('show');
            $scope.isCustSelectedTab = 1;

            if (newVal == 0) { // new
                // $scope.filterCustomers();
               // $scope.userCustomers = $scope.tempUserCust;
                $scope.selectedCustomer = angular.copy(custTemplate);
            } else { // existing
                $scope.selectedCustomer = Enumerable
                .From($scope.userCustomers)
                .Where(function (s) { return s.Id == $scope.selection.custId })
                .FirstOrDefault();
              //  $scope.userCustomers = $scope.tempUserCust;
                $scope.newDoc.Customer = $scope.selectedCustomer;
             //   $scope.filterCustomers();
            }
            //  $scope.filterCustomers();
            $scope.userCustomers = $scope.tempUserCust;
        }
        return false;
    }

    $scope.addressString = function (p) {
        if (typeof (p) == "undefined") return "";
        return (p.AStreet == "" ? "" : p.AStreet + ", ") + (p.ACity == "" ? "" : p.ACity + ", ") + p.ACountry;
    }

    $scope.addressStringL = function (p) {
        if (typeof (p) == "undefined") return "";
        return (p.AStreet == "" ? "" : p.AStreet + ", ") + (p.ACity == "" ? "" : p.ACity + ", ") +
            (p.ACountry == "" ? "" : p.ACountry + ", ") + (p.CPhone == "" ? "" : p.CPhone + ", ") + (p.CEmail == "" ? "" : p.CEmail + ", ");
        //{{newDoc.Customer.AStreet}}, {{newDoc.Customer.ACity}}, {{newDoc.Customer.ACountry}}, {{newDoc.Customer.CPhone}}, {{newDoc.Customer.CEmail}}
    }
    //$scope.$watch("selectedCustomer", function (newVal, oldVal) {
    //    $scope.newDoc.Company = $scope.selectedCustomer.Id == 0 || $scope.selectedCustomer.Id == null
    //                ? $scope.userCustomersBac[0] : $scope.selectedCustomer;
    //}, true);

    // search customer by key
    $scope.$watch("search.customerKey", function (newVal, oldVal) {
        $scope.filterCustomers();
    }, true);
    $scope.$watch("custFilter.active", function (newVal, oldVal) {
        $scope.filterCustomers();
    }, true); 
    $scope.$watch("custFilter.notActive", function (newVal, oldVal) {
        $scope.filterCustomers();
    }, true);
    
    $scope.filterCustomers = function () {

        if (!$scope.isAllDataLoaded) return;

        $scope.selectedCustomer.Id = null;
        var v = $scope.search.customerKey.trim();

        var c_list = Enumerable
                .From($scope.userCompanyCustomer)
                .Where(function (s) {
                    return s.CompanyID == $scope.selectedCompany.Id;
                }).Select("$.CustomerID").ToArray();

        var list = angular.copy($scope.userCustomersBac);
        list = Enumerable
                .From(list)
                .Where(function (s) {
                    return c_list.indexOf(s.Id) > -1;
                })
                .ToArray();

        if (v != "") {
            list = Enumerable
                .From(list)
                .Where(function (s) {
                    return s.Name.indexOf(v) > -1 || s.Identificator.indexOf(v) > -1 || s.CEmail.indexOf(v) > -1;
                })
                .ToArray();
        }
        $scope.userCustomers =  Enumerable
                .From(list)
                .Where(function (s) {
                    return (s.IsActive && $scope.custFilter.active) || (!s.IsActive && $scope.custFilter.notActive);
                }).ToArray();

        $scope.loadPaging("userCustomers");
    }


    $scope.isChangedCustField = function (p) {
        if ($scope.selection.custId == null || $scope.selectedCustomer.Id == null) return false;
        if (typeof ($scope.selectedCustomer) == "undefined") return false;
        var bac = $scope.selection.custId == 0 ? angular.copy(custTemplate)
            : Enumerable
              .From($scope.userCustomersBac)
              .Where(function (s) { return s.Id == $scope.selectedCustomer.Id })
              .FirstOrDefault();
        var res = false;
        if (p == null) {
            for (prop in $scope.selectedCustomer) {
                if (bac[prop] != $scope.selectedCustomer[prop] && prop.indexOf("$$") == -1) res = true;
            }
        } else {
            res = bac[p] != $scope.selectedCustomer[p];
        }
        return res;
    }


    $scope.isNewCustFormNotFilled = function () {
        var res = [0, 0, 0];
        for (var k = 0; k < 3; k++) {
            $.each(custTabs[k], function (i) {
                if (custTemplate[custTabs[k][i]] != $scope.selectedCustomer[custTabs[k][i]]) res[k] = 1;
            })
        }
        return res[0] + res[1] + res[2] < 3;
    }

    

    // reset edit customer form
    $scope.resetErrorCustomerForms = function () {
        $scope.userCustomers = angular.copy($scope.userCustomersBac);
        $scope.selectedCustomer = Enumerable
                .From($scope.userCustomers)
                .Where(function (s) { return s.Id == $scope.selection.custId })
                .FirstOrDefault();
        //$scope.resetMessages();

        if ($scope.customerValidator != null) {
            $scope.customerValidator.resetForm();
            var a = $scope.customerValidator.valid();
            $("#f431").find("label.error").hide();
        }
        $scope.custResetErrors();
    }

    // count error messages
    $scope.custCountErrors = function () {
        var tabs = ["custGeneral", "custCommunication", "custBank"];
        var cnt;
        for (var k = 0; k < 3; k++) {
            cnt = 0;
            $.each($("#" + tabs[k] + " input"), function (i, o) {
                if ($(o).hasClass("error")) cnt++;
            });
            $scope.custValidatorErrors[k] = cnt;
        }
    }

    // reset all error messages
    $scope.custResetErrors = function () {
        var tabs = ["custGeneral", "custCommunication", "custBank"];
        var cnt;
        for (var k = 0; k < 3; k++) {
            $.each($("#" + tabs[k] + " input"), function (i, o) {
                if ($(o).hasClass("error")) {
                    $(o).removeClass("error");
                }
            });
            $scope.custValidatorErrors[k] = 0;
        }
    }

    ////////////////////
    $scope.setCustTabSelected = function (n) {
        $scope.isCustSelectedTab = n + 1;
        //if ($scope.isCustSelectedTab == 0) $scope.selection.custId = null;
    }

   
    $scope.showNewCustPage = function () {
        $scope.selection.custId = 0;
        $scope.isCustSelectedTab = 1;
        $scope.retToNewDoc = true;
        $scope.showPage(62);
        
        //setTimeout(function () {
        //    $('#custCardTabs li:eq(1) a').tab('show');
        //}, 100);
        
    }

    $scope.getCustCsv = function () {
        JSONToCSVConvertor($scope.userCustomers, "פרטי לקוחות", true);
    }

}