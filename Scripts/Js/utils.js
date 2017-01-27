function ResetErrorMessages() {
    $("label.error").hide();
}

function ResetErrorUserForms() {
    scope.userData = angular.copy(scope.userDataBac);
    scope.resetFlags();
    //scope.$apply();
    $("label.error").hide();
}

function AbsoluteCoordinates($element) {
    var sTop = $(window).scrollTop();
    var sLeft = $(window).scrollLeft();
    var w = $element.width();
    var h = $element.height();
    var offset = $element.offset();
    var $p = $element;
    while (typeof $p == 'object') {
        var pOffset = $p.parent().offset();
        if (typeof pOffset == 'undefined') break;
        offset.left = offset.left + (pOffset.left);
        offset.top = offset.top + (pOffset.top);
        $p = $p.parent();
    }

    var pos = {
        left: offset.left + sLeft,
        right: offset.left + w + sLeft,
        top: offset.top + sTop,
        bottom: offset.top + h + sTop,
    }
    pos.tl = { x: pos.left, y: pos.top };
    pos.tr = { x: pos.right, y: pos.top };
    pos.bl = { x: pos.left, y: pos.bottom };
    pos.br = { x: pos.right, y: pos.bottom };
    //console.log( 'left: ' + pos.left + ' - right: ' + pos.right +' - top: ' + pos.top +' - bottom: ' + pos.bottom  );
    return pos;
}

function FileUpload(f) {
    var myFormData = new FormData();
    myFormData.append('file', f);

    $.ajax({
        url: 'fileUploader.ashx?id=' + scope.selectedCompany.Id, // 
        type: 'POST',
        processData: false, // important
        contentType: false, // important
        dataType: 'json',
        data: myFormData,
        complete: function (d) {
            if (d.responseText.indexOf("__error_") > -1) {
                scope.tempMessage(1, "שגיאה");
            } else {
                scope.selectedCompany.Logo = d.responseText;
                var cmp = Enumerable
                    .From(scope.userCompanies)
                    .Where(function (s) { return s.Id == scope.selectedCompany.Id })
                    .FirstOrDefault();
                cmp.Logo = d.responseText;
                cmp = Enumerable
                    .From(scope.userCompaniesBac)
                    .Where(function (s) { return s.Id == scope.selectedCompany.Id })
                    .FirstOrDefault();
                cmp.Logo = d.responseText;
                scope.tempMessage(0, "עידכון הלוגו בוצע בהצלחה");
            }
            scope.$digest();
        }
    });
}

function CloseWaitingMessage() {
    $(".loaded").show();
    //$("#divBody").show();
    //$("#divFooter").show();
    $("#divWait").hide();
    var chart = $('#container').highcharts();
    chart.reflow();
}



// for performance tracing
var Tracer = {
    Enabled: false,
    Prev: new Date(),
    Log: function (s) {
        if (this.Enabled) {
            var d = new Date();
            console.log(s + ": " + (d - this.Prev));
            this.Prev = d;
        }
    },
    LogObject: function (s, o) {
        if (this.Enabled) {
            console.log(s);
            console.log(o);
        }
    }
}


Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};

// for checks
String.prototype.addNumber = function (n) {
    var s = this;
    if ($.isNumeric(s)) {
        var k = (parseInt(s) + n).toString();
        if (k.length < s.length) {
            var m = s.length - k.length;
            for (var i = 0; i < m; i++) {
                k = "0" + k;
            }
        }
        return k;
    } else {
        return s + n.toString();
    }

}


///
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    
    //var textEncoder = new TextEncoder('windows-1255');
    //var txt = textEncoder(CSV);

    //var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var uri = 'data:text/csv;base64,77u/' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}