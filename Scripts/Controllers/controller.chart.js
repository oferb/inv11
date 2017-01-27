// manage chart
app.expandControllerChart = function ($scope, $http, $filter) {

    //$scope.chartData = {};
    $scope.chartState = {
        isChartLoaded: false,
        isAccumulated: false
    }
    //$scope.isChartLoaded = false;
    //$scope.isAccumulated = true;

    $scope.recalculateChartData = function () {
        
        //if ($scope.selectedPage != 101) return;
        
        var dh = [], dk = [], adh = [], adk = [];
        if (!$scope.chartState.isChartLoaded || typeof($scope.userDocuments)=="undefined") return;
        //var chart = $('#container').highcharts();
        var listH = Enumerable.From($scope.userDocuments)
                        .Where(function (s) {
                            return !s.IsDraft // cat
                                && ($scope.search.docCompany == 0 || (s.CompanyID == $scope.search.docCompany))
                                && ($scope.search.docCustomer == 0 || (s.CustomerID == parseInt($scope.search.docCustomer)))
                                && (s.DocumentType == 1 || s.DocumentType == 2 || s.DocumentType == 4)
                                && ($scope.inPeriod(s.Date));
                        }).ToArray();
        $.each(listH, function (i, o) {
            if (o["IsCanceled"] == null || !o["IsCanceled"]) {
                var sn = o.DocumentType == 4 ? (-1) : 1;
                var ph = {
                    x: (new Date(o.Date)).getTime(),
                    y: o.Total * sn
                }
                dh.push(ph);
            }
        });

        $.each($scope.userPayments, function (j, a) {
            if ($scope.isDocInFilteredData(a.DocID) && $scope.inPeriod(a.Date)) {
                if (a["IsCanceled"] == null || !a["IsCanceled"]) {
                    var pk = {
                        x: (new Date(a.Date)).getTime(),
                        y: a.Total
                    }
                    dk.push(pk);
                }
            }
        });

        dh = Enumerable.From(dh).OrderBy("$.x").ToArray();
        dk = Enumerable.From(dk).OrderBy("$.x").ToArray();

        var chart = $('#container').highcharts();

        if ($scope.chartState.isAccumulated) {
            // calc accumulated values
            var ty = 0;
            $.each(dh, function (i, p) {
                ty += p.y;
                var a = {
                    x: p.x,
                    y: ty
                }
                adh.push(a);
            })
            ty = 0;
            $.each(dk, function (i, p) {
                ty += p.y;
                var a = {
                    x: p.x,
                    y: ty
                }
                adk.push(a);
            })

            chart.series[0].setData(adh, false);
            chart.series[1].setData(adk, false);
            chart.series[0].update({
                type: "area"
            },false);
            chart.series[1].update({
                type: "area"
            },false);
        } else {
            chart.series[0].setData(dh, false);
            chart.series[1].setData(dk, false);
            chart.series[0].update({
                type: "column"
            }, false);
            chart.series[1].update({
                type: "column"
            }, false);
        }
        chart.redraw();
        //console.log(dh);
    }

    $scope.isDocInFilteredData = function (id) {
        var s = Enumerable.From($scope.userDocuments)
                       .Where(function (d) { return d.Id == id }).FirstOrDefault();
        return  !s.IsDraft 
                && ($scope.search.docCompany == 0 || (s.CompanyID == $scope.search.docCompany))
                && ($scope.search.docCustomer == 0 || (s.CustomerID == parseInt($scope.search.docCustomer)));
    }

    $scope.$watch('chartState.isAccumulated', function (newVal, oldVal) {
        if (newVal == oldVal) return;
        $scope.recalculateChartData();
    },true);
}

