// add paging
app.expandControllerPaging = function ($scope) {
    $scope.boundaryLinks = true;
    $scope.directionLinks = true;
    $scope.pageSize = 10;
    $scope.linksOnPage = 10;
    $scope.paging = [];

    // load all paging objects
    $scope.pagingLastLoad = null;
    $scope.lastPagingStr = "";
    $scope.loadPaging = function () {
       
        var pageStr="";
        if ($scope.selectedPage == 44) {
            pageStr = "userProducts";
        } else if ($scope.selectedPage == 62) {
            pageStr = "userCustomers";
        } else if ($scope.selectedPage == 42) {
            pageStr = "userCompanies";
        } else if ($scope.selectedPage == 21) {
            pageStr = "userDocuments";
        }

        if (pageStr == "") return;
        if ($scope.paging.length == 0 || typeof ($scope.paging[n]) == "undefined"
            || $scope.lastPagingStr != JSON.stringify($scope.paging[n].list)) {
           
            var str = arguments.length == 0 ? $scope.getPageDataString() : pageStr;
            var mod = ["userProducts", "userCompanies", "userCustomers", "userDocuments"];
            var n = mod.indexOf(str);

            if (typeof ($scope[str]) == "undefined" || $scope[str].length == 0) return;
            $scope.paging[n] = angular.copy($scope.pagingTemplate);

            if (str == "userDocuments") {
                $scope.paging[n].list = $scope.filteredDocuments();
            } else if (str == "userCustomers") {
                $scope.paging[n].list = $scope.userCustomers;
            } else {
                $scope.paging[n].list = Enumerable.From($scope[str]).Where(function (x) {
                    return x.CompanyID == $scope.search.docCompany && !x.IsArchive;
                }).ToArray();
            }
           $scope.lastPagingStr = JSON.stringify($scope.paging[n].list);
        }
    }

    $scope.getPageDataString = function () {
        switch ($scope.selectedPage) {
            case 21: // documents
                return "userDocuments";
                break;
            case 42: // companies
                return "userCompanies";
                break;
            case 62: // customers
                return "userCustomers";
                break;
            case 44: // products
                return "userProducts";
                break;
            default:
                return "";
                break;
        }
    }

    $scope.pagingTemplate = {
            list: null,
            pageCount: function () {
                var x1 = this.list.length / $scope.pageSize;
                var x2 = Math.floor(x1);
                return x1 == x2 ? x2 : (x2 + 1);
            },
            pages: function () {
                var ar = [];
                for (var i = 1; i <= this.pageCount() ; i++) ar.push(i);
                return ar;
            },
            current: 1, // init
            first: function () {
                return this.current == 1;
            },
            last: function () {
                return this.current == this.pageCount();
            },
            setPage: function (n) {
                this.current = n;
                this.from = (n - 1) * $scope.pageSize;
                //this.from = $scope.pageSize * Math.round(n / $scope.pageSize) + 1;
                $scope.pagingLastLoad = moment();
            },
            //isPageChanging: false,
            from: 0
    }

    $scope.getShownButtons = function (p) {
        //$scope.linksOnPage
        var len = p.pages().length;
        if ($scope.linksOnPage >= len) {
            return p.pages();
        } else {
            var x = p.current;
            var ar = [];
            if (x > 1) {
                ar.push("...");
            }

            var first = x + $scope.linksOnPage - len - 1;
            if (first < 0) first = 0;

            for (var i = 0; i < $scope.linksOnPage; i++) {
                ar.push(x - first + i);
            }
            if (x - first + $scope.linksOnPage-1 < len) {
                ar.push("...");
            }
            return ar;
        }
        
        
    }
    $scope.incCurrent = function (n) {
        $scope.paging[n].setPage($scope.paging[n].current + 1);

    }

    $scope.decCurrent = function (n) {
        $scope.paging[n].setPage($scope.paging[n].current - 1);
    }

   
}