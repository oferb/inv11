// login
function Login() {
    scope.loginError = false;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 1,
            mail: $("#userMail").val(),
            password: $("#userPassword").val()
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.loginError = true;
                scope.$apply();
            } else {
                location.href = "Index.aspx";
            }
        },
        error: function (d) {
            scope.loginError = true;
            scope.$apply();
        }
    });
}

// restore
function Restore() {
    scope.restSuccess = false;
    scope.restError = false;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 2,
            mail: $("#userMailR").val()
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.restError = true;
            } else {
                scope.restSuccess = true;
            }
            scope.$apply();
        },
        error: function (d) {
            scope.restError = true;
            scope.$apply();
        }
    });
}

// registration
function Register() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 3,
            // user data
            mail: $("#userMailN").val(),
            fname: $("#userFName").val(),
            lname: $("#userLName").val(),
            ident: $("#userIdent").val(),
            password: $("#userPasswordN").val(),
            // company
            Name: $("#cName").val(),
            City: $("#cCity").val(),
            Street: $("#cStreet").val(),
            Country: $("#cCountry").val(),
            Email: $("#cMail").val(),
            Phone: $("#cPhone").val(),
            Identificator: $("#cIdent").val()
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.regError = true;
                scope.$apply();
            } else {
                location.href = "Index.aspx";
            }
        },
        error: function (d) {
            scope.regError = true;
            scope.$apply();
        }
    });
}

// update user data
function UpdateUserData() {
    scope.resetMessages();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 5,
            mail: scope.userData.Email,
            fname: scope.userData.FName,
            lname: scope.userData.LName,
            //ident: scope.userData.Identificator,
            password: $("#inputPassword").val()
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1,'הסיסמא אינו נכונה');
                scope.userData = angular.copy(scope.userDataBac);
            } else {
                scope.tempMessage(0,'עידכון בוצע בהצלחה');
                scope.userDataBac = angular.copy(scope.userData);
            }
        },
        error: function (d) {
            scope.tempMessage(1,'הסיסמא אינו נכונה');
            scope.userData = angular.copy(scope.userDataBac);
        },
        complete: function (d) {
            scope.$apply();
        }
    });
}

function ChangePassword() {
    scope.resetMessages();  
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 6,
            mail: scope.userData.Email,
            password: $("#inputPasswordC").val(),
            newpassword: $("#inputPasswordNew").val()
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1,"הסיסמא אינו נכונה");
                scope.userData = angular.copy(scope.userDataBac);
            } else {
                scope.tempMessage(0,"עידכון בוצע בהצלחה");
                scope.userDataBac = angular.copy(scope.userData);
            }
        },
        error: function (d) {
            scope.tempMessage(1,"הסיסמא אינו נכונה");
            scope.userData = angular.copy(scope.userDataBac);
        },
        complete: function (d) {
            scope.$apply();
        }
    });
}

// update selected/add new company data
function UpdateCompanyData() {
    scope.selectedCompany["uid"] = scope.userData.Id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 8,
            data: scope.selectedCompany
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
                scope.userCompanies = angular.copy(scope.userCompaniesBac);
            } else { // new company
                var prevN = scope.userCompaniesBac.length;
                if (scope.selectedCompany.Id == 0) {
                    scope.selectedCompany.Id = parseInt(d);
                    scope.userCompaniesBac.push(angular.copy(scope.selectedCompany));
                    scope.userCompanies = angular.copy(scope.userCompaniesBac);
                    scope.selection.compId = scope.selectedCompany.Id; //null;

                    scope.getDocNumbersTb();

                    //var prevState = scope.user.newUserState;
                    //scope.calcNewUserState();
                    //if (prevState != scope.user.newUserState) {
                    //    scope.showPage(101);
                    //}
                    // reload reports
                    scope.reportData = scope.loadReportData();

                    // 
                    if (scope.userCompanies.length == 1) {
                        scope.selectedCompany = scope.userCompanies[0];
                        scope.search.docCompany = scope.selectedCompany.Id;
                    }

                    scope.tempMessage(0, "הוספת העסק בוצעה בהצלחה");
                } else {
                    scope.userCompaniesBac = angular.copy(scope.userCompanies);
                    scope.tempMessage(0, "עידכון בוצע בהצלחה");
                }
                if (prevN == 0) scope.search.docCompany = scope.userCompanies[0].Id;
            }
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
            scope.userCompanies = angular.copy(scope.userCompaniesBac);
        },
        complete: function (d) {
            scope.$apply();
        }
    });
}

// update selected/add new customer data
function UpdateCustomerData() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 9,
            data: scope.selectedCustomer,
            cid: scope.selectedCompany.Id
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
                scope.userCustomers = angular.copy(scope.userCustomersBac);
            } else {
                if (scope.selectedCustomer.Id == 0) { // new

                    var c = angular.copy(scope.selectedCustomer);
                    scope.selectedCustomer.Id = parseInt(d);
                    c.Id = parseInt(d);
                    scope.userCustomersBac.push(c);
                    scope.userCustomers.push(c);

                    //var prevState = scope.user.newUserState;
                    //scope.calcNewUserState();
                    //if (prevState != scope.user.newUserState) {
                    //    scope.showPage(101);
                    //}
                    scope.selection.custId = null;
                    // reload reports
                    scope.reportData = scope.loadReportData();

                    var rel = {
                        Id: 0,
                        CompanyID: scope.selectedCompany.Id,
                        CustomerID: scope.selectedCustomer.Id
                    }
                    scope.userCompanyCustomer.push(rel);

                    //if (scope.retToNewDoc) {
                    //    scope.showPage(11);
                    //    scope.retToNewDoc = false;
                    //} else {
                    scope.search.docCompany = scope.selectedCompany.Id;
                    scope.resetNewDocument();
                    scope.filterCustomers();
                        scope.tempMessage(0, "הוספת העסק בוצעה בהצלחה");
                    //}
                } else {
                    scope.userCustomersBac = angular.copy(scope.userCustomers);
                    scope.tempMessage(0, "עידכון בוצע בהצלחה");
                    scope.filterCustomers();
                }
            }
            ReloadCustomersAuto();

            $('#f431 .nav-tabs li:first a').tab('show');
            scope.isCustSelectedTab = 0;
            scope.selectedCustomer = angular.copy(custTemplate);
            scope.selectedCustomer.Id = null;
            
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
            scope.userCustomers = angular.copy(scope.userCustomersBac);
        },
        complete: function (d) {
            scope.$apply();
        }
    });
}

// update selected/add new product data
function UpdateItemData() {
    scope.selectedItem.CompanyID = scope.search.docCompany;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 11,
            data: scope.selectedItem
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
                scope.userProducts = angular.copy(scope.userProductsBac);
            } else {
                if (scope.selectedItem.Id == 0) { // new
                    //scope.selectedItem.Id = parseInt(d);
                    //scope.selection.itemId = parseInt(d);
                    //scope.selectedItem.Amount = 1;
                    var newPr = angular.copy(scope.selectedItem);
                    newPr.Id = parseInt(d);
                    scope.userProductsBac.push(newPr);
                    scope.userProducts = angular.copy(scope.userProductsBac);
                    scope.resetErrorItemForms();  

                    //scope.showPage(101);
                    //var prevState = scope.user.newUserState;
                    //scope.calcNewUserState();
                    //if (prevState != scope.user.newUserState) {
                    //    scope.showPage(101);
                    //}

                    //if (selectedPage == 44) {
                    //    scope.tempMessage(0, "הוספת פריט בוצעה בהצלחה");
                    //}
                    scope.tempMessage(0, "הוספת פריט בוצעה בהצלחה");
                    scope.loadPaging("userProducts");
                } else {
                    scope.userProductsBac = angular.copy(scope.userProducts);
                    scope.tempMessage(0, "עידכון בוצע בהצלחה");
                }
                LoadDocProducts();

                $('#f441 .nav-tabs li:first a').tab('show');
                scope.isItemSelectedTab = 0;
                scope.selectedItem = angular.copy(itemTemplate);
                scope.selectedItem.Id = null;
                //selectedPage = 44;
            }
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
            scope.userProducts = angular.copy(scope.userProductsBac);
        },
        complete: function (d) {
            scope.$apply();
            
        }
    });
}

function UpdateDocConfig() {
    var conf = Enumerable.From(scope.docConfig).Where(function (x) { return x.CompanyID == scope.search.docCompany }).ToArray();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify({
            tp: 12,
            data: conf
        }),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
            } else {
                scope.docConfigBac = angular.copy(scope.docConfig);                
                var comp = Enumerable.From(scope.userCompanies).Where(function (x) { return x.Id == scope.search.docCompany }).FirstOrDefault();
                comp.IsLocked = true;
                var bac = Enumerable.From(scope.userCompaniesBac).Where(function (x) { return x.Id == scope.search.docCompany }).FirstOrDefault();
                bac.IsLocked = true;
                scope.newDoc.Company.IsLocked = true;
                if (scope.retToNewDoc) {
                    scope.showPage(11);
                    scope.retToNewDoc = false;
                } else {
                    scope.tempMessage(0, "עידכון בוצע בהצלחה");
                }

                //var prevState = scope.user.newUserState;
                //scope.calcNewUserState();
                //if (prevState != scope.user.newUserState) {
                //    scope.showPage(101);
                //} else {
                //    scope.tempMessage(0, "עידכון בוצע בהצלחה");
                //}
            }
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
        },
        complete: function (d) {
            scope.$apply();
        }
    });
}

Date.prototype.toJSON = function () { return moment(this).format(); }
//changed by ortal&nofar
function SaveDocument() {
    scope.FinallizeDoc();
    scope.newDoc.Paid.Total = scope.calcPaymentsTotal();
    var dt = {
        tp: 201,
        data: scope.newDoc,
        items: Enumerable.From(scope.userProducts).Where(function (s) { return s.Selected }).ToArray(),
        payments: scope.docPayments,
        documents: scope.idsToShowHC[scope.newDoc.Type],
        calc: scope.calcObject()
    };
    var initId = scope.newDoc.Id;
    console.log(dt);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify(dt),
        cache: false,
        success: function (d) {
            if (d == "error" || d == "") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
                console.log("error");
                console.log(d);
            } else {
                var doc = JSON.parse(d);
                scope.addSavedUserDoc(doc, initId);
                scope.PostDocCreationUpdates(doc);
                
                // go to doc table
                scope.selectedPage = 21;
                // reload reports
                scope.reportData = scope.loadReportData();

                // reset new doc form
                scope.resetNewDocument();

                //scope.checkUserItems();  // ALEX - dont add new products
                scope.tempMessage(0, "המסמך נשמר בהצלחה");
            }
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
            console.log("error");
            console.log(d);
        },
        complete: function (d) {
            scope.resetNewDocument();
            scope.$apply();
        }
    });
}
//changed by ortal&nofar
function SaveAsPdf() {
    scope.FinallizeDoc();
    scope.newDoc.CreationDate = moment().format();
    var dt = {
        tp: 202,
        data: scope.newDoc,
        items: Enumerable.From(scope.userProducts).Where(function (s) { return s.Selected }).ToArray(),
        payments: scope.docPayments,
        documents: scope.idsToShowHC[scope.newDoc.Type],
        calc: scope.calcObject()
    };
    if (scope.cancelID != null) {
        dt.data["CancelID"] = scope.cancelID;
        dt.data["CancelMsg"] = scope.CancelMsg;
    }
    var initId = scope.newDoc.Id;
    //console.log(dt);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Tasks.aspx",
        data: JSON.stringify(dt),
        cache: false,
        success: function (d) {
            if (d == "error") {
                scope.tempMessage(1, "הפעולה לא הצליחה");
                console.log("error");
                console.log(d);
            } else {
                var doc = JSON.parse(d);
                scope.addSavedUserDoc(doc, initId);
                scope.PostDocCreationUpdates(doc);
                scope.selectedPage = 21;
                //if (!scope.dtpIn(scope.newDoc.Type, [5, 7, 8])) {
                //    scope.resetNewDocument();
                //};
                scope.recalculateChartData();
                // reload reports
                scope.reportData = scope.loadReportData();

                // reset new doc form
                scope.resetNewDocument();

                $("#ifPDF").attr("src", "pdf1.aspx?id=" + doc.Id);
                scope.tempMessage(0, "המסמך נשמר והונפק בהצלחה");
                alert("המסמך נשמר והונפק בהצלחה!");
                location.reload();
                
            }
        },
        error: function (d) {
            scope.tempMessage(1, "הפעולה לא הצליחה");
            console.log("error");
            console.log(d);
        },
        complete: function (d) {
            scope.resetNewDocument();
            scope.$apply();
        }
    });
}


//$("a").click(function (event) {
//    var link = $(this);
//    var target = link.attr("target");

//    if ($.trim(target).length > 0) {
//        window.open(link.attr("href"), target);
//    }
//    else {
//        window.location = link.attr("href");
//    }
//    event.preventDefault();
//});

function UpdatePayData() {
    //
    if (scope.payForUpdate>-1) {
        scope.docPayments[scope.payForUpdate] = angular.copy(scope.selectedPayment);
    } else {
        var p = angular.copy(scope.selectedPayment);
        scope.docPayments.push(p);
    }
    scope.payForUpdate = -1;
    scope.showPage(11);
    scope.safeApply();
}