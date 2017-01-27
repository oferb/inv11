// manage payments
app.expandControllerPayment = function ($scope, $http, $filter) {
	$scope.payConfig = [
		{
			Id: 1,
			Type: "צ'ק",
			Label: "צ'ק"
		},
		{
			Id: 2,
			Type: "מזומן",
			Label: "מזומן"
		},
		{
			Id: 3,
			Type: "העברה בנקאית",
			Label: "העברה"
		},
		{
			Id: 4,
			Type: "אחר",
			Label: "אחר"
		}
	];

	$scope.docPayments = [];

	$scope.getPayDescription = function (p) {
		switch (p.Type.Id) {
			case 1:
			    return "צ'ק מס: " + p.Check + ", " + p.Bank.Name + ", סניף: " + p.Branch.Id + ", ח-ן: " + p.Account;
			case 3:
			    return (p.Bank == null ? "" : p.Bank.Name) +
                    (p.Branch == null ? "" : (", סניף: " + p.Branch.Id)) + 
                    (p.Bank == null || p.Branch == null ? "" : (", ח-ן: " + p.Account));
			case 4:
				return p.Comments;
			default:
				return "";
		}
	}

	$scope.getPayDescriptionR = function (p) {
	    switch (p.TypeID) {
	        case 1:
	            return "צ'ק מס: " + p.Check + ", " + $scope.getBankName(p.BankCode) + ", סניף: " + p.BranchCode + ", ח-ן: " + p.Account;
	        case 3:
	            return $scope.getBankName(p.BankCode) + ", סניף: " + p.BranchCode + ", ח-ן: " + p.Account;
	        case 4:
	            return p.Comments;
	        default:
	            return "";
	    }
	}

	$scope.getBankName = function (code) {
	    return Enumerable
              .From($scope.banks)
              .Where(function (s) { return s.Id == code })
              .FirstOrDefault().Name;
	}

	$scope.getBranchName = function (code) {
	    return Enumerable
              .From($scope.branches)
              .Where(function (s) { return s.Id == code })
              .FirstOrDefault().Name;
	}

	$scope.isPayUpdate = false;
	$scope.selectedPaymentTempl = {
	    Type: angular.copy($scope.payConfig[0]),
	    Bank: null,
	    Branch: null,
	    Account: "000000",
	    Check: "000000",
	    Date: new Date(),
	    Total: 100,
	    Comments: ""
	};
	$scope.selectedPayment = angular.copy($scope.selectedPaymentTempl);

	$scope.$watch('selectedPayment.Bank', function (newVal, oldVal) {
		$scope.initBranch();
	}, true);
	
	$scope.initBranch = function () {
	    return;
        // old
		if ($scope.selectedPayment.Bank == null) return;
		var list = Enumerable.From($scope.branches)
			.Where(function (x) { return x.BankID == $scope.selectedPayment.Bank.Id })
			.OrderBy(function (x) { return x.Name }).ToArray();
		$scope.selectedPayment.Branch = angular.copy(list[0]);
	}

	$scope.resetPayment = function () {
		if ($scope.payForUpdate > -1) {
			$scope.selectedPayment = angular.copy($scope.docPayments[$scope.payForUpdate]);
		} else {
		    $scope.selectedPayment = angular.copy($scope.selectedPaymentTempl);
			//$scope.selectedPayment = angular.copy($scope.selectedPaymentBac);
		}
		
		if ($scope.itemValidator != null) {
			$scope.itemValidator.resetForm();
			var a = $scope.itemValidator.valid();
			$("#f461").find("label.error").hide();
		}
	}


	$scope.isValidPayment = function () {
	    if ($scope.selectedPayment.Type.Id == 1) {
	        return $scope.selectedPayment.Bank != null && $scope.selectedPayment.Branch != null;
	    } else {
	        return true;
	    }
	}

	$scope.clearPayments = function () {
		$scope.docPayments = [];
	}

	$scope.payForUpdate = -1;
	$scope.selectPayForUpdate = function (n, isCopy) {
	    $scope.payForUpdate = isCopy ? -1 : n;
	    $scope.selectedPayment = angular.copy($scope.docPayments[n]);

	    //$scope.showPage(46);

	    //if (typeof ($('#datetimepickerNewPay').data("DateTimePicker"))) {
        //    $scope.loadDatePickersNP();
	    //}
	    //var dp = $('#datetimepickerNewPay').data("DateTimePicker");
	    if (isCopy) {
	        $scope.selectedPayment.Date = moment($scope.selectedPayment.Date).add(1, 'month');
	        //if (moment($scope.selectedPayment.Date, "DD/MM/YYYY").isValid()) {
	        //    $scope.selectedPayment.Date = moment($scope.selectedPayment.Date, "DD/MM/YYYY").add(1, 'month');
	        //} else {
	        //    $scope.selectedPayment.Date = moment($scope.selectedPayment.Date).add(1, 'month');
	        //}
	        //dp.date($scope.selectedPayment.Date);
	    } //else {
	        $scope.showPage(61);
	        //dp.date($scope.selectedPayment.Date);
	    //}
	    //dp.date($scope.selectedPayment.Date);
	}

	$scope.getPayDate = function (d) {
	    //if (d instanceof Date) {
	    try {
	        if (d.isValid()) {
	            return moment(d).format('DD/MM/YYYY');
	        } else {
	            return d;
	        }
	    } catch (e) {
	        return d;
	    }

	    
	}

	$scope.remPayment = function (n) {
	    $scope.docPayments.splice(n, 1);
	    setTimeout(function () {
	        $scope.loadCheckTooltips();
	    }, 500);
	}

	$scope.isPayChanged = function () {
		if ($scope.payForUpdate > -1) {
			return JSON.stringify($scope.selectedPayment) != JSON.stringify($scope.docPayments[$scope.payForUpdate]);
		} else {
			return JSON.stringify($scope.selectedPayment) != JSON.stringify($scope.selectedPaymentBac);
		}
	}

	// fill total if required
	$scope.autoFillTotal = function () {
		if ($scope.newDoc.Type == 2) {
			var tot = $scope.totalItems();
			var p = $scope.calcPaymentsTotal();
			if (tot > 0 && tot > p) {
				$scope.selectedPayment.Total = Math.round(100*(tot - p))/100;
			}
		}
	}

	$scope.calcPaymentsTotal = function () {
		var s = Enumerable.From($scope.docPayments).Sum("$.Total");
		return Math.round(100 * s) / 100;
	}

	$scope.isLastCheck = function (p) {
	    if (typeof(p)=="undefined" || p.Type.Id != 1) return false;
	    if ($scope.docPayments.length == 1) return true;
	    var isLast = true;
	    $.each($scope.docPayments, function (i, o) {
	        //p.Check + ", " + p.Bank.Name + ", סניף: " + p.Branch.Id + ", ח-ן: " + p.Account
	        if (o.Type.Id == 1 && p.Bank.Id == o.Bank.Id && p.Branch.Id == o.Branch.Id && $.isNumeric(p.Check) && $.isNumeric(o.Check)) {
	            isLast = parseFloat(p.Check) >= parseFloat(o.Check);
	        }
	    })
	    return isLast;
	}
}