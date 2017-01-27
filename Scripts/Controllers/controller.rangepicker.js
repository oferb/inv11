/// <reference path="../Templates/rangepicker.tmpl.htm" />
// for my custom date range picker
window.app.directive('vdaterange', function ($http, $compile) {

    var directive = {};

    directive.restrict = 'AE';
    directive.link = function (scope, element, attr) {
        var templateString = '';

        $http.get('Templates/rangepicker.tmpl.htm').then(function (response) {
            templateString = response.data;
            var compiledHtml = $compile(templateString)(scope); // compile with scope variables
            element.append(compiledHtml); // change this around to insert your element into the DOM

            var ddl = element.find(".selectpicker").first(); //.eq(0);
            $.each(scope.docPeriods, function (i, o) {
                $(ddl)
                    .append($("<option></option>")
                    .attr("value", o.p)
                    .attr("title", o.t)
                    .text(o.t));
            });
            // special options
            $(ddl).append($("<option style='display:none'></option>")
                   .attr("value", -1)
                   .attr("title", "בין תאריכים")
                   .text("בין תאריכים"));

            //$(ddl).selectpicker("noneSelectedText", "בין תאריכים");

            scope.firstDate = moment("2015-01-01"); 
            //scope.lastDate = moment(); 
            scope.dateRange = {
                from: scope.firstDate,
               
                to: moment()
            }; // init state
            
            scope.fromDateRangeDdl = false;
            $(ddl).on("change", function () {
                //var o = this;
               
                    scope.fromDateRangeDdl = true;
                    var d1 = element.find(".dpFrom").first();
                    var d2 = element.find(".dpTo").first();
                    //scope.dateRange.to = moment();
                    //$(d2).data('DateTimePicker').date(scope.dateRange.to);
                    var v = parseInt($(this).val());
                    if (v == 0) {
                        scope.dateRange.from = scope.firstDate; // add max period
                    } else {
                        scope.dateRange.from = moment().subtract(v, 'days'); // add max period
                    }
                    $(d1).data('DateTimePicker').date(scope.dateRange.from);

                setTimeout(function () {
                    scope.fromDateRangeDdl = false;
                    scope.isInitRange = v == 0;
                    scope.fromRangeChange = true;
                    scope.loadPaging("userDocuments");
                    scope.safeApply();
                }, 500);
            });

            //
            var isWaitForToUpdate = false;
            //var dpCreate = element.find(".dpCreate").first();
            //$(dpCreate).datetimepicker({
            //    locale: 'he',
            //    defaultDate: scope.dateRange.create,
            //    format: 'DD/MM/YYYY'
            //});
            //$(dpCreate).on("dp.change", function (e) {
            //    scope.dateRange.create = e.date;
            //    if (scope.dateRange.create > scope.dateRange.to) {
            //        var d = element.find(".dpTo").first();
            //        $(d).data('DateTimePicker').date(scope.dateRange.create);
            //    }
            //    scope.safeApply();
            //    scope.fitRangeCombo();

            //});
            var dpFrom = element.find(".dpFrom").first();
            $(dpFrom).datetimepicker({
                locale: 'he',
                defaultDate: scope.dateRange.from, 
                format: 'DD/MM/YYYY'
            });
            $(dpFrom).on("dp.change", function (e) {                
                scope.dateRange.from = e.date;
                if (scope.dateRange.from > scope.dateRange.to) {
                    var d = element.find(".dpTo").first();
                    $(d).data('DateTimePicker').date(scope.dateRange.from);
                }
                scope.safeApply();
                scope.fitRangeCombo();
                
            });

            var dpTo = element.find(".dpTo").first();
            $(dpTo).datetimepicker({
                locale: 'he',
                defaultDate: scope.dateRange.to,
                format: 'DD/MM/YYYY'
            });
            $(dpTo).on("dp.change", function (e) {
                scope.dateRange.to = e.date;
                if (scope.dateRange.to < scope.dateRange.from) {
                    var d = element.find(".dpFrom").first();
                    $(d).data('DateTimePicker').date(scope.dateRange.to);
                }
                scope.safeApply();
                scope.fitRangeCombo();
            });

        });
    };

    directive.controller = function ($scope, $element) {

        $scope.resetDateRange = function () {
            var ddl = $element.find(".selectpicker").first();
            $(ddl).selectpicker('val', "0");
            $(ddl).trigger("change");
        }

        $scope.fitRangeCombo = function () {
            if ($scope.fromDateRangeDdl) return;
            var ddl = $element.find(".selectpicker").first();
            var td = parseInt(moment().diff($scope.dateRange.to, 'days'));
            var fd = parseInt($scope.dateRange.from.diff($scope.firstDate, 'days'));

            if (td == 0) {
                if (fd == 0) {
                    $(ddl).selectpicker('val', "0");                    
                } else{
                    var rng = parseInt($scope.dateRange.to.diff($scope.dateRange.from, 'days'));
                    var ar = [7, 30, 92, 185, 365];
                    var ind = ar.indexOf(rng);
                    if (ind > -1) {
                        $(ddl).selectpicker('val', rng.toString());
                    } else {
                        $(ddl).selectpicker('val', "-1");
                    }
                }
            } else {
                $(ddl).selectpicker('val', "-1");
            }
        }

        $scope.$watch('dateRange', function (newVal, oldVal) {
            $scope.recalculateChartData();
            $scope.loadPaging("userDocuments");
            //$scope.safeApply();
        }, true);
    };

    return directive;

});