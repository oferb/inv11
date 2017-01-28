// events and global variables
//var minWidthForTop = 990;
var minWidthForTop = 1180;
var scope; // 
$(document).ready(function () {
    scope = angular.element($("body")).scope();

    //scope.loadDatePickers();

    $(".w-narrow a").click(function (event) {
        $("#nar-menu").click();
    });

    $(".navbar li").on("mouseover", function (event) {
        $(this).css("background-color", "#178acc");
        var a = $(this).find(".dropdown-menu");
        if ($(a).length > 0) $(a).show();
    });

    $(".navbar li").on("mouseout", function (event) {
        $(this).css("background-color", "inherit");
        var a = $(this).find(".dropdown-menu");
        if ($(a).length > 0) $(a).hide();
    });

    $(".nav-pills li").on("mouseover", function (event) {
        var a = $(this).find(".dropdown-menu");
        if ($(a).length > 0) $(a).show();
    });

    $(".nav-pills li").on("mouseout", function (event) {
        var a = $(this).find(".dropdown-menu");
        if ($(a).length > 0) $(a).hide();
    });

    $(".navbar li a, .nav-pills li a").click(function (event) {
        var a = $(".dropdown-menu:visible");
        $(a).hide();
    });

    //$("#imgHome").css("display", $(window).width() >= 1200 ? "block" : "none");
    // TBD - if may be removed
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
        //console.log($('#container').width());
    }, 1000)
    
})


function LoadAutoSelects() {
    LoadCustomersAuto();
    LoadDocAuto();
    LoadDocDates();
    LoadDocProducts();
    LoadYearsAndMonths();
    $('.selectpicker').selectpicker('refresh');
}

function LoadCustomersAuto() {
    if (typeof (scope) == "undefined") return;

    for (var j = 1; j <= 4; j++) {
        $('#selCustomer' + j + " option").remove();
        $('#selCustomer' + j)
                .append($("<option></option>")
                .attr("selected","selected")
                .attr("value", 0)
                .attr("title", "כל הלקוחות")
                .text("כל הלקוחות"));
        $('#selCustomer' + j).selectpicker('refresh');
        $.each(scope.userCustomers, function (i, o) {
            $('#selCustomer' + j)
                .append($("<option></option>")
                .attr("value", o.Id)
                .attr("title", o.Name)
                .text(o.Name));
            $('#selCustomer' + j).selectpicker('refresh');
        });

        $("#selCustomer" + j).on("change", function () {
            scope.search.docCustomer = parseInt($(this).val());
            scope.safeApply();
        });

        $('#selCustomer' + j).selectpicker({
            style: 'btn-primary btn-sm',// 
            width: j==2 ? '100%' : 160,
            size: 11
        });

    }
    
}

function ReloadCustomersAuto() {
    for (var j = 1; j <= 4; j++) {
        $('#selCustomer'+j).find('option:not(:first)').remove();
    }
    LoadCustomersAuto();
    for (var j = 1; j <= 4; j++) {
        $('#selCustomer' + j).selectpicker('refresh');
    }
}

function LoadDocAuto() {
    //$('#selType1').find('option:not(:first)').remove();
    //$('#selType2').find('option:not(:first)').remove();
    $.each(scope.docTypes, function (i, o) {
        $('#selType1')
         .append($("<option></option>")
         .attr("value", o.Id)
         .attr("title", o.Name)
         .text(o.Name));
        $('#selType2')
         .append($("<option></option>")
         .attr("value", o.Id)
         .attr("title", o.Name)
         .text(o.Name));
    });

    $("#selType1, #selType2").on("change", function () {
        scope.search.docType = $(this).val();
        scope.newDoc.Type = $(this).val();   
        scope.safeApply();
    });

    $('#selType1, #selType2').selectpicker({
        style: 'btn-primary btn-sm',// 
        width: 160,
        size: 11
    });
    //$('.selectpicker').selectpicker('refresh');
}

function LoadYearsAndMonths() {
    $.each(scope.years, function (i,a) {
        $('#selYear')
         .append($("<option></option>")
         .attr("value", a)
         .attr("title", a)
         .text(a));
    });

    $("#selYear").on("change", function () {
        scope.repFilter.Year = $(this).val();      
        scope.safeApply();
    });

    $('#selYear').selectpicker({
        style: 'btn-primary btn-sm',// 
        width: 160,
        size: 11
    });

    $.each(scope.months, function (i, a) {
        $('#selMonth')
         .append($("<option></option>")
         .attr("value", a)
         .attr("title", a)
         .text(a));
        $('#selMonthTo')
         .append($("<option></option>")
         .attr("value", a)
         .attr("title", a)
         .text(a));
    });

    $("#selMonth").on("change", function () {
        scope.repFilter.Month = $(this).val();
        scope.safeApply();
    });

    $("#selMonthTo").on("change", function () {
        scope.repFilter.MonthTo = $(this).val();
        scope.safeApply();
    });

    $('#selMonth').selectpicker({
        style: 'btn-primary btn-sm',// 
        width: 130,
        size: 13
    });

    $('#selMonthTo').selectpicker({
        style: 'btn-primary btn-sm',// 
        width: 130,
        size: 13
    });

}

function LoadDocDates() {
    $('#selDateRanges, #selDateRangesA').find('option:not(:first)').remove();
    $.each(scope.docPeriods, function (i, o) {
        $('#selDateRanges')
         .append($("<option></option>")
         .attr("value", o.p)
         .attr("title", o.t)
         .text(o.t));
        $('#selDateRangesA')
         .append($("<option></option>")
         .attr("value", o.p)
         .attr("title", o.t)
         .text(o.t));
    });

    $("#selDateRanges, #selDateRangesA").on("change", function () {
        scope.search.docPeriod = $(this).val();
        scope.safeApply();
    });

    $('#selDateRanges').selectpicker({
        style: 'btn-primary btn-sm',// 
        width: 160,
        size: 11
    });

    //scope.loadDateRange();
    //$('.selectpicker').selectpicker('refresh');
}



function LoadDocProducts() {
    if (typeof (scope) == "undefined") return;
    $('#selProduct').find('option:not(:first)').remove();
    var list = Enumerable.From(scope.userProducts)
                .Where(function (x) { return x.CompanyID == scope.search.docCompany })//newDoc.Company
                .OrderBy(function (x) { return x.Name}).ToArray();
    $.each(list, function (i, o) {
        $('#selProduct')
                .append($("<option></option>")
                .attr("value", o.Id)
                .attr("title", o.Name)
                .text(o.Name));
        });
    $("#selProduct").on("change", function () {
        var id = $(this).val();
        var pr = Enumerable.From(scope.userProducts)
                .Where(function (x) { return x.Id == id }).FirstOrDefault();
        if (typeof (pr) == "undefined") return;
        //scope.testItem = pr.Name;
        pr.Selected = true;
        //scope.search.docPeriod = $(this).val();
        scope.safeApply();
        $('#selProduct').selectpicker('deselectAll');

    });

    //$("#tdAddItem input").keyup(function (e) {
    //    if (e.which == 13) {
    //        $('#selProduct').selectpicker('hide');
    //        scope.testItem = $("#selProduct").selectpicker('val');// $("#selProduct").text();
    //        scope.safeApply();
    //    }
    //});

    $('#selProduct').selectpicker({
        style: 'btn-primary btn-sm',// 
        size: 6
    });
    $('#selProduct').selectpicker('refresh');
}

function NewProductCallback(a) {
    var id = "temp_" + UniqId();
    var pr = {
        Id: id,
        Name: a,
        Info: '',
        Amount: 1,
        Price: 100,
        Selected: true
    }
    scope.userProducts.push(pr); // ALEX - dont add to products

    // make selected
    scope.testItem = a;
    scope.safeApply();
}

function UniqId() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
}




function GetScreenSize() {
    if ($(window).width() < 300) {
        return "xs";
    }else if ($(window).width() >= 300 && $(window).width() < 768) {
        // do something for small screens
        return "sm";
    }
    else if ($(window).width() >= 768 && $(window).width() <= 992) {
        // do something for medium screens
        return "md";
    }    
    else {
        // do something for lage screens
        return "lg";
    }
}

//function ActivateTabEvents() {
//    $('.nav-tabs').tab();
//    $('.nav-tabs a').on('click', function (e) {
//        e.preventDefault();
//        $(this).tab('show');
//    });
//}


// for zoom
(function ($) {
    var version = false,
    isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
    isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
    isChrome = !!window.chrome && !isOpera;
    if (isChrome) {
        version = (window.navigator.appVersion.match(/Chrome\/(\d+)\./) !== null) ?
        parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) :
        0;
        version = (version >= 10) ? true : false;
        // Don't know what version they switched it.  Figured that this was a good guess
    }
    // I added the extra ternary check in there because when testing in Chrome,
    // if I switched the user agent in the overrides section, it kept failing with 
    // null value for version.

    if (isSafari || version) {
        $('.zoom').css('-webkit-transform', 'scale(0.6)');
        $('.zoom').css('-webkit-transform-origin', '0 0');
        // If Scaling based upon different resolutions, a check could be included here
        // for window size, and the css could be adjusted accordingly.
    }
}(jQuery))