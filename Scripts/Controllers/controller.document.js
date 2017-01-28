// manage new document
app.expandControllerDocument = function ($scope, $http, $filter, $timeout) {
    //$scope.docConfig = {};
    $scope.newDoc = { Id: null };
    $scope.lastDocType = 0; //?
    $scope.selfInvoice = false;
    $scope.editSelectedDoc = false;
    $scope.loadInitDoc = function () {
        //if ($scope.user.newUserState < 3) return;
        if (typeof ($scope.userCompanies[0]) == "undefined") return;
        if (typeof ($scope.selectedCompany) == "undefined") $scope.selectedCompany = angular.copy($scope.userCompanies[0]);
        var compId = ($scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null)
           ? $scope.userCompanies[0].Id : $scope.selectedCompany.Id;

        var doc = Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == compId })
              .FirstOrDefault();
        $scope.lastDocType = doc.DocID; // ?
        //var bacTp = $scope.newDoc.Type;
        var paidBac = typeof ($scope.newDoc.Paid) == "undefined"
            ? {
                Total: 0,
                MasBaMakor: 0 // %
            }
            : angular.copy($scope.newDoc.Paid);
        if (typeof ($scope.newDoc) == "undefined" || $scope.newDoc.Id == null) {
            $scope.newDoc = {
                Id: 0,
                Type: doc.DocID,
                Title: doc.Name,
                Code: doc.IPCode,
                Date: new Date(),
                DueDate: new Date(moment().add(30, 'days')),
                Company: angular.copy(($scope.selectedCompany.Id == 0
                    || $scope.selectedCompany.Id == null)
                    ? $scope.userCompanies[0] : $scope.selectedCompany),
                Customer: angular.copy((typeof ($scope.selectedCustomer) == "undefined" || $scope.selectedCustomer.Id == 0
                    || $scope.selectedCustomer.Id == null)
                    ? $scope.userCustomers[0] : $scope.selectedCustomer),
                Items: [],
                //Info: [],
                Discount: 0,
                DiscPer: true, //false - NIS, true - %
                Nds: $scope.dataCommon["Nds"] * 100, // false if NDS is not required
                NdsInc: true, // false if NDS is not required
                Paid: angular.copy(paidBac),
                Comments: ""
            }
        }
        // create backup
        $scope.tempDocBac = angular.copy($scope.newDoc);

        //$scope.docConfig.getTitle = function (id) {
        //    //var o = Enumerable
        //    //        .From(this)
        //    //        .Where(function (s) { return s.Id == id })
        //    //        .FirstOrDefault();
        //    var o = Enumerable
        //            .From($scope.docTypes)
        //            .Where(function (s) { return s.Id == id })
        //            .FirstOrDefault();
        //    if (typeof (o) == "undefined" || o == null) {
        //        return '';
        //    } else {
        //        return o.Name;
        //    }
        //}
    }

    $scope.getDocTitle = function (id) {
        var o = Enumerable
                .From($scope.docTypes)
                .Where(function (s) { return s.Id == id })
                .FirstOrDefault();
        if (typeof (o) == "undefined" || o == null) {
            return '';
        } else {
            return o.Name;
        }
    }


    $scope.$watch('newDoc.Type', function (newVal, oldVal) {
        if (typeof (newVal) == "undefined") return;
        $scope.tempDocBac = angular.copy($scope.newDoc);
        $scope.newDoc.Title = $scope.getDocTitle(newVal);
        // reset newdoc form
        if (!$scope.editSelectedDoc)
            $scope.resetNewDocument();
    }, true);



    $scope.isChangedDocConfig = function (o) {
        if (typeof ($scope.newDoc.Company) == "undefined") return false;
        if (o == null) {
            var res = false;
            var docs = Enumerable
                 .From($scope.docConfig)
                 .Where(function (x) { return x.CompanyID == $scope.newDoc.Company.Id }).ToArray();
            var bacs = Enumerable
                 .From($scope.docConfigBac)
                 .Where(function (x) { return x.CompanyID == $scope.newDoc.Company.Id }).ToArray();
            $.each(bacs, function (i, h) {
                if (bacs[i].Start != docs[i].Start) res = true;
            });
            return res;
        } else {
            var bac = Enumerable
              .From($scope.docConfigBac)
              .Where(function (x) { return x.Id == o.Id && x.CompanyID == o.CompanyID })
              .FirstOrDefault();
            return bac.Start != o.Start;
        }

    }

    $scope.resetDocConfig = function () {
        $scope.docConfig = angular.copy($scope.docConfigBac);
    }

    $scope.activeDocs = function () {
        return Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == $scope.newDoc.Company.Id })
              .ToArray().length;
    }

    // not in use
    $scope.changeDocActive___ = function (id) {
        $http.get('Tasks.aspx?tp=102&id=' + id)
           .success(function (o) {
               if (o == "ok") {
                   var bac = Enumerable
                       .From($scope.docConfigBac)
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

    // when company is changed
    $scope.checkAndUpdateDoc = function () {
        if (!$scope.changingDocFlag) return;
        if (typeof ($scope.userCompanies[0]) == "undefined") return;
        var compId = (typeof ($scope.selectedCompany) == "undefined"
           || $scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null)
           ? $scope.userCompanies[0].Id : $scope.selectedCompany.Id;
        var doc = Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == compId && x.DocID == $scope.lastDocType })
              .FirstOrDefault();
        if (typeof (doc) == "undefined") {
            doc = Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == compId })
              .FirstOrDefault();
        } else {

        }
        $scope.newDoc.Type = doc.DocID;
        //$scope.newDoc.Title = doc.Name;
        scope.newDoc.Code = doc.IPCode;
        $scope.changingDocFlag = false;
    }

    $scope.changeDocType = function () {
        if (typeof ($scope.newDoc.Type) == "undefined") return;
        $scope.newDoc.Title = $scope.getDocTitle($scope.newDoc.Type);
        $scope.lastDocType = $scope.newDoc.Type;

    };

    $scope.changingDocFlag = false;
    $scope.changeCompany = function () {
        $scope.selection.compId = $scope.newDoc.Company.Id;
        $scope.changingDocFlag = true;
        $scope.checkAndUpdateDoc();
    }


    $scope.calcDisc = function () {
        if ($scope.newDoc.DiscPer) {
            var tot = $scope.calcTotal();
            return $scope.newDoc.Discount * tot / 100;
        } else {
            return $scope.newDoc.Discount;
        }
    }

    $scope.calcTotal = function () {
        var s = 0;
        $.each($scope.userProducts, function (i, p) {
            if (p.Selected) {
                s += p.Price * p.Amount;
            }
        });
        return Math.round(100 * s) / 100;
    }

    $scope.totalItemsNds = function () {
        var s = (($scope.calcTotal() - $scope.calcDisc()) * ($scope.newDoc.Nds / 100));
        return Math.round(100 * s) / 100;
    }
    $scope.totalItems = function () {
        var s = ($scope.calcTotal() - $scope.calcDisc()) * (1 + ($scope.newDoc.NdsInc ? ($scope.newDoc.Nds / 100) : 0));
        return Math.round(100 * s) / 100;
    }


    $scope.calcObject = function () {
        var tot1 = $scope.calcTotal();
        var disc1 = $scope.calcDisc();
        var nds1 = $scope.newDoc.NdsInc ? (tot1 - disc1) * ($scope.newDoc.Nds / 100) : 0;
        var total1 = tot1 - disc1 + nds1;

        return {
            items: tot1,
            disc: disc1,
            before_nds: tot1 - disc1,
            nds: nds1,
            total: total1
        }
    }

    /////////////////////////////////////////////////////////////
    // user documents
    // sort documents table
    $scope.docSort = {
        column: 'Id',
        descending: true
    };

    $scope.prepareUserDocs = function (docs) {
        $.each(docs, function (i, d) {

            var com = Enumerable
                .From($scope.userCompaniesBac)
                .Where(function (x) { return x.Id == d["CompanyID"] })
                .FirstOrDefault();
            var doc = Enumerable
                    .From($scope.docConfigBac)
                    .Where(function (x) { return x.DocID == d["DocumentType"] })
                    .FirstOrDefault();
            var cust = Enumerable
                    .From($scope.userCustomersBac)
                    .Where(function (x) { return x.Id == d["CustomerID"] })
                    .FirstOrDefault();
            if (com != null && doc != null && cust != null) {
                d["CompanyN"] = com.Name;
                d["DocumentN"] = doc.Name;
                d["CustomerN"] = cust.Name;
                d["DateV"] = moment(d["Date"]).format('DD/MM/YYYY');
                d["DateVal"] = (new Date(d["Date"])).getTime();
                d["DueDateV"] = moment(d["DueDate"]).format('DD/MM/YYYY');
                d["DueDateVal"] = (new Date(d["DueDate"])).getTime();
                d["Date"] = (new Date(d["Date"])).getTime();

            }

            else {
                d["CompanyN"] = null;
            }

        })

        docs = Enumerable.From(docs).Where(function (x) { return x["CompanyN"] != null }).Distinct().ToArray();
        return docs;
        //$.each(docs, function (i, d) {
        //    try{
        //        d["CompanyN"] = Enumerable
        //            .From($scope.userCompaniesBac)
        //            .Where(function (x) { return x.Id == d["CompanyID"] })
        //            .FirstOrDefault().Name;
        //        d["DocumentN"] = Enumerable
        //            .From($scope.docConfigBac)
        //            .Where(function (x) { return x.DocID == d["DocumentType"] })
        //            .FirstOrDefault().Name;
        //        d["CustomerN"] = Enumerable
        //            .From($scope.userCustomersBac)
        //            .Where(function (x) { return x.Id == d["CustomerID"] })
        //            .FirstOrDefault().Name;
        //        d["DateV"] = moment(d["Date"]).format('DD/MM/YYYY');
        //        d["DateVal"] = (new Date(d["Date"])).getTime();
        //        d["DueDateV"] = moment(d["DueDate"]).format('DD/MM/YYYY');
        //        d["DueDateVal"] = (new Date(d["DueDate"])).getTime();
        //    } catch (e) {
        //        var x = 1;
        //    }
        //})
        //return docs;
    }

    $scope.addSavedUserDoc = function (d, id) {
        $scope.completeDoc(d);
        if (id == 0) {
            $scope.newDoc.Id = d["Id"];
            $scope.userDocuments.push(angular.copy(d));
            $scope.userDocumentsBac.push(angular.copy(d));
            $scope.resetDocumentFilters();
        } else {
            // update
            var doc = Enumerable.From($scope.userDocuments)
               .Where(function (x) { return x.Id == d["Id"] }).FirstOrDefault();
            $.each(doc, function (prop, value) {
                doc[prop] = d[prop];
            });
            $scope.userDocumentsBac = angular.copy($scope.userDocuments);
            // rem prev docProducts
            $scope.docProducts = Enumerable.From($scope.docProducts)
                .Where(function (x) { return x.DocumentID != d["Id"] }).ToArray();
            //// rem prev payments
            //$scope.userPayments = Enumerable.From($scope.userPayments)
            //    .Where(function (x) { return x.DocID != d["Id"] }).ToArray();
        }
        // update numbering
        var dc = Enumerable.From($scope.docConfig)
            .Where(function (x) { return x.CompanyID == d["CompanyID"] && x.DocID == d["DocumentType"] }).FirstOrDefault();
        dc["Last"] = d["DocumentNumber"];
        $scope.docConfigBac = angular.copy($scope.docConfig);

        //$scope.checkUserItems();

        //$scope.addNewPayments(d);
        //$scope.addNewDocItems(d);

    }

    // check and update new items
    $scope.checkUserItems = function () {
        //var checked = Enumerable.From($scope.userProducts)
        //    .Where(function (x) { return x.Selected }).ToArray();
        $http.get('Tasks.aspx?tp=203')
            .success(function (list) {
                // user products
                $.each(list.userProducts, function (i, o) {
                    $scope.userProductsBac.push(o);
                    $scope.userProducts.push(o);
                });
                LoadDocProducts();

                //if (list.userProducts.length > 0) {
                //    $scope.userProducts = angular.copy($scope.userProductsBac);
                //};
                // document products
                //var ar = Enumerable.From(list.docProducts)
                //    .Select(function (x) { return x.Id }).ToArray();
                var docPr = Enumerable.From($scope.docProducts)
                    .Where(function (x) { return x.IsNew }).ToArray();
                $.each(docPr, function (i, o) {
                    //$scope.docProducts.push(o);
                    o.IsNew = false;
                });
                $scope.safeApply();
            });
    }

    $scope.completeDoc = function (d) {
        d["CompanyN"] = Enumerable
                .From($scope.userCompaniesBac)
                .Where(function (x) { return x.Id == d["CompanyID"] })
                .FirstOrDefault().Name;
        d["DocumentN"] = Enumerable
            .From($scope.docTypes)
            .Where(function (x) { return x.Id == d["DocumentType"] })
            .FirstOrDefault().Name;
        d["CustomerN"] = Enumerable
            .From($scope.userCustomersBac)
            .Where(function (x) { return x.Id == d["CustomerID"] })
            .FirstOrDefault().Name;
        d["DateV"] = moment(d["Date"]).format('DD/MM/YYYY');
        d["DueDateV"] = moment(d["DueDate"]).format('DD/MM/YYYY');
        d["IPCode"] = Enumerable
                .From($scope.docTypes)
                .Where(function (x) { return x.Id == d["DocumentType"] })
                .FirstOrDefault().IPCode;
        d["Total"] = Math.round(100 * ($scope.calcTotal() - $scope.calcDisc()) * (1 + ($scope.newDoc.NdsInc ? ($scope.newDoc.Nds / 100) : 0))) / 100;
        // add/update payments
        // rem prev payments
        $scope.userPayments = Enumerable.From($scope.userPayments)
            .Where(function (x) { return x.DocID != d["Id"] }).ToArray();
        d = $scope.addNewPayments(d);
        2
        //if (d["DocumentType"] >= 9 && d["DocumentType"] != 11) { //changed by ortal&nofar
        if (d["DocumentType"] >= 9 && d["DocumentType"] != 11 && d["DocumentType"] != 12) {
            d["Total"] = 0.01;
            d["PaidTotal"] = 0.01;
            var d_canceled = Enumerable
                .From($scope.userDocuments)
                .Where(function (x) { return x.Id == d["CancelID"] })
                .FirstOrDefault();
            d_canceled["IsCanceled"] = true;
            $scope.userDocumentsBac = angular.copy($scope.userDocuments);
        }
    }

    $scope.addNewDocItems = function (d) {
        $.each($scope.userProducts, function (i, p) {
            if (p.Selected) {
                var o = {
                    Amount: p.Amount,
                    DocumentID: d.Id,
                    Id: $scope.docProducts.length + 1,
                    Name: p.Name,
                    Info: '', // for new
                    Price: p.Price,
                    ProductID: p.Id
                }
                $scope.docProducts.push(o);
            }
        });
    }

    $scope.addNewPayments = function (d) {
        var paid = 0;
        $.each($scope.docPayments, function (i, p) {
            var newPay = {
                Type: p.Type.Type,
                TypeID: p.Type.Id,
                Bank: p.Type.Id == 1 ? p.Bank.Id : null,
                Branch: p.Type.Id == 1 ? p.Branch.Id : null,
                Account: p.Account,
                Check: p.Check,
                Date: p["Date"].toString(), //moment(p["Date"]).format('DD/MM/YYYY'),
                Total: p.Total,
                Comments: p.Comments,
                DocID: d.Id
            };
            paid += p.Total;
            $scope.userPayments.push(newPay);
        })
        d["PaidTotal"] = paid;
        return d;
    }

    $scope.docPreview = function (doc) {
        //var docFile = Enumerable
        //        .From($scope.docTypes)
        //        .Where(function (x) { return x.Id == doc.DocumentType })
        //        .FirstOrDefault().IPCode.trim() + "_" + doc.Id + ".pdf";
        //return "Documents/" + $scope.userData.Id + "/" + docFile;
        return "PreviewB.aspx?c=1&id=" + doc.Id;
    }

    $scope.docPDF = function (doc) {
        //var tp = Enumerable
        //        .From($scope.docTypes)
        //        .Where(function (x) { return x.Id == doc.DocumentType })
        //        .FirstOrDefault().IPCode.trim();
        //return "http://www.vir-tec.net/inv/Pdf.aspx?id=" + doc.Id + "&tp=" + tp;
        return "http://www.vir-tec.net/inv/Pdf1.aspx?id=" + doc.Id;
    }



    // load saved document for edit or cancel
    $scope.cancelID = null;
    $scope.CancelMsg = "";
    $scope.loadSavedDocForEdit = function (id, isCancel) {
        $scope.editSelectedDoc = true;

        var d = Enumerable
                .From($scope.userDocumentsBac)
                .Where(function (x) { return x.Id == id })
                .FirstOrDefault();

        if (isCancel) { // for cancel docs
            var tp = d.DocumentType;
            d = angular.copy(d);
            if (tp == 1) {
                d.DocumentType = 10;
            } else {
                d.DocumentType = 9;
            }
            var tpObj = Enumerable
                .From($scope.docTypes)
                .Where(function (x) { return x.Id == d.DocumentType })
                .FirstOrDefault();
            d.DocumentN = tpObj.Name;
            //d.Id = 0;
            d.Comments = "";
            d.IPCode = tpObj.IPCode;
            d.CancelMsg = d.DocumentN + " מס' " + d.DocumentNumber + " על ס'הכ " +
                (d.DocumentType == 10 ? d.Total : d.PaidTotal) + " ש'ח " + " מתאריך " + moment(d["DueDate"]).format('DD/MM/YYYY');
            $scope.CancelMsg = d.CancelMsg;
            d.IsCanceled = true;
            d.CancelID = d.Id;
            $scope.cancelID = d.Id;
            d.Total = 0.01;
            d.PaidTotal = 0.01;
            //$scope.userDocumentsBac.push(d);
            $scope.userDocuments = angular.copy($scope.userDocumentsBac);

        } else {
            $scope.cancelID = null;
            $scope.CancelMsg = "";
        }

        // 
        $scope.newDoc = {
            Id: isCancel ? 0 : d.Id,
            Type: d.DocumentType,
            Title: d.DocumentN,
            Code: d.IPCode,
            Date: moment(isCancel ? new Date() : d["Date"]).format('DD/MM/YYYY'),
            DueDate: moment(d["DueDate"]).format('DD/MM/YYYY'), //TBD
            Company: angular.copy(Enumerable
                .From($scope.userCompaniesBac)
                .Where(function (x) { return x.Id == d.CompanyID })
                .FirstOrDefault()),
            Customer: angular.copy(Enumerable
                .From($scope.userCustomersBac)
                .Where(function (x) { return x.Id == d.CustomerID })
                .FirstOrDefault()),
            Items: [],
            Discount: d.Discount,
            DiscPer: d.DiscPer, //false - NIS, true - %
            Nds: d.Nds * 100,
            NdsInc: d.NdsInc,
            Paid: {
                Total: d["PaidTotal"] == null ? 0 : d["PaidTotal"],
                MasBaMakor: d["MasBaMakor"] == null ? 0 : d["MasBaMakor"] // %
            },
            CancelID: isCancel ? d.Id : 0,
            CancelMsg: d.CancelMsg,
            Comments: d.Comments
        }

        $scope.search.docCustomer = d.CustomerID;
        $scope.selectedPage = 11;
        //$time1 = $('#datetimepickerNewDocFrom').data("DateTimePicker");
        var d1 = moment($scope.newDoc.Date, "DD/MM/YYYY").format('DD/MM/YYYY');//.toDate();
        //$time1.date(d1);
        //$time2 = $('#datetimepickerNewDocDue').data("DateTimePicker");
        var d2 = moment($scope.newDoc.DueDate, "DD/MM/YYYY").toDate();
        //$time2.date(d2);

        $scope.deselectAllItems(); // before loading products deselect prev ones
        if (!isCancel) {
            // load products
            var list = Enumerable.From($scope.docProducts)
                .Where(function (x) { return x.DocumentID == d.Id }).ToArray();
            $.each(list, function (i, p) {
                var item = Enumerable.From($scope.userProducts)
                    .Where(function (x) { return x.Id == p.ProductID }).FirstOrDefault();
                if (typeof (item) != "undefined") {
                    item.Selected = true;
                    item.Price = p.Price;
                    item.Info = p.Info == null ? "" : p.Info;
                    item.Amount = p.Amount;
                }
            })

            // load payments
            var ps = Enumerable.From($scope.userPayments)
                .Where(function (x) { return x.DocID == id }).ToArray();
            $scope.docPayments = [];
            $.each(ps, function (i, p) {
                var newPay = {
                    Type: $scope.getTypeObj(p.TypeID),
                    Bank: typeof (p.BankCode) == "undefined" ? $scope.getBranchObj(p.Bank) : $scope.getBranchObj(p.BankCode),
                    Branch: typeof (p.BranchCode) == "undefined" ? $scope.getBranchObj(p.Branch) : $scope.getBranchObj(p.BranchCode),
                    Account: p.Account != null ? p.Account : "000000",
                    Check: p.Check != null ? p.Check : "000000",
                    Date: $scope.getDateString(p["Date"]), // moment(p["Date"]).format('DD/MM/YYYY'),
                    Total: p.Total,
                    Comments: p.Comments != null ? p.Comments : ""
                };
                $scope.docPayments.push(newPay);
            });
            setTimeout(function () { $scope.loadCheckTooltips(); }, 500);
        } else {

        }
        // create backup
        $scope.tempDocBac = angular.copy($scope.newDoc);
        setTimeout(function () { $scope.editSelectedDoc = false; }, 1000);
    }

    $scope.getDateString = function (d) {
        if (moment(d, "DD/MM/YYYY").isValid()) {
            return moment(d, "DD/MM/YYYY");
            //return moment(d).format('DD/MM/YYYY');
        } else {
            return moment(d).toDate(); // .format('DD/MM/YYYY');
            //return d;
        }
        //try{
        //    var ds = moment(d).format('DD/MM/YYYY');
        //    if (ds == "Invalid date") {
        //        return d;
        //    } else {
        //        return ds;
        //    }
        //} catch (e) {
        //    return ds;
        //}
    }

    $scope.getTypeObj = function (id) {
        var t = Enumerable.From($scope.payConfig).Where(function (x) { return x.Id == id }).FirstOrDefault();
        return angular.copy(t);
    }

    $scope.getBankObj = function (id) {
        var t = Enumerable.From($scope.banks).Where(function (x) { return x.Id == id }).FirstOrDefault();
        return angular.copy(t);
    }

    $scope.getBranchObj = function (id) {
        var t = Enumerable.From($scope.branches).Where(function (x) { return x.Id == id }).FirstOrDefault();
        return angular.copy(t);
    }

    $scope.resetNewDocument = function () {
        $scope.clearDocumentItems();
        $scope.clearPayments();
        // create backup
        $scope.tempDocBac = angular.copy($scope.newDoc);
    }

    $scope.setDocType = function (n) {

        console.log("number", n);


        if (n == 12)
            $scope.search.docType = 11;
        else if (n == 11)
            $scope.search.docType = 8
        else
            $scope.search.docType = n;

        $scope.newDoc.Type = n;
        $scope.newDoc.Title = $scope.getDocTitle($scope.newDoc.Type);
        //if (n == 12) {
        //    $scope.doc12Search = 1;
        //    $scope.filteredDocuments();
        //    $scope.doc12Search = 0;
        //    $('#selType1').selectpicker('val', 11);
        //    $scope.loadPaging("userDocuments");

        //}

        setTimeout(function () {
            $scope.filteredDocuments()
        }, 2000);
    }



    $scope.clearDocumentItems = function () {
        if (!$scope.isAllDataLoaded) return;
        if ($scope.userCompanies.length == 0) return;
        var docTypeBac = $scope.newDoc.Type;
        var paidBac = angular.copy($scope.newDoc.Paid);
        $scope.clearSelectedItems();
        if (typeof ($scope.selectedCompany) == "undefined") $scope.selectedCompany = $scope.userCompanies[0];
        var compId = (typeof ($scope.selectedCompany) == "undefined"
           || $scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null)
           ? $scope.userCompanies[0].Id : $scope.selectedCompany.Id;
        var doc = Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == compId })
              .FirstOrDefault();
        $scope.newDoc = {
            Id: 0,
            Type: docTypeBac,
            Title: doc.Name,
            Code: doc.IPCode,
            Date: new Date(),
            DueDate: new Date(moment().add(30, 'days')),
            Company: angular.copy(($scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null)
                ? $scope.userCompanies[0] : $scope.selectedCompany),
            Customer: angular.copy((typeof ($scope.selectedCustomer) == "undefined" || $scope.selectedCustomer.Id == 0 || $scope.selectedCustomer.Id == null)
                ? $scope.userCustomers[0] : $scope.selectedCustomer),
            Items: [],
            Discount: 0,
            DiscPer: true, //false - NIS, true - %
            Nds: $scope.dataCommon["Nds"] * 100, // false if NDS is not required
            NdsInc: true, // false if NDS is not required
            Paid: angular.copy(paidBac),
            Comments: ""
        }

        $time1 = $('#datetimepickerNewDocFrom').data("DateTimePicker");
        if (typeof ($time1) != "undefined") {
            $time1.date($scope.newDoc.Date);
            $time2 = $('#datetimepickerNewDocDue').data("DateTimePicker");
            $time2.date($scope.newDoc.DueDate);
        }
    }


    $scope.deleteUserDocument = function (id) {
        $scope.userDocumentsBac = Enumerable
             .From($scope.userDocumentsBac)
             .Where(function (s) { return s.Id != id })
             .ToArray();
        $scope.userDocuments = Enumerable
            .From($scope.userDocuments)
            .Where(function (s) { return s.Id != id })
            .ToArray();
        $scope.loadPaging("userDocuments");
        $http.get('Tasks.aspx?tp=74&id=' + id)
            .success(function (o) {
                if (o == "ok") {
                    //$scope.userDocumentsBac = Enumerable
                    //    .From($scope.userDocumentsBac)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.userDocuments = Enumerable
                    //    .From($scope.userDocuments)
                    //    .Where(function (s) { return s.Id != id })
                    //    .ToArray();
                    //$scope.loadPaging("userDocuments");
                    $scope.tempMessage(0, "מחיקה בוצע בהצלחה");
                } else {
                    $scope.tempMessage(1, "הפעולה לא הצליחה");
                }
            }).error(function (status) {
                $scope.tempMessage(1, "הפעולה לא הצליחה");
            });
    }

    // document filters
    $scope.filteredDocumentsObj = null;
    $scope.lastFilter = moment();
    $scope.filteredDocuments = function () {

        if (!$scope.isAllDataLoaded) return;
        var td = parseInt(moment().diff($scope.lastFilter, 'milliseconds'));
        if (td > 500 || $scope.filteredDocumentsObj == null || typeof ($scope.filteredDocumentsObj) == "undefined") {
            $scope.lastFilter = moment();
            if (!$scope.isDocFiltered() && !$scope.fromRangeChange) {
                $scope.filteredDocumentsObj = Enumerable.From($scope.userDocuments)
                            .Where(function (s) {
                                return s.CompanyID == $scope.search.docCompany;
                            }).ToArray();
            } else {
                $scope.filteredDocumentsObj = Enumerable.From($scope.userDocuments)
                            .Where(function (s) {
                                var docType = $scope.search.docType
                                return (($scope.search.docCat == 0 || ($scope.search.docCat == 1 && !s.IsDraft) || ($scope.search.docCat == 2 && s.IsDraft)) // cat
                                    //&& ($scope.search.docCompany == 0 || (s.CompanyID == $scope.search.docCompany))
                                    && (s.CompanyID == $scope.search.docCompany)
                                    && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                                    && (docType == 0 || (s.DocumentType == docType))
                                    && ($scope.inPeriod(s.Date))
                                    //&& ($scope.search.docIncCanceled || (s.DocumentType < 9 && (s.IsCanceled == null || !s.IsCanceled)));
                                //changed by #ortal&nofar#
                                    && ($scope.search.docIncCanceled || ((s.DocumentType < 9 || s.DocumentType > 10) && (s.IsCanceled == null || !s.IsCanceled)))
                                    && ($scope.search.docIncClosed || ((s.DocumentType < 9 || s.DocumentType > 10) && (s.isClosed == null || !s.isClosed))));
                                ///////////////////////////////////////////////////////////
                            }).ToArray();
                $scope.fromRangeChange = false;
                //$scope.loadPaging("userDocuments");
                //$scope.safeApply();
            }

        }
        //$scope.loadPaging("userDocuments");

        ////$scope.loadPaging("userDocuments");

        //Work around - this method is called multiple times for no reason, will reset the Orders fields before each iteration
        for (var i = 0 ; i < $scope.filteredDocumentsObj.length; i++)
            if ($scope.filteredDocumentsObj[i].Orders)
                $scope.filteredDocumentsObj[i].Orders=[];

        for (var i = 0; i < $scope.userDocuments.length; i++) {
            for (var j = 0; j < $scope.filteredDocumentsObj.length; j++) {
                if ($scope.userDocuments[i].ParentDocID != null && $scope.userDocuments[i].ParentDocID != undefined
                    && $scope.userDocuments[i].ParentDocID == $scope.filteredDocumentsObj[j].Id) {
                    if (!$scope.filteredDocumentsObj[j].Orders)
                        $scope.filteredDocumentsObj[j].Orders = [];
                    $scope.filteredDocumentsObj[j].Orders.push($scope.userDocuments[i])
                }
            }
        }



        return $scope.filteredDocumentsObj;
    }


    $scope.filteredDocumentsND = function () { // not drafts
        var ar = Enumerable.From($scope.filteredDocumentsObj).Where(function (s) { return !s.IsDraft }).ToArray();
        return ar.length;
    }

    $scope.filteredDocumentsNDU = function () { // not drafts & types 1,2,3,4
        var tps = [1, 2, 3, 4];
        var ar = Enumerable.From($scope.filteredDocumentsObj).Where(function (s) {
            return !s.IsDraft && tps.indexOf(s.DocumentType) > -1;
        }).ToArray();
        return ar.length;
    }


    $scope.filteredDocumentsByType = function (tp) {
       // console.log("filteredDocumentsByType TP", tp)
        //if (!$scope.isDocFiltered()) {
        //    return $scope.userDocuments.length;
        //} else {
        setTimeout(function () {
            var list = Enumerable.From($scope.userDocuments)
              .Where(function (s) {
                  return ($scope.search.docCat == 0 || ($scope.search.docCat == 1 && !s.IsDraft) || ($scope.search.docCat == 2 && s.IsDraft)) // cat
                      //&& ($scope.search.docCompany == 0 || (s.CompanyID == $scope.search.docCompany))
                      && (s.CompanyID == $scope.search.docCompany)
                      && ($scope.search.docCustomer == 0 || (s.CustomerID == $scope.search.docCustomer))
                      && (s.DocumentType == tp)
                      && ($scope.inPeriod(s.Date))
                  //&& ($scope.search.docIncCanceled || (s.DocumentType < 9 && (s.IsCanceled == null || !s.IsCanceled))); //changed by ortal&nofar
                  && ($scope.search.docIncCanceled || (s.DocumentType < 9 && s.DocumentType >= 11 && (s.IsCanceled == null || !s.IsCanceled)));
              }).ToArray();
            return list.length;
        }, 1000);

        // }
    }


    $scope.isFilteredExists = function (tp) {
        return $scope.filteredDocumentsByType(tp) > 0;
    }

    $scope.inPeriod = function (date) {
        //if (per == 0) {
        //    return true;
        //} else {
        var d = moment(date);
        //range = moment().range($scope.dateRange.from, $scope.dateRange.to);
        var toD = moment($scope.dateRange.to).add(1, 'days');
        range = moment().range($scope.dateRange.from, toD);


        return range.contains(d);
        //}
    }

    $scope.isStatusChangable = true;
    $scope.$watch('search', function (newVal, oldVal) {
        if (!$scope.isStatusChangable) return; // when this watch must be disabled
        if (newVal.docCompany != oldVal.docCompany || newVal.docCustomer != oldVal.docCustomer || newVal.docPeriod != oldVal.docPeriod) {
            $scope.recalculateChartData();
        }
        if (newVal.docCompany != oldVal.docCompany) {
            $scope.newDoc.Company = angular.copy(Enumerable.From($scope.userCompanies)
                .Where(function (x) { return x.Id == newVal.docCompany }).FirstOrDefault());
            $scope.selection.compId = newVal.docCompany;
            if ($scope.newDoc.Type > 8) {
                $scope.newDoc.Type = 1;
                $scope.resetNewDocument();
            }
        }
        // customers  
        if (newVal.docCustomer != oldVal.docCustomer) {
            $('#selCustomer1').selectpicker('val', newVal.docCustomer);
            $('#selCustomer3').selectpicker('val', newVal.docCustomer);
            $('#selCustomer4').selectpicker('val', newVal.docCustomer);
            var cid = parseInt(newVal.docCustomer);
            if (cid == 0) {
                $('#selCustomer2').selectpicker('deselectAll');
            } else {
                $('#selCustomer2').selectpicker('val', cid);
            }
            $scope.newDoc.Customer = angular.copy(Enumerable.From($scope.userCustomers)
               .Where(function (x) { return x.Id == cid }).FirstOrDefault());
            $scope.selectedCustomer = angular.copy($scope.newDoc.Customer);

        }
        // document type 
        if (newVal.docType != oldVal.docType) {
            $('#selType1').selectpicker('val', newVal.docType);
        }

        //if ((newVal.docCompany != oldVal.docCompany || newVal.docCustomer != oldVal.docCustomer
        //    || newVal.docType != oldVal.docType) && $scope.newDoc.Type > 8 && $scope.selectedPage != 11) //changed by ortal&nofar
        if ((newVal.docCompany != oldVal.docCompany || newVal.docCustomer != oldVal.docCustomer
              || newVal.docType != oldVal.docType) && $scope.newDoc.Type > 8
              && $scope.newDoc.Type != 11 && $scope.newDoc.Type != 12) {
            $scope.isStatusChangable = false;
            //$scope.resetNewDocument();
            $scope.newDoc.Type = 1;
            $scope.isStatusChangable = true;
        }

        // date ranges
        if (newVal.docPeriod != oldVal.docPeriod) {
            $('#selDateRanges').selectpicker('val', newVal.docPeriod);

        }

        /// temp       
        $scope.loadPaging("userDocuments");
    }, true);

    $scope.testItem = "";

    $scope.$watch('search.docCompany', function (newVal, oldVal) {
        LoadDocProducts();
        $scope.prepareCustomers();
    }, true);

    //$scope.$watch('search.docCustomer', function (newVal, oldVal) {
    //    $scope.recalculateChartData();
    //}, true);
    //$scope.$watch('search.docPeriod', function (newVal, oldVal) {
    //    $scope.recalculateChartData();
    //}, true);

    $scope.resetDocumentFilters = function () {
        $scope.searchBac.docCompany = $scope.search.docCompany;
        $scope.search = angular.copy($scope.searchBac);
        $scope.resetDateRange();
    }

    $scope.isDocFiltered = function () {
        var s = $scope.search;
        var b = $scope.searchBac;
        return s.docCat != b.docCat
            //|| s.docCompany != b.docCompany
            || s.docCustomer != b.docCustomer
            || s.docKey != b.docKey
            || s.docType != b.docType
            || s.docIncCanceled != b.docIncCanceled
            //changed by #ortal&&nofar#
            || s.docIncClosed != b.docIncClosed
            ///////
            || !$scope.isInitRange;
    }

    // for different documents
    $scope.in = function (ar) {
        return ar.indexOf($scope.newDoc.Type) > -1;
    }

    $scope.dtpIn = function (tp, ar) {
        return ar.indexOf(tp) > -1;
    }


    $scope.hidden = function (ar) {
        return ar.indexOf($scope.newDoc.Type) == -1;
    }



    $scope.tempDocBac = null;
    // if new doc is filled and save is allowed
    // it may be extended to addittional constrains
    // for example, user permissions
    $scope.isDocReady = function () {
        var isItem = true, isPay = true, isChanged = true;
        if ($scope.in([1, 2, 4, 5, 7, 8])) {
            isItem = $scope.hasSelectedItems();
        }
        if ($scope.in([2, 3, 6])) {
            isPay = $scope.docPayments.length > 0;
        }
        isChanged = JSON.stringify($scope.newDoc) != JSON.stringify($scope.tempDocBac);
        return isItem && isPay && (isChanged || $scope.newDoc.Id == 0);
    }

    $scope.isDocFilled = function () {
        var isItem = true, isPay = true;
        if ($scope.in([1, 2, 4, 5, 7, 8])) {
            isItem = $scope.hasSelectedItems();
        }
        if ($scope.in([2, 3, 6])) {
            isPay = $scope.docPayments.length > 0;
        }
        return isItem && isPay;
    }

    $scope.dueDate = function (p) {
        if (p.DocumentType != 3 && p.DocumentType != 6) {
            return p.DueDateV;
        } else {
            return "";
        }
    }

    $scope.hasLockedDoc = function () {
        var compId = ($scope.selectedCompany.Id == 0 || $scope.selectedCompany.Id == null)
           ? $scope.userCompanies[0].Id : $scope.selectedCompany.Id;
        var locked = Enumerable
              .From($scope.docConfig)
              .Where(function (x) { return x.CompanyID == compId && x.Last > 0 })
              .Count();
        return locked > 0;
    }

    $scope.getDocNumbersTb = function () {
        $http({
            method: 'GET',
            url: 'tasks.aspx?tp=502&nu=' + $scope.userCompanies[$scope.userCompanies.length - 1].Id
        }).then(function successCallback(recs) {
            //var recs = JSON.parse(rec);
            $.each(recs.data, function (i, rec) {
                $scope.docConfig.push(rec);
            })
            $scope.docConfigBac = angular.copy($scope.docConfig);
            //console.log($scope.docConfig);
        }, function errorCallback(response) {
            console.log("error request");
        });
    }

    $scope.cancelDoc = function (d) {
        if (d.DocumentType == 4) {
            $scope.newDoc.Type = 9;
        } else {
            $scope.newDoc.Type = 10;
        }
        $scope.loadSavedDocForEdit(d.Id, 1);
        $scope.showPage(11);
    }

    $scope.isReadyForSave = function () {
        if (!$scope.isDocFilled || !$scope.isDocReady || $scope.search.docCustomer == 0) {
            return false;
        } else {
            return true;
        }
    }


    $scope.getDocForH = function (d) {
        var json = JSON.stringify({
            tp: 207,
            id: d
        });
        $http({
            url: 'Tasks.aspx',
            method: "POST",
            data: json,
            headers: {
                'Content-type': 'application/json'
            }//,
        }).success(function (data, status, headers, config) {
            window.open(data);
        }).error(function (data, status, headers, config) {
            //upload failed
        });
    }


    $scope.getDocsZip = function () {
        var docs = Enumerable.From($scope.filteredDocumentsObj)
            .Where(function (s) { return !s.IsDraft })
            .Select("$.Id")
            .ToArray();
        var json = JSON.stringify({
            tp: 204,
            data: docs
        });
        $http({
            url: 'Tasks.aspx',
            method: "POST",
            data: json,
            headers: {
                'Content-type': 'application/json'
            }//,
            //responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            window.open(data);
            //var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            //var objectUrl = URL.createObjectURL(blob);
            //window.open(objectUrl);
        }).error(function (data, status, headers, config) {
            //upload failed
        });
    }

    $scope.getDocsU = function () {
        var tps = [1, 2, 3, 4];
        var docs = Enumerable.From($scope.filteredDocumentsObj)
            .Where(function (s) { return !s.IsDraft && tps.indexOf(s.DocumentType) > -1; })
            .Select("$.Id")
            .ToArray();
        var json = JSON.stringify({
            tp: 206,
            data: docs
        });
        $http({
            url: 'Tasks.aspx',
            method: "POST",
            data: json,
            headers: {
                'Content-type': 'application/json'
            }//,
            //responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            window.open(data);
            //var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            //var objectUrl = URL.createObjectURL(blob);
            //window.open(objectUrl);
        }).error(function (data, status, headers, config) {
            //upload failed
        });
    }


    $scope.getUniFormatDoc = function (dates) {
        var tps = [1, 2, 3, 4];
        //var docs = Enumerable.From($scope.filteredDocumentsObj)
        //    .Where(function (s) { return !s.IsDraft && tps.indexOf(s.DocumentType) > -1; })
        //    .Select("$.Id")
        //    .ToArray();
        var json = JSON.stringify({
            tp: 207,
            data: dates
        });
        $http({
            url: 'Tasks.aspx',
            method: "POST",
            data: json,
            headers: {
                'Content-type': 'application/json'
            }//,
            //responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            window.open(data);
            //var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            //var objectUrl = URL.createObjectURL(blob);
            //window.open(objectUrl);
        }).error(function (data, status, headers, config) {
            //upload failed
        });
    }
    ///////////changed #ortal&nofar# ////////////////////////////////
    //show open Doc lines
    $scope.DocListOpen = false;
    //$scope.DocListOpenShipping = false;

    $scope.openDocLines = function (object) {
        //function
        object.isClosed = !object.isClosed;
        //(id == 9 ? $scope.DocListOpenInvoice = !$scope.DocListOpenInvoice : $scope.DocListOpenShipping = !$scope.DocListOpenShipping)
    }
    // send by mail
    $scope.docToMail = {};
    $scope.getdocToMail = function (p) {
        $scope.docSentStatus = 0;
        $("#textBody").val("");
        $scope.docToMail = p;
        var catN = 1; // temp for cat numeration
        var cust = Enumerable.From($scope.userCustomersBac)
            .Where(function (x) { return x.Id == p.CustomerID }).FirstOrDefault();
        if (cust != null) $("#inputEmail").val(cust.CEmail);
    }

    $scope.docSendTo = "";
    $scope.docSendBody = "";
    $scope.docSentStatus = 0; //1 - ok, 2 - error, 0 - not sent yet
    $scope.sendDoc = function () {
        var json = JSON.stringify({
            tp: 205,
            data: {
                to: $("#inputEmail").val(),
                body: $("#textBody").val(),
                doc: $scope.docToMail.Id,
                subject: $scope.docToMail.DocumentN + ", " + "מס'" + " " + $scope.docToMail.DocumentNumber
            }
        });
        $http({
            url: 'Tasks.aspx',
            method: "POST",
            data: json,
            headers: {
                'Content-type': 'application/json'
            }//,
            //responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            //
            if (data == "ok") {
                $scope.docSentStatus = 1;
            } else {
                $scope.docSentStatus = 2;
            }
        }).error(function (data, status, headers, config) {
            //upload failed
            $scope.docSentStatus = 2;
        });
    }


    //$scope.firstDate = moment("2015-01-01");
    ////scope.lastDate = moment(); 
    $scope.datesRange = {
        create: "",

        finish: ""
    }; //


    $('#dateModal').on('show.bs.modal', function (event) {

        var modal = $(this);
        $('#dpCreate').datetimepicker({
            locale: 'he',
            defaultDate: moment("2015-01-01"),

            format: 'DD/MM/YYYY'
        });
        $("#dpCreate").on("dp.change", function (e) {
            $scope.datesRange.create = e.date;
            if ($scope.datesRange.create > $scope.datesRange.finish) {
                //  var d = element.find("#dpFinish");
                $("#dpCreate").data('DateTimePicker').date($scope.datesRange.create);
            }

        });
        $('#dpFinish').datetimepicker({
            locale: 'he',
            defaultDate: moment(),

            format: 'DD/MM/YYYY'
        });
        $("#dpFinish").on("dp.change", function (e) {
            $scope.datesRange.finish = e.date;
            if ($scope.datesRange.finish < $scope.datesRange.create) {
                //  var d = element.find("#dpCreate").first();
                $('#dpFinish').data('DateTimePicker').date($scope.datesRange.finish);
            }
        });

    })

    $scope.FinallizeDoc = function () // called right before sending the doc to the server
    {
        var test = $scope.userProducts;
        //if ($scope.newDoc.Type == 11) {
        if ($scope.newDoc.Type == 11 || $scope.newDoc.Type == 12) {
            $scope.newDoc.Date = moment();
            //$scope.newDoc.DueDate = "";
        }
    };

    $scope.PostDocCreationUpdates = function (doc) // called right after adding the doc to the server
    {
        $scope.addNewDocItems(doc);
    }



    //changed by #ortal&nofar#
    $scope.linesToSC = function (value, p) {

        if (!$scope.idsToShowSC)
            $scope.idsToShowSC = [];
        if (value) {
            $scope.idsToShowSC.push(p);
            p.isCheckd = true;
            $scope.idsToShowSC;
        }
        else {
            index = $scope.idsToShowSC.indexOf(p);
            if (index > -1) {
                $scope.idsToShowSC.splice(index, 1);
                p.isCheckd = false;
            }

        }
    };
    //changed by #ortal&nofar# //for index
    $scope.linesToSCSel = function () {
        if ($scope.idsToShowHC[$scope.newDoc.Type]) {
            ar = $scope.idsToShowHC[$scope.newDoc.Type];
            return ar.length;
        }

    };

    //changed by #ortal&nofar# //sending checked files to create invoice
    //$scope.sendToSC = function () {
    //    ar = $scope.idsToShowHC;
    //    $scope.showPage(11);
    //    $scope.setDocType(12);

    //};
    //changed by #ortal&nofar#
    $scope.linesToInvoice = function (value, p) {
        //$scope.idsToShowHC = $scope.idsToShowHC;
        if (!$scope.idsToShowHC)
            $scope.idsToShowHC = [];
        if (!$scope.idsToShowHC[$scope.newDoc.Type])
            $scope.idsToShowHC[$scope.newDoc.Type] = [];
        if (value) {
            $scope.idsToShowHC[$scope.newDoc.Type].push(p);
            p.isCheckd = true;
        }
        else {
            console.log("IN ELSE");
            index = $scope.idsToShowHC[$scope.newDoc.Type].indexOf(p);
            if (index > -1) {
                $scope.idsToShowHC[$scope.newDoc.Type].splice(index, 1);
                p.isCheckd = false;
            }

        }
    };
    //changed by #ortal&nofar# //for index
    $scope.linesToInvoiceSel = function () {
        if ($scope.idsToShowHC) {
            if ($scope.idsToShowHC[$scope.newDoc.Type]) {
                ar = $scope.idsToShowHC[$scope.newDoc.Type];
                return ar.length;
            }

        }

    };

    //changed by #ortal&nofar# //sending checked files to create invoice
    $scope.sendToInvoice = function () {
        ar = $scope.idsToShowHC[$scope.newDoc.Type];
        if ($scope.newDoc.Type == 11)
            $scope.showPage(12);
        else if ($scope.newDoc.Typen == 8)
              $scope.showPage(12);

        //$scope.setDocType(12);

    };

    //changed by #ortal&nofar#
    $scope.getSumOfShippingCertificates = function () {
        var total = 0;
        if (!$scope.idsToShowHC)
            return 0;
        else if (!$scope.idsToShowHC[$scope.newDoc.Type])
            return 0;
        for (var i = 0; i < $scope.idsToShowHC[$scope.newDoc.Type].length; i++) {
            total += $scope.idsToShowHC[$scope.newDoc.Type][i].Total;
        }
        return total;
    };


    $scope.getIdesToShow = function () {
        if ($scope.idsToShowHC)
            if ($scope.idsToShowHC[$scope.newDoc.Type])
                return $scope.idsToShowHC[$scope.newDoc.Type];
    };

}