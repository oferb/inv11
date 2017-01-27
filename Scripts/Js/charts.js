function CreateChart() {
    Tracer.Log("chart load is started");
    // Build the chart
    $('#container').highcharts({
        chart: {
            //type: 'area',
            type: 'column',
            marginBottom: 70,
            events: {
                load: function () {
                    scope.chartState.isChartLoaded = true;
                    Tracer.Log("chart is loaded");
                }
            }
        },
        legend: {
            align: 'bottom',
            y: 0
        },
        credits: {
            enabled: false
        },
        title: {
            enabled: false,
            text: ''            
        },
        subtitle: {
            enanbled: false,
            text: ''
        },
        xAxis: {           
            tickAmount: 8,
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%d/%m',
                day: '%d/%m',
                week: '%d/%m/%Y',
                month: '%m/%Y'
            }           
        },
        yAxis: {
            title: {
                text: 'הכנסות באלפי ש"ח'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000 + 'k';
                }
            }
        },
        tooltip: {
            useHTML: true,
            yDecimals: 2,
            formatter: function () {
                var s = '<div dir="rtl" style="text-align:right">' + Highcharts.dateFormat('%d/%m/%Y', this.x) + "</div>";
                s += '<span>' + 'ש"ח' + '</span>  <span dir="ltr" style="text-align:right">' + Highcharts.numberFormat(this.y,1,'.',',') + '</span>';//
                return s;
            }
        },
        plotOptions: {
            series: {
                //pointStart: Date.UTC(2015, 0, 1),
                //pointIntervalUnit: 'day'//,
                //dataGrouping: {
                //    approximation: "sum",
                //    enabled: true,
                //    forced: true,
                //    units: [['day', [1]]]
                //}
            },
            area: {
                step: true
                //pointStart: 1940,

                //marker: {
                //    enabled: false,
                //    symbol: 'circle',
                //    radius: 2,
                //    states: {
                //        hover: {
                //            enabled: true
                //        }
                //    }
                //}
            },
            column: {
                pointWidth: 20,
                pointPadding: 0.25               
            }
        },
            series: [{
                name: 'חשבוניות',
                color: '#3daae8'
            }, {
                name: 'קבלות',
                color: '#7ba74a'
            }]
    });
    
}
