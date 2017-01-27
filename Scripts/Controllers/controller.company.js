// manage companies
app.expandControllerComp = function ($scope, $http) {
    // settings for edit form inc validations
    $scope.compEditConfig = compEditConfig;
    // user companies array
    $scope.userCompanies = [];
    $scope.userCompaniesBac = [];
    $scope.selectedCompany = angular.copy(compTemplate);
    $scope.isCompSelectedTab = 0;
    $scope.cardCompTabs = [
        { name: "compGeneral", title: "פרטי עסק" },
        { name: "compCommuniction", title: "פרטי התקשרות" },
        { name: "compBank", title: "חשבון בנק" }];

    // edit company validators
    $scope.companyValidator = null;
    $scope.cmpValidatorErrors = [0, 0, 0];
    $scope.cmpValidatorErrorsSum = function () {
        return $scope.cmpValidatorErrors[0] + $scope.cmpValidatorErrors[1] + $scope.cmpValidatorErrors[2];
    }

    // sort companies table
    $scope.companySort = {
        column: 'Id',
        descending: false
    };

    $scope.getCompanyById = function (id) {
        if (id == 0) {
            return "כל בתי עסק";
        } else {
            var c = Enumerable
                .From($scope.userCompaniesBac)
                .Where(function (s) { return s.Id == id })
                .FirstOrDefault();
            if (typeof (c) == "undefined") {
                return "אין";
            } else {
                return c.Name;
            }
        }
    }

    $scope.deleteCompany = function (id) {
        $scope.userCompaniesBac = Enumerable
                       .From($scope.userCompaniesBac)
                       .Where(function (s) { return s.Id != id })
                       .ToArray();
        $scope.userCompanies = Enumerable
            .From($scope.userCompanies)
            .Where(function (s) { return s.Id != id })
            .ToArray();
        $scope.selectedCompany.Id = null;

        $http.get('Tasks.aspx?tp=71&id=' + id)
            .success(function (o) {
                if (o == "ok") {
                    //$scope.userCompaniesBac = Enumerable
                    //    .From($scope.userCompaniesBac)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.userCompanies = Enumerable
                    //    .From($scope.userCompanies)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.selectedCompany.Id = null;
                    // reload comp ddl

                    $scope.tempMessage(0, "מחיקה בוצע בהצלחה");
                } else {
                    $scope.tempMessage(1, "הפעולה לא הצליחה");
                }
            }).error(function (status) {
                $scope.tempMessage(1, "הפעולה לא הצליחה");
            });
    }

    // active company change
    $scope.$watch("selection.compId", function (newVal, oldVal) {
        $scope.selectCompanyN(newVal);
    });

    $scope.selectCompanyN = function (newVal) {
        $scope.resetErrorCompanyForms();
        if (newVal == null) { // 
            $('#f421 .nav-tabs li:first a').tab('show');
            $scope.isCompSelectedTab = 0;
            $scope.selectedCompany = angular.copy(compTemplate);
            $scope.selectedCompany.Id = null;
        } else {
            $('#f421 .nav-tabs li:eq(1) a').tab('show');
            $scope.isCompSelectedTab = 1;
            if (newVal == 0) { // new
                $scope.selectedCompany = angular.copy(compTemplate);
            } else { // existing
                $scope.selectedCompany = Enumerable
                .From($scope.userCompanies)
                .Where(function (s) { return s.Id == newVal })
                .FirstOrDefault();
                //$scope.newDoc.Company = angular.copy($scope.selectedCompany); 
                $scope.newDoc.Company = $scope.selectedCompany;
                if (($scope.selectedCompany.IsLocked == null
                    || !$scope.selectedCompany.IsLocked)) {
                    if ($scope.userCustomers.length == 0) {
                        $scope.showPage(11);
                    } else {
                        $scope.showPage(45);
                    }
                }
            }
        }
        return false;
    }

   $scope.newCompany = function () {
        $scope.newDoc.Company.Id = 0;
        $scope.selection.compId = 0;
        $scope.isCompSelectedTab = 1;
        $('#f421 .nav-tabs li:eq(1) a').tab('show');
        //$scope.isCompSelectedTab = 1;
        $scope.selectedCompany = angular.copy(compTemplate);
    }

    $scope.selectCompany = function (p) {
        $scope.newDoc.Company.Id = p.Id;
        $scope.selection.compId = p.Id;
        $scope.selectedCompany = Enumerable
               .From($scope.userCompanies)
               .Where(function (s) { return s.Id == p.Id })
               .FirstOrDefault();
        //$scope.newDoc.Company = angular.copy($scope.selectedCompany);
        if (p.IsLocked == null || !p.IsLocked) {
            if ($scope.userCustomers.length == 0) {
                $scope.showPage(11);
            } else {
                $scope.showPage(45);
            }
        }
    }

    //$scope.$watch("selectedCompany", function (newVal, oldVal) {
    //    $scope.newDoc.Company = $scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null
    //                ? $scope.userCompaniesBac[0] : $scope.selectedCompany;
    //    //$scope.$digest();
    //}, true);
    

    // search company by key
    $scope.$watch("search.companyKey", function (newVal, oldVal) {
        $scope.filterCompanies();
    }, true);

    $scope.filterCompanies = function () {
        $scope.selectedCompany.Id = null;
        var v = $scope.search.companyKey.trim();
        if (v == "") {
            $scope.userCompanies = angular.copy($scope.userCompaniesBac);
        } else {
            $scope.userCompanies = Enumerable
                .From($scope.userCompaniesBac)
                .Where(function (s) { return s.Name.indexOf(v) > -1 || s.Identificator.indexOf(v) > -1 || s.Email.indexOf(v) > -1 })
                .ToArray();
        }
        $scope.loadPaging("userCompanies");
    }


    $scope.tabCompanyCardClick = function (event) {
        var a = event.target;
        $scope.isCompSelectedTab = $($(a).attr('href')).index();
    }

    $scope.selectedCompanyTitle = function () {
        if (typeof ($scope.selectedCompany) == 'undefined') $scope.selectedCompany = angular.copy(compTemplate);
        if ($scope.selection.compId == null || $scope.isCompSelectedTab == 0) {
            return "כל העסקים";
        } else if ($scope.selection.compId == 0) {
            return "הוספת עסק חדש";
        } else {
            var comp = Enumerable
                .From($scope.userCompanies)
                .Where(function (s) { return s.Id == $scope.selection.compId })
                .FirstOrDefault();
            return $scope.getShortStr(comp.Name, 60);
        }
    }

    $scope.isChangedCompField = function (p) {
        if ($scope.selection.compId == null || $scope.selectedCompany.Id == null) return false;
        if (typeof ($scope.selectedCompany) == "undefined") return false;
        var bac = $scope.selection.compId == 0 ? angular.copy(compTemplate)
            : Enumerable
              .From($scope.userCompaniesBac)
              .Where(function (s) { return s.Id == $scope.selectedCompany.Id })
              .FirstOrDefault();
        var res = false;
        if (p == null) {
            for (prop in $scope.selectedCompany) {
                if (bac[prop] != $scope.selectedCompany[prop] && prop.indexOf("$$") == -1) res = true;
            }
        } else {
            res = bac[p] != $scope.selectedCompany[p];
        }
        return res;
    }

    $scope.isNewCompFormNotFilled = function () {
        var res = [0, 0, 0];
        for (var k = 0; k < 3; k++) {
            $.each(compTabs[k], function (i) {
                if (compTemplate[compTabs[k][i]] != $scope.selectedCompany[compTabs[k][i]]) res[k] = 1;
            })
        }
        return res[0] + res[1] + res[2] < 3;
    }

    // reset edit company form
    $scope.resetErrorCompanyForms = function () {
        $scope.userCompanies = angular.copy($scope.userCompaniesBac);
        $scope.selectedCompany = Enumerable
                .From($scope.userCompanies)
                .Where(function (s) { return s.Id == $scope.selection.compId })
                .FirstOrDefault();
        //$scope.resetMessages();

        if ($scope.companyValidator != null) {
            $scope.companyValidator.resetForm();
            var a = $scope.companyValidator.valid();
            $("#f421").find("label.error").hide();
        }
        $scope.cmpResetErrors();
    }

    // reset all error messages
    $scope.cmpResetErrors = function () {
        var tabs = ["compGeneral", "compCommuniction", "compBank"];
        var cnt;
        for (var k = 0; k < 3; k++) {
            $.each($("#" + tabs[k] + " input"), function (i, o) {
                if ($(o).hasClass("error")) {
                    $(o).removeClass("error");
                }
            });
            $scope.cmpValidatorErrors[k] = 0;
        }
    }

    // count errors
    $scope.cmpCountErrors = function () {
        var tabs = ["compGeneral", "compCommuniction", "compBank"];
        var cnt;
        for (var k = 0; k < 3; k++) {
            cnt = 0;
            $.each($("#" + tabs[k] + " input"), function (i, o) {
                if ($(o).hasClass("error")) cnt++;
            });
            $scope.cmpValidatorErrors[k] = cnt;
        }
    }

    // logo image
    $scope.srcLogo = "Logo/0.png";
    $scope.$watch("selectedCompany.Id", function (newVal, oldVal) {
        $scope.srcLogo = $scope.selectedCompany.Logo == "" || $scope.selectedCompany.Logo == null
            ? "Logo/0.png" : ("Logo/" + $scope.selectedCompany.Logo);

        // filter customers
        $scope.filterCustomers();
        // update products paging
        if ($scope.selectedPage == 44) {
            $scope.loadPaging("userProducts");
        }
        if ($scope.selectedPage != 42) {
            $scope.isCompSelectedTab = 0;
        }

        // reset newdoc form
        $scope.resetNewDocument();

        //// check and update selected doc
        //$scope.checkAndUpdateDoc();
    }, true);
    $scope.$watch("selectedCompany.Logo", function (newVal, oldVal) {
        $scope.srcLogo = $scope.selectedCompany.Logo == "" || $scope.selectedCompany.Logo == null
            ? "Logo/0.png" : ("Logo/" + $scope.selectedCompany.Logo);
    }, true);

    $scope.hasLogo = function () {
        return $scope.selectedCompany.Logo != "" && $scope.selectedCompany.Logo != null;
    }

    $scope.hasLogoComp = function (comp) {
        return comp.Logo != "" && comp.Logo != null;
    }
    $scope.getLogo = function (comp) {
        return (typeof(comp)!="undefined" && $scope.hasLogoComp(comp)) ? ("Logo/" + comp.Logo) : "Logo/0.png";
    }
    
    ///////////////
    $scope.compRequiredFields = function (c) {
        return c.hasOwnProperty("rule");
    }

    $scope.companyState = function () {
        return {
            showListAndAdvTabs: $scope.userCompanies.length > 0,
            listTabActive: $scope.userCompanies.length > 0 && $scope.isCompSelectedTab == 0,
            newFirstComp: $scope.userCompanies.length == 0 && selectedCompany.Id == 0
        }
    }

    $scope.tabCompanyCardClickA = function (a) {
        $scope.isCompSelectedTab = $($(a).attr('href')).index();
    }   

    $scope.defCompany = function () {
        $scope.selection.compId = null;
    }

    $scope.openCompanyCard = function (id) {
        //$('#f421 .nav-tabs li:eq(2) a').tab('show');
        if (id != 0) {
            $scope.search.docCompany = id;
        }
        $scope.selection.compId = id;
        $scope.selectCompanyN(id);
        $scope.isCompSelectedTab = 1;
        $('#f421 .nav-tabs li:eq(1) a').tab('show');
    }

    $scope.setCompTabSelected = function (n) {
        $scope.isCompSelectedTab = n + 1;
    }

    $scope.goToNewCompanyTab = false;
    $scope.newCompanyFromW = function () {
        $scope.goToNewCompanyTab = true;
        $scope.showPage(42);
        $scope.setCompTabSelected(0);
    }

}
