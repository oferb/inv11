// main controller
var app = angular.module('myApp', ['mwl.confirm','ngSanitize','ngCsv'])
        .controller('myController', function ($scope, $http, $filter, $rootScope) {

            app.expandControllerUser($scope, $http);

            //app.expandControllerItem($scope, $http); // products   

            app.expandControllerProduct($scope, $http); // products   

            app.expandControllerComp($scope, $http); 
            app.expandControllerCust($scope, $http);      
            
            app.expandControllerDocument($scope, $http, $filter); // new document   
            app.expandControllerPayment($scope, $http, $filter); 
            app.expandControllerChart($scope, $http, $filter); 
            app.expandControllerPaging($scope); // for pagination      
            app.expandControllerReport($scope, $http); // reports      

            $scope.updateTime = Date.now();
            $scope.fromRangeChange = false;

            $scope.retToNewDoc = false; // return to new doc page
            $scope.goToNumLock = function () {
                $scope.retToNewDoc = true;
                $scope.showPage(45);
            }
            //$scope.newUserState = 0; // for test

            //$scope.user = {
            //    newUserState: 0
            //}

            //$scope.calcNewUserState = function () {
            //    if ($scope.userCompanies.length == 0) {
            //        $scope.user.newUserState = 0;
            //    } else if ($scope.userCustomers.length == 0) {
            //        $scope.user.newUserState = 1;
            //    }
            //    else if ($scope.userProducts.length == 0) {
            //        $scope.user.newUserState = 2;
            //    //} else if ($scope.ifUserDocNumNotSaved()) {
            //    } else if (!$scope.userCompanies[0].IsLocked) {
            //        $scope.user.newUserState = 3;
            //    }else{
            //        $scope.user.newUserState = 4;
            //    }
            //}

            $scope.ifUserDocNumNotSaved = function () {
               var docs = Enumerable
                        .From($scope.docConfig)
                        .Where(function (x) { return x.Last != 0 }).ToArray();
               return docs.length == 0;
            }

            //$scope.checkByStatus = function (id) {
            //    return $scope.newUserState + 43 <= id;
            //}

            // main menu and pages tree
            $scope.pages = sysPages;
            
            $scope.dicPages = {}; // dictionary of all pages
            $.each($scope.pages, function (i, o) {
                $scope.dicPages[o.id] = o;
            })

            // search object
            $scope.search = {
                companyKey: "",
                customerKey: "",
                itemKey: "",
                itemCompany: "0",
                docKey: "",
                docCompany: 0,
                docCustomer: 0,
                docType: 0,
                docPeriod: 0,
                docCat: 0, // 0 - all, 1 - docs, 2 - drafts
                docIncCanceled: true,
                // changed by #ortal&nofar#
                docIncClosed: true
                ////////

            };

            $scope.searchBac = angular.copy($scope.search);
            $scope.isInitRange = true;
            $scope.docPeriods = [
                {
                    p: 7,
                    t: "שבוע",
                    l: "'ש"
                },
                {
                    p: 30,
                    t: "חודש",
                    l: "'ח"
                },
                {
                    p: 92,
                    t: "3 חודשים",
                    l: "3 ח'"
                },
                {
                    p: 185,
                    t: "6 חודשים",
                    l: "6 ח'"
                },
                {
                    p: 365,
                    t: "שנה",
                    l: "שנה"
                },
            ];

            //$scope.selectionWOChange = false; // change value w/o reload 
            $scope.selection = {
                compId: null,
                custId: null,
                itemId: null
            };

            // top left corner error/success messages
            $scope.gErrorMsg = "";
            $scope.gSuccessMsg = "";
            $scope.resetMessages = function () {
                $scope.gErrorMsg = "";
                $scope.gSuccessMsg = "";
            }
            $scope.tempMessage = function (isError, msg) {
                if (isError) {
                    $scope.gErrorMsg = msg;
                } else {
                    $scope.gSuccessMsg = msg;
                }
                setTimeout(function () {
                    $scope.resetMessages();
                    $scope.$apply();
                }, 4000);
            }

            // temp
            $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                //$("label.error").show();
                //$.each($("#f421").find("input"), function (i, o) {
                //    if ($(o).hasClass("error")) {
                //        $(o).next().css("display", "inline-block");
                //    }
                //})
            })

            var catN = 1; // temp for cat numeration
            $scope.categories = Enumerable
                .From($scope.pages)
                .Where(function (x) { return x.cat != "common" & typeof (x.cat) != 'undefined' })
                .GroupBy("$.cat", null,
                 function (key, g) {
                     return {
                         cat: key,
                         id: catN++
                     }
                 }).ToArray();

            // methods
            $scope.showPage = function (id,event) {
                $scope.selectedPage = id < 10 ? (id * 10 + 1) : id;
                $scope.loadPageEvents();
                if(arguments.length>1){
                    event.preventDefault();
                    return false;
                }
            }

            $scope.isSelectedCategory = function (id) {
                return parseInt($scope.selectedPage / 10) == id;
            }


            // sort table functions
            $scope.selectedCls = function (sortObj, column) {
                if (typeof (sortObj) != "undefined") {
                    if (column == sortObj.column) {
                        if (sortObj.descending) {
                            return "glyphicon glyphicon-arrow-down c-red";
                        } else {
                            return "glyphicon glyphicon-arrow-up c-green";
                        }
                    } else {
                        return "";
                    }
                }
            };

            $scope.changeSorting = function (sortObj, column) {
                var sort = sortObj;
                if (sortObj.column == column) {
                    sortObj.descending = !sortObj.descending;
                } else {
                    sortObj.column = column;
                    sortObj.descending = false;
                }
            };


            $scope.loadSeparatePage = function (p) {
                //$scope.selectedPage = p;
                if (p == 11) {
                    $scope.loadDatePickersND();
                    var d = Enumerable.From($scope.userDocuments).Where(function (x) { return x.Id == $scope.newDoc.Id }).FirstOrDefault();
                    var bacTp = $scope.newDoc.Type;
                    //if (bacTp >= 9) return;  //changed by ortal&nofar
                    if (bacTp >= 9 && bacTp != 11 && bacTp != 12) return; // for cancel docs
                    if (typeof (d) == "undefined" || d == null || $scope.newDoc.Id == null || d.DocumentNumber != 0) {
                        $scope.loadInitDoc();
                        $scope.newDoc.Type = typeof (bacTp) == "undefined" ? 1 : bacTp;
                        $scope.newDoc.Title = $scope.getDocTitle($scope.newDoc.Type);
                    }
                }
            }


            //$scope.selectedPage = 101; // home
            $scope.loadPageEvents = function () {
                
                //$scope.loadDatePickers();
                switch ($scope.selectedPage) {
                    case 101: // home page
                        //var chart = $('#container').highcharts();
                        //chart.reflow();
                        //console.log($('#container').width());
                        //$scope.recalculateChartData();
                        break;
                    case 11: // new document
                        $scope.loadSeparatePage(11);
                        //if (!$scope.editSelectedDoc) $scope.resetNewDocument();
                        setTimeout(function () { $scope.loadCheckTooltips();}, 200);
                        break;
                    case 21: // user documents
                        $scope.loadDatePickersND();
                        $scope.loadPaging("userDocuments");
                        break;
                    case 31: // rep incomes
                        $scope.repFilter.Type = 0;
                        $scope.repFilter.Month = -1;
                        break;
                    case 32: // rep payments
                        $scope.repFilter.Type = 1;
                        $scope.repFilter.Month = -1;
                        break;
                    case 33: // rep pay methods
                        $scope.repFilter.Type = 2;
                        $scope.repFilter.Month = -1;
                        break;
                    case 41: // account
                        $("#f411 input").on("keyup", function () {
                            var a = $("#f411").valid();
                        });
                        break;
                    case 42: // companies
                        //$scope.isCompSelectedTab = $scope.userCompanies.length==0 ? 1 : 0;
                        $("#f421 input").on("keyup", function () {
                            var a = $("#f421").valid();
                            $scope.cmpCountErrors(2);
                        });
                        $scope.loadPaging("userCompanies");
                        $scope.isCompSelectedTab = 0;
                        //setTimeout(function () {
                        //    $('#compCardTabs li:eq(' + $scope.isCompSelectedTab + ') a').tab('show');
                        //}, 50);
                        break;
                    case 62: // customers
                        $("#f431 input").on("keyup", function () {
                        var a = $("#f431").valid();
                            $scope.custCountErrors();
                        });
                        $scope.loadPaging("userCustomers");
                        $scope.isCustSelectedTab = 0;
                        //setTimeout(function () {
                        //    $('#custCardTabs li:eq(' + $scope.isCustSelectedTab + ') a').tab('show');
                        //}, 50);
                        break;
                    case 44: // products
                        $("#f441 input").on("keyup", function () {
                        var a = $("#f441").valid();
                            $scope.itemCountErrors();
                        });
                        $scope.loadPaging("userProducts");
                        $scope.isItemSelectedTab = 0;
                        //setTimeout(function () {
                        //    $('#prodCardTabs li:eq(' + $scope.isItemSelectedTab + ') a').tab('show');
                        //}, 50);
                        break;
                    case 45:
                        $('.num-integer').keyup(function () {
                            var a = this.value.replace(/[^0-9\.]/g, '');
                            this.value = a == '' ? 1 : a;
                        });
                        break;
                    case 61: // payment tools
                        $scope.loadDatePickersNP();
                        $scope.autoFillTotal();
                        $("#f461 input").on("keyup", function () {
                            var a = $("#f461").valid();
                        });
                        break;
                    default:
                        break;
                }
            }

            $scope.setNumberOfChecks = function (o, index) {
                $(".inv-check").tooltipster('hide'); //, callback);
                var n = $(o).text();
                var obj = angular.copy($scope.docPayments[index]);
                for (var i = 1; i < n; i++) {
                    var newPay = angular.copy(obj);
                    newPay.Check = newPay.Check.addNumber(i);
                    newPay.Date = moment(newPay.Date).add(i, 'month'); //moment(newPay.Date).format('DD/MM/YYYY');
                    $scope.docPayments.push(newPay);
                }
                $scope.safeApply();
                setTimeout(function () {
                    $scope.loadCheckTooltips();
                }, 500);
                //$scope.loadCheckTooltips();


                //var newPay = {
                //    Type: $scope.getTypeObj(p.TypeID),
                //    Bank: typeof (p.BankCode) == "undefined" ? $scope.getBranchObj(p.Bank) : $scope.getBranchObj(p.BankCode),
                //    Branch: typeof (p.BranchCode) == "undefined" ? $scope.getBranchObj(p.Branch) : $scope.getBranchObj(p.BranchCode),
                //    Account: p.Account == null ? p.Account : "000000",
                //    Check: p.Check == null ? p.Check : "000000",
                //    Date: $scope.getDateString(p["Date"]), // moment(p["Date"]).format('DD/MM/YYYY'),
                //    Total: p.Total,
                //    Comments: p.Comments == null ? p.Comments : ""
                //};
                //$scope.docPayments.push(newPay);
                
            }

            $scope.getCheckTooltip = function (p) { // p - index of first check payment   
                //console.log(p);
                var s = '<div style="width: 140px; margin: 0px auto"><div class="inv-checks-ttl">מספר צ\'קים:</div>';
                var n = 1;
                for (var row = 1; row <= 4;row++){
                    s += '<div>';
                    for (col = 1; col <= 6; col++) {
                        if(row==1 && col == 1){
                            s += '<div class="inv-empty"></div>';
                        } else {
                            n++;
                            s += '<div class="inv-checks"><a href="#" onclick="scope.setNumberOfChecks(this,' + p + ')">' + n + '</a></div>';
                        }
                    }
                    s += '<div style="clear: both"></div></div>';
                }
                s += '</div>';                        
                return s;
            }

            $scope.loadCheckTooltips = function () {
                $.each($(".inv-check"), function (i, o) {
                    var p = $(o).attr("data-pay-id");
                    if ($(o).hasClass("tooltipstered")) {
                        $(o).tooltipster('destroy');
                    }
                    $(o).tooltipster({
                        content: $scope.getCheckTooltip(p),
                        contentAsHTML: true,
                        interactive: true,
                        theme: 'tooltipster-shadow',
                        position: 'bottom',
                        maxWidth:155
                    });
                })
            }


            // heb date pickers - for test file
            //$scope.$watch('hebDate', function (newVal, oldVal) {
            //    $('#datetimepickerNewDoc').data('DateTimePicker').date(newVal);
            //}, true);

            // not in use ??
            $scope.showTab = function (tab) {
                $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                //$scope.isItemSelectedTab = 0;
                //$scope.selection.itemId = null
            }

            //$scope.datePickersNDLoaded = false;
            $scope.loadDatePickersND = function () { // new doc
               // if ($scope.datePickersNDLoaded) return;
                $('#datetimepickerNewDocFrom').datetimepicker({
                    locale: 'he',
                    defaultDate: typeof ($scope.newDoc.Date) == "undefined" ? new Date() : $scope.newDoc.Date,
                    format: 'DD/MM/YYYY'
                });
                $("#datetimepickerNewDocFrom").on("dp.change", function (e) {
                    $scope.newDoc.Date = new Date(e.date); //.format("DD/MM/YYYY");
                    $scope.safeApply();
                });
                $('#datetimepickerNewDocDue').datetimepicker({
                    locale: 'he',
                    defaultDate: typeof ($scope.newDoc.DueDate) == "undefined" ? new Date() : $scope.newDoc.DueDate,
                    format: 'DD/MM/YYYY'
                });
                $("#datetimepickerNewDocDue").on("dp.change", function (e) {
                    $scope.newDoc.DueDate = new Date(e.date); //.format("DD/MM/YYYY");
                    $scope.safeApply();
                });
                //$scope.datePickersNDLoaded = true;
            }

            $scope.loadDatePickersNP = function () { // new pay
                    $('#datetimepickerNewPay').datetimepicker({
                        locale: 'he',
                        defaultDate: typeof ($scope.selectedPayment.Date) == "undefined" ? new Date() : $scope.getDateValue($scope.selectedPayment.Date),
                        format: 'DD/MM/YYYY'
                    });
                    $("#datetimepickerNewPay").on("dp.change", function (e) {
                        $scope.selectedPayment.Date = e.date; //.format("DD/MM/YYYY");
                        $scope.safeApply();
                    });
            }

            $scope.getDateValue = function (d) {
                try{
                    if (d.isValid()) {
                        return d;
                    }else{
                        return moment(d, "DD/MM/YYYY").toDate();
                    }
                } catch (e) {
                    return moment(d, "DD/MM/YYYY").toDate();
                }
            }
            



            $scope.countActive = function (list) {
                return Enumerable.From(list).Where(function (x) { return !x.IsArchive && x.CompanyID == $scope.selection.compId }).ToArray().length;
            }

            $scope.isPageHidden = function (p) {
                if (p == 62) {
                    return true;
                } else {
                    return false;
                }
                //if (p == 46 && !$scope.in([2, 3, 6])) {
                //    return true;
                //} else {
                //    return false;
                //}
            }

            /// utils
            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $scope.getShortStr = function (s, n) {
                if (typeof (s) == "undefined" || s==null) return "";
                if (s.length < n) return s;
                if (typeof (s) == 'undefined' || s == null) {
                    return "";
                }
                s = s.replace("'", "").replace("\"", "");
                return s.length > n ? (s.substring(0, n - 3) + "...") : s;
            }

            $scope.getDateString = function (d) {
                return moment(d).format('DD/MM/YYYY')
            }

            // ranges
            //$scope.dates2 = { startDate: moment('2013-09-20'), endDate: moment('2013-09-25') };
            //$scope.dates3 = { startDate: moment(), endDate: moment().add(1, 'day') };
            $scope.dates4 = { startDate: moment().subtract(1, 'day'), endDate: moment().subtract(1, 'day') };
            $scope.ranges = {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 days': [moment().subtract(7,'days'), moment()],
                'Last 30 days': [moment().subtract(30, 'days'), moment()],
                'This month': [moment().startOf('month'), moment().endOf('month')]
            };


            //
            $scope.isUserAgree = false;


      })


// prevent submit
window.app.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});




window.app.directive('checkLogo', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                element.attr('src', 'Logo/null.png'); // default image
            });
        }
    }
});


window.app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});


window.app.directive('draggable', function ($document) {
    return function (scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;
        element.css({
            position: 'relative',
            border: '1px solid red',
            backgroundColor: 'lightyellow',
            padding: '10px',
            cursor: 'pointer',
            display: 'block',
            width: '65px'
        });
        element.on('mousedown', function (event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });
        function mousemove(event) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }
        function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        }
    }
});