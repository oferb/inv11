<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>

<!DOCTYPE html>

<html lang="he" dir="rtl">
<head>
    <meta charset="utf-8" />
    <%--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />--%>
    <%--<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">--%>
    <%--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> --%>
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height" />
    <%--target-densitydpi=device-dpi --%>
    <title>מערכת חשבוניות וקבלות</title>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-rtl.css" rel="stylesheet" />
    <link href="Content/metro-icons.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-select.css" rel="stylesheet" />
    <link href="Content/custom.min.css" rel="stylesheet" />
    <link href="Content/tooltipster.css" rel="stylesheet" />
    <link href="Content/tooltipster-shadow.css" rel="stylesheet" />
    <link href="Content/site.css" rel="stylesheet" />
    <link href="Content/resolutions.css?v=2" rel="stylesheet" />
    <link href="Content/correct.css" rel="stylesheet" />
    <link href="Content/font-awesome.min.css" rel="stylesheet" />


    <script src="Scripts/Packages/modernizr-2.6.2.js"></script>
    <script src="Scripts/Packages/jquery-2.0.0.min.js"></script>
    <script src="Scripts/Packages/linq.min.js"></script>
    <script src="Scripts/Packages/moment-with-locales.min.js"></script>
    <script src="Scripts/Packages/moment-range.min.js"></script>
    <script src="Scripts/Packages/angular.min.js"></script>
    <script src="Scripts/Packages/angular-sanitize.min.js"></script>
    <script src="Scripts/Packages/bootstrap.min.js"></script>
    <script src="Scripts/Packages/bootstrap-modal-popover.js"></script>
    <script src="Scripts/Packages/metro.min.js"></script>
    <script src="Scripts/Packages/angular-messages.min.js"></script>
    <script src="Scripts/Packages/angular-bootstrap-confirm.min.js"></script>
    <script src="Scripts/Packages/ui-bootstrap-tpls.min.js"></script>
    <<script src="Scripts/Packages/bootstrap-datetimepicker.min.js"></script>
    <script src="Scripts/Packages/jquery.filepicker.js"></script>
    <script src="Scripts/Packages/bootstrap-select.js"></script>
    <script src="Scripts/Packages/angular-bootstrap-select.min.js"></script>
    <script src="Scripts/Packages/highstock.min.js"></script>
    <script src="Scripts/Packages/no-data-to-display.js"></script>
    <script src="Scripts/Packages/jquery.validate.min.js"></script>
    <script src="Scripts/Packages/messages.he.min.js"></script>
    <script src="Scripts/Packages/jquery.tooltipster.min.js"></script>
    <script src="Scripts/Packages/angular-tooltipster.js"></script>
    <script src="Scripts/Packages/ng-csv.js"></script>

    <script src="Scripts/Js/tasks.js"></script>
    <script src="Scripts/Js/events.js"></script>
    <script src="Scripts/Js/objects.js"></script>
    <script src="Scripts/Js/utils.js"></script>
    <script src="Scripts/Js/pages.js"></script>
    <script src="Scripts/Js/charts.js"></script>

    <script src="Scripts/Controllers/controller.js?v=2"></script>
    <script src="Scripts/Controllers/controller.company.js"></script>
    <script src="Scripts/Controllers/controller.user.js"></script>
    <script src="Scripts/Controllers/controller.customer.js"></script>
    <script src="Scripts/Controllers/controller.product.js"></script>
    <script src="Scripts/Controllers/controller.document.js?v=2"></script>
    <script src="Scripts/Controllers/controller.paging.js?v=2"></script>
    <script src="Scripts/Controllers/controller.payments.js"></script>
    <script src="Scripts/Controllers/controller.chart.js"></script>
    <script src="Scripts/Controllers/controller.rangepicker.js?v=2"></script>
    <script src="Scripts/Controllers/controller.report.js"></script>

    <style type="text/css">
        [ng\:cloak], [ng-cloak], .ng-cloak {
            display: none !important;
        }
    </style>
</head>
<body data-ng-controller="myController as parent" data-ng-app="myApp">
    <nav class="navbar navbar-default navbar-fixed-top" id="spNav">
        <div style="background-color: white; height: 22px;">
            <div class="inv-top-links">
                <div class="pull-left inv-lg"><a href="index.aspx?tp=logout">יציא</a></div>

                <div class="pull-left inv-lg">
                    <span>מערכת לניהול מסמכים, </span>
                    <span>גרסת פיתוח</span>
                    <span class="label label-default" style="margin-left: 10px; padding: 1px 4px">1.0</span>

                    <span data-ng-repeat="p in pages | filter: {cat: 'common', id: '!101'} track by $index">
                        <span data-ng-show="$index>0">&nbsp;</span>
                        <a href="#" data-ng-click="showPage(p.id,$event)">{{p.link}}</a>
                    </span>
                    <span>&nbsp;&nbsp;</span>
                </div>
                <div class="pull-right loaded" id="welcome">
                    שלום <a href="#" data-ng-click="showPage(41,$event)">{{userData.FName}} {{userData.LName}}</a> !
                </div>
                <script>
                    var isAdmin = false;
                </script>

                <div class="pull-right inv-lg-r"><a href="index.aspx?tp=logout">יציא</a></div>
            </div>
        </div>
        <div class="container-fluid container">
            <div class="navbar-header">
                <button type="button" id="nar-menu" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#" data-ng-click="showPage(101,$event)">חשבונית<span>&#64;</span><b>פלוס</b></a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right loaded">
                    <%--<li class="w-narrow"><a href="#" data-ng-click="showPage(101,$event)">דף הבית</a></li>--%>
                    <li class="w-narrow">
                        <a href="#" data-ng-click="showPage(11,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==11 ? '#178acc': 'inherit'}">הפקת מסמך חדש</a>
                    </li>
                    <li class="w-narrow">
                        <a href="#" data-ng-click="showPage(21,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==21 ? '#178acc': 'inherit'}">מסמכים</a>
                    </li>
                    <li class="w-narrow" data-ng-repeat="c in categories" data-ng-if="c.cat!='common' && c.cat!='hidden' && c.id!=1 && c.id!=2"><a href="#" data-ng-click="showPage(c.id,$event)">{{c.cat}}</a></li>
                    <li class="w-wide">
                        <a href="#" data-ng-click="showPage(101,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==101 ? '#178acc': 'inherit'}">דף הבית</a>
                    </li>
                    <li class="w-wide">
                        <a href="#" data-ng-click="showPage(11,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==11 ? '#178acc': 'inherit'}">הפקת מסמך חדש</a>
                    </li>

                    <li class="w-wide">
                        <a href="#" data-ng-click="showPage(21,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==21 ? '#178acc': 'inherit'}">מסמכים</a>
                    </li>
                    <li class="w-wide">
                        <a href="#" data-ng-click="showPage(62,$event);" class="new-doc-a"
                            data-ng-style="{'background-color': selectedPage==62 ? '#178acc': 'inherit'}">לקוחות</a>
                    </li>
                    <li class="dropdown w-wide" data-ng-repeat="c in categories"
                        data-ng-if="c.cat!='common' && c.cat!='hidden' && c.id!=1 && c.id!=2">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-ng-click="showPage(c.id,$event);"
                            data-ng-style="{'background-color': isSelectedCategory(c.id) ? '#178acc': 'inherit'}">{{c.cat}}<b class="caret"></b></a>
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li data-ng-repeat="p in pages | filter:{ cat: c.cat }" data-ng-if="p.cat!='common'">
                                <a href="#" data-ng-click="showPage(p.id,$event)">{{p.title}}</a></li>
                        </ul>
                    </li>
                </ul>

                <div class="btn-group pull-left loaded" style="margin-top: 6px;" data-ng-show="isAllDataLoaded && userCompanies.length>0">
                    <a href="#" class="btn btn-success" style="font-weight: bold">{{getShortStr(newDoc.Company.Name,60)}}</a>
                    <a href="#" class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li data-ng-repeat="comp in userCompanies"><a href="#"
                            data-ng-click="search.docCompany=comp.Id;resetNewDocument()">{{getShortStr(comp.Name,60)}}</a></li>
                    </ul>
                </div>
            </div>
            <!-- /.navbar-collapse selection.compId newDoc.Company -->
        </div>
        <!-- /.container-fluid -->
    </nav>

    <div class="container body-content loaded" style="display: none" id="divBody">

        <div class="row">
            <div class="top-element-st" style="min-width: 1140px"
                data-ng-class="{true: 'col-md-offset-2'}[dicPages[selectedPage].id<100 && selectedPage!=11 && selectedPage!=21 && selectedPage!=62]">

                <div class="col-xs-6" style="margin-top: 10px;">
                    <h2 style="margin-bottom: 0px;" data-ng-class="{'h-full':dicPages[selectedPage].id>=100 || selectedPage==11 || selectedPage==21}">
                        <span data-ng-show="selectedPage!=11">{{dicPages[selectedPage].title}}</span>
                        <span data-ng-show="selectedPage==11" data-ng-bind="getDocTitle(newDoc.Type)"></span>
                    </h2>

                </div>
                <div class="col-xs-4 col-xs-offset-2" style="padding-left: 8px; margin-top: 13px; height: 53px"
                    data-ng-show="(gErrorMsg!=''|| gSuccessMsg!='') && selectedPage!=11">
                    <div class="alert alert-dismissible" data-ng-class="{'alert-danger':gErrorMsg!='','alert-success':gSuccessMsg!=''}">
                        <button type="button" class="close" data-ng-click="resetMessages()">x</button>
                        {{gErrorMsg}}{{gSuccessMsg}}
                    </div>
                </div>
                <div class="col-xs-5 col-md-offset-1" style="text-align: left; margin-top: 52px;" data-ng-show="(selectedPage==101 || selectedPage==21) && gErrorMsg==''&& gSuccessMsg==''">
                   <!--changed by #ortal&nofar#-->
                    <a href="#" style="display:inline-block;margin-left:20px" data-ng-show="linesToInvoiceSel()>0" data-ng-click="sendToInvoice()">
                        <span class="glyphicon glyphicon-export" style="display:inline-block;margin-left:5px" 
                            title="{{linesToInvoiceSel()}} מסמכים"></span>צור חשבונית מס מרוכזת
                    </a>
                    <!---->
                    <a href="#" style="display: inline-block; margin-left: 20px" data-ng-show="filteredDocumentsND()>0" data-ng-click="getDocsZip()">
                        <span class="glyphicon glyphicon-save-file" style="display: inline-block; margin-left: 5px"
                            title="{{filteredDocumentsND()}} מסמכים"></span>הורדה בקובץ ZIP
                    </a>

                    <a href="#" style="display: inline-block; margin-left: 20px" data-ng-show="filteredDocumentsNDU()>0" data-ng-click="getDocsU()">
                        <span class="glyphicon glyphicon-save-file" style="display: inline-block; margin-left: 5px"
                            title="{{filteredDocumentsNDU()}} מסמכים מסוג חשבונית, קבלה ,חשבונית-קבלה וחשבונית זיכוי"></span>יצוא לחשבשבת ZIP
                    </a>

                    <a href="#" style="display: inline-block; margin-left: 20px" data-toggle="modal" data-target="#dateModal" data-ng-show="filteredDocumentsNDU()>0 && search.docCustomer==0&& search.docType == 0 "  >
                        <span class="glyphicon glyphicon-save-file" style="display: inline-block; margin-left: 5px"
                            title="{{filteredDocumentsNDU()}} מסמכים מסוג חשבונית, קבלה ,חשבונית-קבלה וחשבונית זיכוי"></span>יצוא במבנה אחיד
                    </a>
                    <span>סה'כ:</span><span class="label label-info" style="margin-left: 5px; margin-right: 5px;">{{filteredDocumentsObj.length}}</span><span>מסמכים</span>
                </div>

                <div class="col-xs-6" data-ng-show="selectedPage==11" id="docTypeList">
                    <ul class="nav nav-pills" style="margin-right: 10px; margin-top: 30px">
                        <li data-ng-click="setDocType(1)" data-ng-class="{'active':newDoc.Type==1}"><a href="#">חשבונית מס</a></li>
                        <li data-ng-click="setDocType(2)" data-ng-class="{'active':newDoc.Type==2}"><a href="#">חשבונית מס קבלה</a></li>
                        <li data-ng-click="setDocType(3)" data-ng-class="{'active':newDoc.Type==3}"><a href="#">קבלה</a></li>
                        <li data-ng-click="setDocType(5)" data-ng-class="{'active':newDoc.Type==5}"><a href="#">חשבונית עיסקה</a></li>
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">יותר <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li data-ng-click="setDocType(4)" data-ng-class="{'active':newDoc.Type==4}"><a href="#">חשבונית זיכוי</a></li>
                                <li data-ng-click="setDocType(6)" data-ng-class="{'active':newDoc.Type==6}"><a href="#">תעודת חיוב</a></li>
                                <li data-ng-click="setDocType(7)" data-ng-class="{'active':newDoc.Type==7}"><a href="#">הצעת מחיר</a></li>
                                <li data-ng-click="setDocType(8)" data-ng-class="{'active':newDoc.Type==8}"><a href="#">הזמנה</a></li>
                                <!-- changed by #ortal&nofar# -->
                                <li data-ng-click="setDocType(12)" data-ng-class="{'active':newDoc.Type==12}"><a href="#">חשבונית מס מרוכזת</a></li>
                                <%------------------------------%>
                                <li data-ng-click="setDocType(11)" data-ng-class="{'active':newDoc.Type==11}"><a href="#">תעודת משלוח</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <%-- class="table-responsive"--%>
            <table class="table" style="margin-bottom: 0px">
                <tr data-ng-show="selectedPage==101 || selectedPage==21">
                    <td style="border-top: none; padding-bottom: 0px; padding-top: 5px">
                        <div class="row tm-panel well inv-top-links" style="height: 47px; padding-right: 15px; min-width: 1140px">
                            <table style="min-width: 1115px">
                                <tr>
                                    <td style="width: 13%">
                                        <ul class="nav nav-pills nav-pills-sm">
                                            <li data-ng-class="{'active':search.docCat==0}" data-ng-click="search.docCat=0"><a href="#">הכל</a></li>
                                            <li data-ng-class="{'active':search.docCat==1}" data-ng-click="search.docCat=1"><a href="#">מסמכים</a></li>
                                            <li data-ng-class="{'active':search.docCat==2}" data-ng-click="search.docCat=2"><a href="#">טיוטות</a></li>
                                        </ul>
                                    </td>
                                    <td style="width: 37%">
                                        <div vdaterange class="sm-datetange"></div>
                                    </td>
                                    <td style="width: 16%">
                                        <select id="selCustomer1" class="selectpicker" data-style="btn-primary btn-sm"
                                            data-live-search="true" data-selected-text-format="count">
                                            <option value="0" title="כל הלקוחות" selected="selected">כל הלקוחות</option>
                                        </select>
                                    </td>
                                    <td style="width: 14%">
                                        <select id="selType1" class="selectpicker" data-style="btn-primary btn-sm" data-selected-text-format="count">
                                            <option value="0" title="כל סוגי המסמכים" selected="selected">כל סוגי המסמכים</option>
                                        </select>
                                    </td>
                                    <td style="width: 8%">&nbsp;
                                        <a href="#" data-ng-click="search.docIncCanceled=!search.docIncCanceled"><span class="glyphicon" 
                                            data-ng-class="{'glyphicon-check':search.docIncCanceled,'glyphicon-unchecked':!search.docIncCanceled}""></span>
                                            <label style="align-self:center">
                                                
                                                        כולל 
                                                <br />ביטולים 
                                                
                                            </label>
                                        </a>
                                        </td>
                                        <td style="width: 8%">&nbsp;
                                        <%--changed by ortal&nofar--%>
                                        <a href="#" data-ng-if="search.docType==8 || search.docType==11 || search.docType==12" 
                                            data-ng-click="search.docIncClosed=!search.docIncClosed"><span class="glyphicon" 
                                            data-ng-class="{'glyphicon-check':search.docIncClosed,'glyphicon-unchecked':!search.docIncClosed}"></span>
                                            <label>
                                                        כולל 
                                                <br />סגורים
                                                
                                            </label>
                                        </a>
                                        <%--end--%>
                                    </td>
                                    <td style="width: 4%">
                                        <a href="#" class="pull-left" data-ng-click="resetDocumentFilters()" data-ng-show="isDocFiltered()">
                                            <span class="mif-cancel mif-2x" title="בטל סינון" style="vertical-align: middle"></span>
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </div>

                    </td>
                </tr>
                <tr>
                    <td class="col-xs-2" style="border-top: none" data-ng-show="dicPages[selectedPage].cat!='common' && selectedPage!=11 && selectedPage!=21 &&  selectedPage!=62">
                        <div data-ng-if="dicPages[selectedPage].id<100" id="divRightMenu">
                            <ul class="nav nav-pills nav-stacked no-print">
                                <li data-ng-repeat="p in pages | filter:{ cat: dicPages[selectedPage].cat }" data-ng-if="p.id<100">
                                    <a href="#" data-ng-click="showPage(p.id,$event)" class="list-group-item"
                                        data-ng-style="{'background-color': p.id==selectedPage ? '#eeeeee' : 'inherited'}">{{p.title}}</a>
                                </li>
                            </ul>
                        </div>
                    </td>
                    <td data-ng-class="{'col-xs-10':dicPages[selectedPage].cat!='common' && selectedPage!=11  && selectedPage!=21  && selectedPage!=62}" style="border-top: none;">
                        <div style="width: 100%; min-height: 580px">
                            <div data-ng-show="selectedPage>=30 && selectedPage<=40" data-ng-include="'Templates/rep.filters.htm'"></div>
                            <div data-ng-repeat="p in pages" data-ng-include="'Inc/' + (p.inc=='' ? p.id : p.inc) + '.htm'"
                                data-ng-if="p.id == selectedPage || p.id == 101 || p.id == 11" data-ng-show="p.id == selectedPage" onload="loadPageEvents()" style="padding-left: 0px;">
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="row" id="divWait" style="width: 200px; margin: 200px auto">
        <h3 style="text-align: center">טעינת הנתונים</h3>
        <div class="progress progress-striped active">
            <div class="progress-bar" style="width: 100%"></div>
        </div>
    </div>
    <button onclick="AdminTask()" style="display: none;">temp</button>
    <%--<div style="width: 200px; margin: 200px auto">{{dateRange.from}}</div>
    <div style="width: 200px; margin: 200px auto">{{filteredDocuments().length}}</div>
    --%>
    <script>
        function testAdd(n) {
            var str = "000000";
            alert(str.addNumber(n));
        }
    </script>
    <div class="modal fade" id="dateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title">הפקת קובץ במבנה אחיד</h4>
                </div>
                <div class="modal-body">
                    <div class="container-fluid bd-example-row">
                        <div class="row"><label class="col-xs-12 control-label">בחר תאריכים</label></div>
                    
                  <div class="row">
                       <label class="col-xs-2 control-label">תאריך יצירה</label>
                        <div class='col-xs-4'>
                            <div class='input-group date ' id="dpCreate">
                                <input type='text' id="create" class="form-control input-sm" />
                                <span class="input-group-btn">
                                    <span class="input-group-addon input-sm">
                                        <span class="glyphicon glyphicon-calendar span-sm"></span>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <label class="col-xs-2 control-label">תאריך עד</label>
                        <div class='col-xs-4'>
                            <div class='input-group date ' id="dpFinish">
                                <input type='text' id="finish" class="form-control input-sm" />
                                <span class="input-group-btn">
                                    <span class="input-group-addon input-sm">
                                        <span class="glyphicon glyphicon-calendar span-sm"></span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    
                  </div>
                       
                </div>
            </div>
            <div class="modal-footer">
                 <button type="button" class="btn btn-primary" data-ng-click="getUniFormatDoc(datesRange)">צור קובץ</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">סגור</button>
               
            </div>
         </div>
        
        </div>
      </div>
    
   
    <div class="container loaded" style="display: none" id="divFooter">
        <hr />
        <footer style="margin: 0px">
            <p style="text-align: center">
                <span data-ng-repeat="p in pages | filter: {cat: 'common'} track by $index">
                    <span data-ng-show="$index>0">&nbsp;|&nbsp;</span>
                    <a href="#" data-ng-click="showPage(p.id,$event)">{{p.link}}</a>
                </span>
            </p>
            <p style="text-align: center">פיתוח ותחזוקה - וירטק סופטוור בע"מ</p>
        </footer>
    </div>
    <textarea id="tempArea" style="display: none"></textarea>
    <button onclick="test()" style="display: none">test</button>
    <iframe id="ifPDF" name="ifPDF" style="display: none"></iframe>


    <script>
        var pingInterval;
        var pingIntValue = 60000;

        Tracer.Enabled = false;
        Tracer.Log("started");

        $(document).ready(function () {

            Tracer.Log("document ready");

            scope.loadData();
            //
            pingInterval = setInterval(function () {
                $.ajax({
                    type: 'GET',
                    url: 'Tasks.aspx?tp=0',
                    success: function (d) {
                        if (d != 'ok') {
                            console.log('error ping');
                        }
                    }
                });
            }, pingIntValue);


            // load date selects


        

        })

    </script>

</body>
</html>
