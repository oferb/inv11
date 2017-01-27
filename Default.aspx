<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html lang="he" dir="rtl">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>מערכת חשבוניות וקבלות</title>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-rtl.css" rel="stylesheet" />
    <link href="Content/custom.min.css" rel="stylesheet" />
    <link href="Content/site.css" rel="stylesheet" />
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <script src="Scripts/Packages/modernizr-2.6.2.js"></script>
    <script src="Scripts/Packages/jquery-2.0.0.min.js"></script>
    <script src="Scripts/Packages/angular.min.js"></script>
    <script src="Scripts/Packages/bootstrap.min.js"></script>
    <script src="Scripts/Packages/linq.min.js"></script>
    <script src="Scripts/Packages/jquery.validate.min.js"></script>
    <script src="Scripts/Packages/messages.he.min.js"></script>
    <script src="Scripts/Packages/angular-messages.min.js"></script>
    <script src="Scripts/Js/Pages.js"></script>
    <script src="Scripts/Js/tasks.js"></script>
     <script src="Scripts/Js/utils.js"></script>
    <style type="text/css">
     [ng\:cloak], [ng-cloak], .ng-cloak {
          display: none !important;
        }
    </style>
</head>
<body data-ng-controller="myController" data-ng-app="myApp">
    <form runat="server" id="frmMain"></form>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" 
                            data-target="#bs-example-navbar-collapse-2" id="nar-menu">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#" data-ng-click="selectedPage=1">חשבונית<span>&#64;</span><b>פלוס</b></a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
                        <ul class="nav navbar-nav navbar-right">
                            <li class="w-narrow" data-ng-repeat="p in pages | filter: { align: 'right' }">
                                <a href="#" data-ng-click="showPage(p.id)">{{p.cat}}</a></li>
                            <li class="dropdown w-wide" data-ng-repeat="p in pages | filter: { align: 'right' }">
                                <a href="#" data-ng-click="showPage(p.id)"
                                    data-ng-style="{'background-color': selectedPage == p.id ? '#178acc': 'transparent'}">{{p.cat}}</a>
                            </li>
                        </ul>
                         <ul class="nav navbar-nav navbar-left">
                                   <li class="w-narrow" data-ng-repeat="p in pages | filter: { align: 'left' }">
                                <a href="#" data-ng-click="showPage(p.id)">{{p.cat}}</a></li>
                            <li class="dropdown w-wide" data-ng-repeat="p in pages | filter: { align: 'left' }">
                                <a href="#" data-ng-click="showPage(p.id)"
                                    data-ng-style="{'background-color': selectedPage == p.id ? '#178acc': 'transparent'}">{{p.cat}}</a>
                            </li>
                         </ul>
                    </div>
                    <!-- /.navbar-collapse -->
                </div>
                <!-- /.container-fluid -->
            </div>
        </nav>
        <div class="container body-content">
            <div data-ng-show="selectedPage>1" style="margin-top: 70px;">
                <h2>{{dicPages[selectedPage].title}}</h2>
            </div>
            <div style="min-height: 400px" class="row">
                <div data-ng-repeat="page in pages" data-ng-include="'Inc/' + page.inc + '.htm'" 
                    data-ng-show="page.id == selectedPage" onload="loadPageEvents()"></div>
            </div>
            <hr />
            <footer style="margin: 0px">
                <p style="text-align: center">פיתוח ותחזוקה - וירטק סופטוור בע"מ</p>
            </footer>
        </div>
    
    <script>
        var minWidthForTop = 900;
        var scope;
        $(document).ready(function () {

            scope = angular.element($("body")).scope();

            $(".w-narrow a").click(function (event) {
                $("#nar-menu").click();
            });
            
            $(".navbar li").on("mouseover", function (event) {
                $(this).css("background-color", "#178acc");
            });

            $(".navbar li").on("mouseout", function (event) {
                $(this).css("background-color", "inherit");
            });

            $("#imgHome").css("display", $(window).width() >= 1200 ? "block" : "none");
            if ($(window).width() < minWidthForTop) {
                $(".w-wide").hide();
                $(".w-narrow").show();
            }
            else {
                $(".w-wide").show();
                $(".w-narrow").hide();
            }

            $(window).resize(function () {
                $("#imgHome").css("display", $(window).width() >= 1200 ? "block" : "none");
                if ($(window).width() < minWidthForTop) {
                    $(".w-wide").hide();
                    $(".w-narrow").show();
                }
                else {
                    $(".w-wide").show();
                    $(".w-narrow").hide();
                }
            });
            setTimeout(function () {
                $("#imgHome").css("display", $(window).width() >= 1200 ? "block" : "none");
            }, 1000)
        })
    </script>
       <script>
           var app = angular.module('myApp', [])
           .controller('myController', function ($scope) {
               $scope.pages = pubPages;
               $scope.dicPages = {}; // dictionary of all pages
               $scope.selectedPage = 1; // home page
               $.each($scope.pages, function (i, o) {
                   $scope.dicPages[o.id] = o;
               })

               $scope.showPage = function (id) {
                   //alert(id);
                   $scope.selectedPage = id;
               }
               $scope.loginError = false;
               $scope.restError = false;
               $scope.restSuccess = false;
               $scope.regError = false;


               $scope.$watch('selectedPage', function (newVal, oldVal) {
                   if (newVal == oldVal) return;
                   ResetErrorMessages();
               }, true);
              
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
        </script>
</body>
</html>
