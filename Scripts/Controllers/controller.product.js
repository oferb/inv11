// manage companies
app.expandControllerProduct = function ($scope, $http) {
    // settings for edit form inc validations
    $scope.itemEditConfig = itemEditConfig;
    // user products array
    $scope.userProducts = [];
    $scope.userProductsBac = [];
    $scope.selectedItem = angular.copy(itemTemplate);
    // edit item validators
    $scope.itemValidator = null;
    $scope.itemValidatorErrors = 0;
    $scope.itemPageN = 0;

    // sort customers table
    $scope.itemSort = {
        column: 'Id',
        descending: true
    };

    $scope.selectedItemTitle = function () {
        if (typeof ($scope.selectedItem) == 'undefined') $scope.selectedItem = angular.copy(itemTemplate);
        if ($scope.selection.itemId == null || $scope.isItemSelectedTab == 0) {
            return "כל הפריטים";
        } else if ($scope.selection.itemId == 0) {
            return "הוספת פריט חדש";
        } else {
            var item = Enumerable
                .From($scope.userProducts)
                .Where(function (s) { return s.Id == $scope.selection.itemId })
                .FirstOrDefault();
            return item.Name;
        }
    }

    $scope.tabItemCardClick = function (event) {
        var a = event.target;
        $scope.isItemSelectedTab = $($(a).attr('href')).index();
    }


    $scope.isChangedItemField = function (p) {
        if ($scope.selection.itemId == null || $scope.selectedItem.Id == null) return false;
        if (typeof ($scope.selectedItem) == "undefined") return false;
        var bac = $scope.selection.itemId == 0 ? angular.copy(itemTemplate)
            : Enumerable
              .From($scope.userProductsBac)
              .Where(function (s) { return s.Id == $scope.selectedItem.Id })
              .FirstOrDefault();
        var res = false;
        if (p == null) {
            for (prop in $scope.selectedItem) {
                if (bac[prop] != $scope.selectedItem[prop] && prop.indexOf("$$") == -1) res = true;
            }
        } else {
            res = bac[p] != $scope.selectedItem[p];
        }
        return res;
    }

    // active item change
    $scope.$watch("selection.itemId", function (newVal, oldVal) {
        $scope.forceChangeItem(newVal);
    });

    $scope.forceChangeItem = function (n) {
        $scope.resetErrorItemForms();
        if (n == null) { // 
            $('#f441 .nav-tabs li:first a').tab('show');
            $scope.isItemSelectedTab = 0;
            $scope.selectedItem = angular.copy(itemTemplate);
            $scope.selectedItem.Id = null;
        } else {
            $('#f441 .nav-tabs li:eq(1) a').tab('show');
            $scope.isItemSelectedTab = 1;
            if (n == 0) { // new
                $scope.selectedItem = angular.copy(itemTemplate);
            } else { // existing
                $scope.selectedItem = Enumerable
                .From($scope.userProducts)
                .Where(function (s) { return s.Id == $scope.selection.itemId })
                .FirstOrDefault();
            }
        }
        return false;
    }

    // search products 
    $scope.$watch("search.itemKey", function (newVal, oldVal) {
        $scope.filterProducts();
    }, true);
    $scope.$watch("search.itemCompany", function (newVal, oldVal) {
        $scope.filterProducts();
    }, true);
    $scope.filterProducts = function () {

        if (!$scope.isAllDataLoaded) return;

        $scope.selectedItem.Id = null;
        var v = $scope.search.itemKey.trim();
        //var list = angular.copy($scope.userProductsBac);
        var list = $scope.resetLeaveSelected();
        if (v != "") {
            list = Enumerable.From(list)
                .Where(function (s) { return (s.Name!=null && s.Name.indexOf(v) > -1) || (s.Makat!=null && s.Makat.indexOf(v) > -1) })
                .ToArray();
        }
        if ($scope.search.itemCompany != 0) {
            list = Enumerable.From(list)
                .Where(function (s) { return s.CompanyID == $scope.search.itemCompany })
                .ToArray();
        }
        $scope.userProducts = list;
        $scope.loadPaging("userProducts");
    }


    $scope.isNewItemFormNotFilled = function () {
        var res = 0;
        $.each(itemTabs, function (i) {
            if (itemTemplate[itemTabs[i]] != $scope.selectedItem[itemTabs[i]]) res = 1;
        });
        return res < 1;
    }

    $scope.resetLeaveSelected = function () {
        // reset, leaving selected
        var selItems = Enumerable.From($scope.userProducts).Where(function (s) { return s.Selected }).Select("$.Id").ToArray();
        var list = angular.copy($scope.userProductsBac);
        $.each(list, function (i, o) {
            if (selItems.indexOf(o.Id) > -1) {
                o.Selected = true;
            }
        });
        return list;
    }

    // reset edit item form
    $scope.resetErrorItemForms = function () {
        $scope.userProducts = $scope.resetLeaveSelected();
        $scope.selectedItem = Enumerable
                .From($scope.userProducts)
                .Where(function (s) { return s.Id == $scope.selection.itemId })
                .FirstOrDefault();
        // $scope.resetMessages();

        if ($scope.itemValidator != null) {
            $scope.itemValidator.resetForm();
            var a = $scope.itemValidator.valid();
            $("#f441").find("label.error").hide();
        }
        $scope.itemResetErrors();
    }

    // reset all error messages
    $scope.itemResetErrors = function () {
        $.each($("#itemCard input"), function (i, o) {
            if ($(o).hasClass("error")) {
                $(o).removeClass("error");
            }
        });
        $scope.itemValidatorErrors = 0;
    }

    // count errors
    $scope.itemCountErrors = function () {
        var cnt = 0;
        $.each($("#itemCard input"), function (i, o) {
            if ($(o).hasClass("error")) cnt++;
        });
        $scope.itemValidatorErrors = cnt;
    }

    // delete product (archive)
    $scope.deleteProduct = function (id) {
        $scope.userProductsBac = Enumerable
            .From($scope.userProductsBac)
            .Where(function (s) { return s.Id != id })
            .ToArray();
        $scope.userProducts = Enumerable
            .From($scope.userProducts)
            .Where(function (s) { return s.Id != id })
            .ToArray();
        $scope.selectedItem.Id = null;
        $scope.loadPaging("userProducts");
        $http.get('Tasks.aspx?tp=73&id=' + id)
            .success(function (o) {
                if (o == "ok") {
                    //$scope.userProductsBac = Enumerable
                    //    .From($scope.userProductsBac)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.userProducts = Enumerable
                    //    .From($scope.userProducts)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.selectedItem.Id = null;
                    //$scope.loadPaging("userProducts");
                    $scope.tempMessage(0, "מחיקה בוצע בהצלחה");
                } else {
                    $scope.tempMessage(1, "הפעולה לא הצליחה");
                }
            }).error(function (status) {
                $scope.tempMessage(1, "הפעולה לא הצליחה");
            });
    }

    //
    $scope.hasSelectedItems = function () {
        try {
            var n = Enumerable.From($scope.userProducts)
                    .Where(function (x) { return x.Selected }).Count();
            //console.log(n); // TBD
            return n > 0;
        } catch (e) {
            return false;
        }
    }

    $scope.clearSelectedItems = function () {
        //$.each($scope.userProducts, function (i, p) {
        //    p.Selected = false;
        //});
        $scope.userProducts = angular.copy($scope.userProductsBac);
    }

    $scope.selectAllItems = function () {
        $.each($scope.userProducts, function (i, p) {
            p.Selected = true;
        });
    }

    $scope.deselectAllItems = function () {
        $.each($scope.userProducts, function (i, p) {
            p.Selected = false;
        });
    }

    $scope.saveAndSend = function ($event) {
        $scope.selectedItem.Selected = true;
        $scope.showPage(11, $event);
    }
}
