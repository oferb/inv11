// manage reports
app.expandControllerReport = function ($scope, $http) {
    $scope.repFilter = {
        Type: 0, // 0 - incomes, 1 - payments, 2 - pay methods
        Year: 0,
        Month: -1,
        MonthTo: -1
    }

    $scope.years = [2016, 2015, 2014];
    $scope.months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    $scope.isWaitingForFile = 0;

    $scope.isRepFiltered = function () {
        var a = $scope.repFilter.Year == 0 && $scope.repFilter.Month == -1 && $scope.repFilter.MonthTo == -1 && $scope.search.docCustomer == 0;
        return !a;
    }

    $scope.resetRepFilters = function () {
        $scope.repFilter = {
            Type: 0, 
            Year: 0,
            Month: -1,
            MonthTo: -1
        }
        $scope.search.docCustomer = 0;
    }

    $scope.repBack = function () {
        if ($scope.repFilter.Month != -1) {
            $scope.repFilter.Month = -1;
        } else if ($scope.repFilter.Year != 0) {
            $scope.repFilter.Year = 0;
        } else if ($scope.search.docCustomer != 0) {
            $scope.search.docCustomer = 0;
        }
    }

    $scope.repList = function () {
        if ($scope.repFilter.Year == 0) {
            return $scope.years;
        } else {
            return $scope.months;
        }
    }

    $scope.inType = function (tp, ctp) {
        if (ctp == 0) {
            return [1, 2, 4].indexOf(tp) > -1;
        } else if (ctp == 1) {
            return [2, 3].indexOf(tp) > -1;
        } else {
            return false;
        }
    }

    // count of customers by years/month
    $scope.calcRepCustAmount = function (y) {
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            return Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.inType(s.DocumentType,$scope.repFilter.Type))
                      && (($scope.repFilter.Year == 0)
                      ? (s.Year == y)
                      : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
              })
            .GroupBy('$.CustomerID').Count();
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0)
                        ? (s.Year == y)
                        : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
              })
              .GroupBy('$.CustomerID').Count();
        }
    }

    // by year and document type
    $scope.calcRepDocAmount = function (y, tp) {
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            return Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && s.DocumentType == tp
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0)
                        ? (s.Year == y)  
                        : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
                  })
            .Count();
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && s.TypeID == tp
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0)
                        ? (s.Year == y)
                        : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
              })
            .Count();
        }
    }

    // total by years by types
    $scope.calcRepDocAmountT = function (tp) { 
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            return Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && s.DocumentType == tp
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0) ? true : (s.Year == $scope.repFilter.Year))
              })
            .Count();
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && s.TypeID == tp
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0)
                        ? true
                        : (s.Year == $scope.repFilter.Year))
              })
            .Count();
        }
    }

    $scope.calcRepTotal = function (y) {
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            var ts = $scope.repFilter.Type == 0 ? "$.Total" : "$.PaidTotal";
            var tot = Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.inType(s.DocumentType, $scope.repFilter.Type))
                      && ($scope.search.docCustomer == 0 || s.CustomerID == $scope.search.docCustomer)
                     // && (($scope.repFilter.Year == 0) ? true: (s.Year == $scope.repFilter.Year))
                      && (($scope.repFilter.Year == 0) ? (s.Year == y) : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
              })
            .Sum(ts);
            return tot >= 0 ? tot.toFixed(2) : "(" +(-1)* tot.toFixed(2) + ")";
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      //&& (($scope.repFilter.Year == 0) ? true : (s.Year == $scope.repFilter.Year))
                      && (($scope.repFilter.Year == 0) ? (s.Year == y) : (s.Year == $scope.repFilter.Year && s.Month == $scope.months.indexOf(y)))
              })
            .Sum("$.Total");
        }
    }

    // table total
    $scope.calcRepTotalT = function () {
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            var ts = $scope.repFilter.Type == 0 ? "$.Total" : "$.PaidTotal";
            var tot = Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.inType(s.DocumentType, $scope.repFilter.Type))
                      && ($scope.search.docCustomer == 0 || s.CustomerID == $scope.search.docCustomer)
                      && (($scope.repFilter.Year == 0) ? true : (s.Year == $scope.repFilter.Year))
              })
            .Sum(ts);
            if (tot < 0) {
                var x = 12;
            }
            return tot >= 0 ? tot.toFixed(2) : "(" + (-1) * tot.toFixed(2) + ")";
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (($scope.repFilter.Year == 0) ? true : (s.Year == $scope.repFilter.Year))
              })
            .Sum("$.Total");
        }
    }

    $scope.calcRepTotalTM = function () {
        if (typeof ($scope.reportData) == "undefined") return 0;
        if ($scope.repFilter.Type < 2) { // incomes & payments
            var ts = $scope.repFilter.Type == 0 ? "$.Total" : "$.PaidTotal";
            var tot = Enumerable
              .From($scope.reportData.Incomes)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                       && ($scope.inType(s.DocumentType, $scope.repFilter.Type))
                       && ($scope.search.docCustomer == 0 || s.CustomerID == $scope.search.docCustomer)
                       && (s.Year == $scope.repFilter.Year)
                       && (s.Month >= $scope.months.indexOf($scope.repFilter.Month))
                       && (s.Month <= $scope.months.indexOf($scope.repFilter.MonthTo))
              })
            .Sum(ts);
            return tot >= 0 ? tot.toFixed(2) : "(" + (-1) * tot.toFixed(2) + ")";
        } else { // pay methods
            return Enumerable
              .From($scope.reportData.Methods)
              .Where(function (s) {
                  return (s.CompanyID == $scope.search.docCompany)
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                       && (s.Year == $scope.repFilter.Year)
                       && (s.Month >= $scope.months.indexOf($scope.repFilter.Month))
                       && (s.Month <= $scope.months.indexOf($scope.repFilter.MonthTo))
              })
            .Sum("$.Total");
        }
    }


    $scope.repDocFilter = function (p) {
        var res;
        if ($scope.search.docCustomer == 0) {
            if ($scope.repFilter.MonthTo == -1)
            {
                res = p.CompanyID == $scope.search.docCompany
                      && p.Year == $scope.repFilter.Year
                      && p.Month == $scope.months.indexOf($scope.repFilter.Month)
                      && ($scope.repFilter.Type < 2 ? $scope.inType(p.DocumentType, $scope.repFilter.Type) : true)
            }
            else
            {
                res = p.CompanyID == $scope.search.docCompany
                                     && p.Year == $scope.repFilter.Year
                                     && p.Month >= $scope.months.indexOf($scope.repFilter.Month)
                                     && p.Month <= $scope.months.indexOf($scope.repFilter.MonthTo)
                                     && ($scope.repFilter.Type < 2 ? $scope.inType(p.DocumentType, $scope.repFilter.Type) : true)
            }
        } else {
            if ($scope.repFilter.MonthTo == -1) {
                res = p.CompanyID == $scope.search.docCompany
                     && p.CustomerID == $scope.search.docCustomer
                     && p.Year == $scope.repFilter.Year
                     && p.Month == $scope.months.indexOf($scope.repFilter.Month)
                     && ($scope.repFilter.Type < 2 ? $scope.inType(p.DocumentType, $scope.repFilter.Type) : true)
            }
            else
            {
                res = p.CompanyID == $scope.search.docCompany
                     && p.CustomerID == $scope.search.docCustomer
                     && p.Year == $scope.repFilter.Year
                     && p.Month >= $scope.months.indexOf($scope.repFilter.Month)
                     && p.Month <= $scope.months.indexOf($scope.repFilter.MonthTo)
                     && ($scope.repFilter.Type < 2 ? $scope.inType(p.DocumentType, $scope.repFilter.Type) : true)
            }
        }
        return res;
    }

    $scope.getNameByID = function (tp, id) {
        if (tp == "customer") {
            return Enumerable
                .From($scope.userCustomers)
                .Where(function (x) { return x.Id == id })
                .FirstOrDefault().Name;
        } else if (tp == "type") {
            return Enumerable
               .From($scope.docTypes)
               .Where(function (x) { return x.Id == id })
               .FirstOrDefault().Name;
        } else if (tp == "method") {
            return Enumerable
               .From($scope.payConfig)
               .Where(function (x) { return x.Id == id })
               .FirstOrDefault().Type;

        } else {
            return "error";
        }
    }

    $scope.signedTotal = function (tot) {
        return tot >= 0 ? tot.toFixed(2) : "(" + (-1) * tot.toFixed(2) + ")";
    }

    $scope.genBKMFile = function (debugMode) {
        var url = "Tasks.aspx?";
        if (debugMode == 1)
            url += "tp=401";
        else
            url += "tp=400";
        url += "&cid=" + $scope.selection.compId
            + "&year=" + $scope.repFilter.Year
            + "&from=" + $scope.months.indexOf($scope.repFilter.Month)
            + "&to=" + $scope.months.indexOf($scope.repFilter.MonthTo);

        $scope.isWaitingForFile = 1;
        $http.get(url, null).success(function (data, status, headers, config) {
            $scope.isWaitingForFile = 0;
            window.open(data);
            $scope.t1 = data;
        }).error(function (data, status, headers, config) {
            $scope.isWaitingForFile = 0;
            //gen failed
        });
    }

    $scope.$watch('repFilter', function (newVal, oldVal) {
        if (oldVal.Year != newVal.Year) { // if the user chooses a specific year select month range as the entire year by default
            $('#selYear').selectpicker('val', newVal.Year);
            if (newVal.Year != "0") {
                newVal.Month = $scope.months[0];
                newVal.MonthTo = $scope.months[11];
            }
            else // if we view all years nullify months
            {
                newVal.Month = -1;
                newVal.MonthTo = -1;
            }
        }
        if (oldVal.Month != newVal.Month) {
            if ($scope.months.indexOf(newVal.Month) > $scope.months.indexOf(newVal.MonthTo))
                newVal.MonthTo = newVal.Month;
            $('#selMonth').selectpicker('val', newVal.Month);
        }
        if (oldVal.MonthTo != newVal.MonthTo) {
            if ($scope.months.indexOf(newVal.Month) > $scope.months.indexOf(newVal.MonthTo)){
                newVal.Month = newVal.MonthTo;
                $('#selMonth').selectpicker('val', newVal.Month);
            }
            $('#selMonthTo').selectpicker('val', newVal.MonthTo);
        }
    }, true);

    // sort rep table
    //$scope.repIncSort = {
    //    column: 'Id',
    //    descending: false
    //};
}