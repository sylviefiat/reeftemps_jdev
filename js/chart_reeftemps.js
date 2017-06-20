/**
 * This is an advanced demo of setting up Highcharts with the flags feature borrowed from Highstock.
 * It also shows custom graphics drawn in the chart area on chart load.
 */


/**
 * Fires on chart load, called from the chart.events.load option.
 */
function onChartLoad() {

    var centerX = 140,
        centerY = 110,
        path = [],
        angle,
        radius,
        badgeColor = Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.2).get(),
        spike,
        empImage,
        big5,
        label,
        left,
        right,
        years,
        renderer;

    if (this.chartWidth < 530) {
        return;
    }

    // Draw the spiked disc
    for (angle = 0; angle < 2 * Math.PI; angle += Math.PI / 24) {
        radius = spike ? 80 : 70;
        path.push(
            'L',
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        spike = !spike;
    }
    path[0] = 'M';
    path.push('z');
    this.renderer.path(path)
        .attr({
            fill: badgeColor,
            zIndex: 6
        })
        .add();

    // Employee image overlay
    empImage = this.renderer.path(path)
        .attr({
            zIndex: 7,
            opacity: 0,
            stroke: badgeColor,
            'stroke-width': 1
        })
        .add();

    // Big 5
    big5 = this.renderer.text('15')
        .attr({
            zIndex: 6
        })
        .css({
            color: 'white',
            fontSize: '90px',
            fontStyle: 'italic',
            fontFamily: '\'Brush Script MT\', sans-serif'
        })
        .add();
    big5.attr({
        x: centerX - big5.getBBox().width / 2,
        y: centerY + 14
    });

    // Draw the label
    label = this.renderer.text('millions de mesures')
        .attr({
            zIndex: 6
        })
        .css({
            color: '#FFFFFF'
        })
        .add();

    left = centerX - label.getBBox().width / 2;
    right = centerX + label.getBBox().width / 2;

    label.attr({
        x: left,
        y: centerY + 44
    });

    // The band
    left = centerX - 90;
    right = centerX + 90;
    this.renderer
        .path([
            'M', left, centerY + 30,
            'L', right, centerY + 30,
            right, centerY + 50,
            left, centerY + 50,
            'z',
            'M', left, centerY + 40,
            'L', left - 20, centerY + 40,
            left - 10, centerY + 50,
            left - 20, centerY + 60,
            left + 10, centerY + 60,
            left, centerY + 50,
            left + 10, centerY + 60,
            left + 10, centerY + 50,
            left, centerY + 50,
            'z',
            'M', right, centerY + 40,
            'L', right + 20, centerY + 40,
            right + 10, centerY + 50,
            right + 20, centerY + 60,
            right - 10, centerY + 60,
            right, centerY + 50,
            right - 10, centerY + 60,
            right - 10, centerY + 50,
            right, centerY + 50,
            'z'
        ])
        .attr({
            fill: badgeColor,
            stroke: '#FFFFFF',
            'stroke-width': 1,
            zIndex: 5
        })
        .add();

    // 1957-2017
    years = this.renderer.text('1957-2017')
        .attr({
            zIndex: 6
        })
        .css({
            color: '#FFFFFF',
            fontStyle: 'italic',
            fontSize: '10px'
        })
        .add();
    years.attr({
        x: centerX - years.getBBox().width / 2,
        y: centerY + 62
    });


    // Prepare mouseover
    renderer = this.renderer;
    if (renderer.defs) { // is SVG
        $.each(this.get('pays').points, function () {
            var point = this,
                pattern;
            if (point.image) {
                pattern = renderer.createElement('pattern').attr({
                    id: 'pattern-' + point.image,
                    patternUnits: 'userSpaceOnUse',
                    width: 300,
                    height: 200
                }).add(renderer.defs);
                renderer.image(
                    'http://sitecpso.ird.nc/img/' + point.image + '.png',
                    centerX - 95,
                    centerY - 70,
                    192,
                    144
                ).add(pattern);

                Highcharts.addEvent(point, 'mouseOver', function () {
                    empImage
                        .attr({
                            fill: 'url(#pattern-' + point.image + ')'
                        })
                        .animate({ opacity: 1 }, { duration: 500 });
                });
                Highcharts.addEvent(point, 'mouseOut', function () {
                    empImage.animate({ opacity: 0 }, { duration: 500 });
                });
            }
        });
    }
}


var options = {

    chart: {
        events: {
            load: onChartLoad
        }
    },

    xAxis: {
        type: 'datetime',
        minTickInterval: 365 * 24 * 36e5,
        labels: {
            align: 'left'
        },
        plotBands: [{
            from: Date.UTC(1957, 12, 25),
            to: Date.UTC(1999, 11, 1),
            color: '#EFFFFF',
            label: {
                text: '<em>Fréquence:</em><br> Quotidienne au sceau météorologique',
                style: {
                    color: '#999999'
                },
                y: 180
            }
        }, {
            from: Date.UTC(1999, 11, 1),
            to: Date.UTC(2012, 9, 1),
            color: '#FFFFEF',
            label: {
                text: '<em>Fréquence:</em><br> en heures',
                style: {
                    color: '#999999'
                },
                y: 30
            }
        }, {
            from: Date.UTC(2012, 9, 1),
            to: Date.UTC(2017, 05, 1),
            color: '#FFEFFF',
            label: {
                text: '<em>Fréquence:</em><br> à la seconde',
                style: {
                    color: '#999999'
                },
                y: 30
            }
        }]

    },

    title: {
        text: 'REEFTEMPS'
    },

    tooltip: {
        style: {
            width: '250px'
        }
    },

    yAxis: [{
        max: 15000000,
        labels: {
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        title: {
            text: 'Mesures',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: false,
        gridLineColor: 'rgba(0, 0, 0, 0.07)'
    }, {
    		allowDecimals: false,
        max: 250,
        labels: {
           style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
           text: 'Jeux de données',
           style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true,
        x: 10,
        gridLineWidth: 0
    }, {
        allowDecimals: false,
        max: 15,
        labels: {
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        title: {
            text: 'Pays',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true,
        gridLineWidth: 0
    }],

    plotOptions: {
        series: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2
            },
            fillOpacity: 0.5
        },
        flags: {
            tooltip: {
                xDateFormat: '%B %e, %Y'
            }
        }
    },
    
    rangeSelector: {
        inputEnabled: false,
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
    },

    series: [{
        type: 'spline',
        id: 'mesures',
        dashStyle: 'dash',
        name: 'Nombre de mesures',
        data: [{ x: Date.UTC(1957, 12, 25), y: 0 }, 
        			{ x: Date.UTC(1958, 6, 1), y: 336 }, 
              { x: Date.UTC(1959, 3, 1), y: 1063 }, 
              { x: Date.UTC(1960, 10, 1), y: 1792 }, 
              { x: Date.UTC(1961, 3, 1), y: 2512 }, 
              { x: Date.UTC(1962, 7, 1), y: 3242 }, 
              { x: Date.UTC(1963, 11, 1), y: 3961 }, 
              { x: Date.UTC(1964, 3, 1), y: 4692 }, 
              { x: Date.UTC(1965, 3, 1), y: 5418 }, 
              { x: Date.UTC(1966, 8, 1), y: 6063 }, 
              { x: Date.UTC(1967, 8, 1), y: 6777 }, 
              { x: Date.UTC(1968, 3, 1), y: 7509 }, 
              { x: Date.UTC(1969, 3, 1), y: 8239 }, 
              { x: Date.UTC(1970, 3, 1), y: 8969 }, 
              { x: Date.UTC(1971, 3, 1), y: 9693 }, 
              { x: Date.UTC(1972, 3, 1), y: 10425 }, 
              { x: Date.UTC(1973, 3, 1), y: 11122 }, 
              { x: Date.UTC(1974, 3, 1), y: 11567 }, 
              { x: Date.UTC(1975, 3, 1), y: 12323 }, 
              { x: Date.UTC(1976, 3, 1), y: 13172 },
              { x: Date.UTC(1977, 3, 1), y: 14078 },
              { x: Date.UTC(1978, 3, 1), y: 15228 }, 
              { x: Date.UTC(1979, 3, 1), y: 16678 },
              { x: Date.UTC(1980, 3, 1), y: 18392 }, 
              { x: Date.UTC(1981, 3, 1), y: 20014 }, 
              { x: Date.UTC(1982, 3, 1), y: 21683 }, 
              { x: Date.UTC(1983, 3, 1), y: 23400 }, 
              { x: Date.UTC(1984, 3, 1), y: 25134 }, 
              { x: Date.UTC(1985, 3, 1), y: 26877 }, 
              { x: Date.UTC(1986, 3, 1), y: 28546 }, 
              { x: Date.UTC(1987, 3, 1), y: 30006 }, 
              { x: Date.UTC(1988, 3, 1), y: 31464 }, 
              { x: Date.UTC(1989, 3, 1), y: 32758 }, 
              { x: Date.UTC(1990, 3, 1), y: 33832 },
              { x: Date.UTC(1991, 3, 1), y: 34797 }, 
              { x: Date.UTC(1992, 3, 1), y: 52724 }, 
              { x: Date.UTC(1993, 3, 1), y: 76220 }, 
              { x: Date.UTC(1994, 3, 1), y: 106642 },
              { x: Date.UTC(1995, 3, 1), y: 142232 }, 
              { x: Date.UTC(1996, 3, 1), y: 224189 }, 
              { x: Date.UTC(1997, 3, 1), y: 347492 }, 
              { x: Date.UTC(1998, 3, 1), y: 387628 }, 
              { x: Date.UTC(1999, 3, 1), y: 425769 }, 
              { x: Date.UTC(2000, 3, 1), y: 533217 }, 
              { x: Date.UTC(2001, 3, 1), y: 610361 }, 
              { x: Date.UTC(2002, 3, 1), y: 799519 }, 
              { x: Date.UTC(2003, 3, 1), y: 1389504 },
              { x: Date.UTC(2004, 3, 1), y: 2013157 }, 
              { x: Date.UTC(2005, 3, 1), y: 2388042 }, 
              { x: Date.UTC(2006, 3, 1), y: 3073325 }, 
              { x: Date.UTC(2007, 3, 1), y: 3785944 }, 
              { x: Date.UTC(2008, 3, 1), y: 4866444 }, 
              { x: Date.UTC(2009, 3, 1), y: 5352984 }, 
              { x: Date.UTC(2010, 3, 1), y: 5525255 },
              { x: Date.UTC(2011, 3, 1), y: 5642912 }, 
              { x: Date.UTC(2012, 3, 1), y: 5770547 }, 
              { x: Date.UTC(2013, 3, 1), y: 9339655 }, 
              { x: Date.UTC(2014, 3, 1), y: 13633859 }, 
              { x: Date.UTC(2015, 3, 1), y: 14029834 }, 
              { x: Date.UTC(2016, 3, 1), y: 14681707 }, 
              { x: Date.UTC(2017, 5, 1), y: 14883711 }],
        tooltip: {
            xDateFormat: '%Y',
            valueSuffix: ' mesures'
        }
    }, {
        yAxis: 1,
        name: 'Jeux de données',
        id: 'dataset',
        type: 'area',
        data: [{ x: Date.UTC(1958, 2, 15), y: 1 },{ x: Date.UTC(1958, 7, 18), y: 2 },{ x: Date.UTC(1967, 2, 28), y: 3 },{ x: Date.UTC(1967, 2, 28), y: 4 },{ x: Date.UTC(1974, 12, 12), y: 5 },{ x: Date.UTC(1977, 8, 8), y: 6 },{ x: Date.UTC(1978, 6, 9), y: 7 },{ x: Date.UTC(1978, 6, 9), y: 8 },{ x: Date.UTC(1979, 1, 4), y: 9 },
{ x: Date.UTC(1979, 1, 4), y: 10 },{ x: Date.UTC(1986, 1, 31), y: 11 },{ x: Date.UTC(1986, 1, 31), y: 12 },
{ x: Date.UTC(1986, 5, 9), y: 13 },{ x: Date.UTC(1986, 5, 9), y: 14 },{ x: Date.UTC(1992, 5, 22), y: 15 },
{ x: Date.UTC(1992, 5, 22), y: 16 },{ x: Date.UTC(1992, 5, 22), y: 17 },{ x: Date.UTC(1996, 1, 10), y: 18 },
{ x: Date.UTC(1996, 1, 10), y: 19 },{ x: Date.UTC(1996, 1, 11), y: 20 },{ x: Date.UTC(1996, 1, 12), y: 21 },
{ x: Date.UTC(1996, 1, 12), y: 22 },{ x: Date.UTC(1996, 1, 12), y: 23 },{ x: Date.UTC(1996, 12, 9), y: 24 },
{ x: Date.UTC(1997, 3, 9), y: 25 },{ x: Date.UTC(1997, 4, 3), y: 26 },{ x: Date.UTC(1997, 4, 3), y: 27 },
{ x: Date.UTC(1997, 4, 15), y: 28 },{ x: Date.UTC(1997, 6, 18), y: 29 },{ x: Date.UTC(1997, 9, 19), y: 30 },
{ x: Date.UTC(1997, 9, 24), y: 31 },{ x: Date.UTC(1997, 9, 28), y: 32 },{ x: Date.UTC(1997, 10, 22), y: 33 },
{ x: Date.UTC(1998, 8, 21), y: 34 },{ x: Date.UTC(1998, 8, 21), y: 35 },{ x: Date.UTC(1998, 8, 21), y: 36 },
{ x: Date.UTC(1999, 8, 12), y: 37 },{ x: Date.UTC(1999, 8, 12), y: 38 },{ x: Date.UTC(1999, 9, 20), y: 39 },
{ x: Date.UTC(1999, 9, 20), y: 40 },{ x: Date.UTC(1999, 11, 18), y: 41 },{ x: Date.UTC(1999, 11, 18), y: 42 },
{ x: Date.UTC(1999, 11, 18), y: 43 },{ x: Date.UTC(1999, 11, 18), y: 44 },{ x: Date.UTC(1999, 11, 18), y: 45 },{ x: Date.UTC(2001, 7, 23), y: 46 },{ x: Date.UTC(2001, 7, 23), y: 47 },{ x: Date.UTC(2001, 7, 23), y: 48 },
{ x: Date.UTC(2001, 7, 23), y: 49 },{ x: Date.UTC(2002, 5, 11), y: 50 },{ x: Date.UTC(2002, 5, 11), y: 51 },
{ x: Date.UTC(2003, 3, 16), y: 52 },{ x: Date.UTC(2004, 12, 9), y: 53 },{ x: Date.UTC(2004, 12, 10), y: 54 },
{ x: Date.UTC(2006, 10, 17), y: 55 },{ x: Date.UTC(2008, 7, 22), y: 56 },{ x: Date.UTC(2008, 7, 22), y: 57 },
{ x: Date.UTC(2008, 7, 22), y: 58 },{ x: Date.UTC(2009, 4, 10), y: 59 },{ x: Date.UTC(2009, 4, 10), y: 60 },
{ x: Date.UTC(2010, 10, 1), y: 61 },{ x: Date.UTC(2011, 1, 19), y: 62 },{ x: Date.UTC(2011, 1, 28), y: 63 },
{ x: Date.UTC(2011, 5, 31), y: 64 },{ x: Date.UTC(2011, 5, 31), y: 65 },{ x: Date.UTC(2011, 7, 31), y: 66 },
{ x: Date.UTC(2011, 7, 31), y: 67 },{ x: Date.UTC(2011, 7, 31), y: 68 },{ x: Date.UTC(2011, 8, 1), y: 69 },
{ x: Date.UTC(2011, 8, 15), y: 70 },{ x: Date.UTC(2011, 11, 1), y: 71 },{ x: Date.UTC(2011, 11, 1), y: 72 },
{ x: Date.UTC(2011, 11, 30), y: 73 },{ x: Date.UTC(2011, 11, 30), y: 74 },{ x: Date.UTC(2012, 2, 3), y: 75 },
{ x: Date.UTC(2012, 2, 3), y: 76 },{ x: Date.UTC(2012, 3, 23), y: 77 },{ x: Date.UTC(2012, 3, 23), y: 78 },
{ x: Date.UTC(2012, 4, 27), y: 79 },{ x: Date.UTC(2012, 4, 27), y: 80 },{ x: Date.UTC(2012, 4, 27), y: 81 },
{ x: Date.UTC(2012, 5, 4), y: 82 },{ x: Date.UTC(2012, 5, 5), y: 83 },{ x: Date.UTC(2012, 6, 18), y: 84 },
{ x: Date.UTC(2012, 6, 20), y: 85 },{ x: Date.UTC(2012, 6, 25), y: 86 },{ x: Date.UTC(2012, 6, 27), y: 87 },
{ x: Date.UTC(2012, 8, 15), y: 88 },{ x: Date.UTC(2012, 8, 15), y: 89 },{ x: Date.UTC(2012, 8, 16), y: 90 },
{ x: Date.UTC(2012, 8, 17), y: 91 },{ x: Date.UTC(2012, 8, 17), y: 92 },{ x: Date.UTC(2012, 8, 17), y: 93 },
{ x: Date.UTC(2012, 8, 17), y: 94 },{ x: Date.UTC(2012, 8, 17), y: 95 },{ x: Date.UTC(2012, 8, 17), y: 96 },
{ x: Date.UTC(2012, 8, 25), y: 97 },{ x: Date.UTC(2012, 8, 31), y: 98 },{ x: Date.UTC(2012, 10, 18), y: 99 },
{ x: Date.UTC(2012, 11, 7), y: 100 },{ x: Date.UTC(2012, 11, 9), y: 101 },{ x: Date.UTC(2012, 11, 13), y: 102 },{ x: Date.UTC(2012, 11, 13), y: 103 },{ x: Date.UTC(2012, 11, 13), y: 104 },{ x: Date.UTC(2012, 11, 13), y: 105 },{ x: Date.UTC(2012, 11, 13), y: 106 },{ x: Date.UTC(2012, 11, 13), y: 107 },{ x: Date.UTC(2012, 11, 28), y: 108 },{ x: Date.UTC(2012, 11, 29), y: 109 },{ x: Date.UTC(2012, 11, 29), y: 110 },{ x: Date.UTC(2012, 11, 29), y: 111 },{ x: Date.UTC(2012, 11, 29), y: 112 },{ x: Date.UTC(2012, 11, 29), y: 113 },
{ x: Date.UTC(2012, 11, 29), y: 114 },{ x: Date.UTC(2012, 11, 29), y: 115 },{ x: Date.UTC(2012, 11, 29), y: 116 },{ x: Date.UTC(2012, 11, 29), y: 117 },{ x: Date.UTC(2012, 11, 30), y: 118 },{ x: Date.UTC(2012, 12, 8), y: 119 },{ x: Date.UTC(2012, 12, 8), y: 120 },{ x: Date.UTC(2012, 12, 14), y: 121 },{ x: Date.UTC(2012, 12, 21), y: 122 },{ x: Date.UTC(2013, 4, 5), y: 123 },{ x: Date.UTC(2013, 4, 27), y: 124 },{ x: Date.UTC(2013, 4, 27), y: 125 },{ x: Date.UTC(2013, 4, 27), y: 126 },{ x: Date.UTC(2013, 4, 27), y: 127 },{ x: Date.UTC(2013, 4, 27), y: 128 },{ x: Date.UTC(2013, 4, 27), y: 129 },{ x: Date.UTC(2013, 4, 27), y: 130 },{ x: Date.UTC(2013, 4, 27), y: 131 },{ x: Date.UTC(2013, 4, 27), y: 132 },{ x: Date.UTC(2013, 4, 27), y: 133 },{ x: Date.UTC(2013, 7, 15), y: 134 },{ x: Date.UTC(2013, 9, 23), y: 135 },{ x: Date.UTC(2013, 9, 23), y: 136 },{ x: Date.UTC(2013, 9, 23), y: 137 },{ x: Date.UTC(2013, 9, 23), y: 138 },{ x: Date.UTC(2013, 9, 23), y: 139 },{ x: Date.UTC(2013, 9, 23), y: 140 },{ x: Date.UTC(2013, 10, 31), y: 141 },{ x: Date.UTC(2013, 10, 31), y: 142 },{ x: Date.UTC(2013, 10, 31), y: 143 },{ x: Date.UTC(2013, 10, 31), y: 144 },{ x: Date.UTC(2013, 10, 31), y: 145 },{ x: Date.UTC(2013, 10, 31), y: 146 },{ x: Date.UTC(2013, 12, 9), y: 147 },{ x: Date.UTC(2013, 12, 9), y: 148 },{ x: Date.UTC(2013, 12, 9), y: 149 },{ x: Date.UTC(2013, 12, 9), y: 150 },{ x: Date.UTC(2013, 12, 9), y: 151 },{ x: Date.UTC(2013, 12, 9), y: 152 },{ x: Date.UTC(2013, 12, 12), y: 153 },{ x: Date.UTC(2013, 12, 12), y: 154 },{ x: Date.UTC(2013, 12, 12), y: 155 },{ x: Date.UTC(2013, 12, 12), y: 156 },{ x: Date.UTC(2013, 12, 12), y: 157 },{ x: Date.UTC(2013, 12, 12), y: 158 },{ x: Date.UTC(2014, 5, 28), y: 159 },{ x: Date.UTC(2014, 5, 28), y: 160 },{ x: Date.UTC(2014, 9, 18), y: 161 },{ x: Date.UTC(2014, 12, 21), y: 162 },{ x: Date.UTC(2014, 12, 21), y: 163 },{ x: Date.UTC(2014, 12, 21), y: 164 },{ x: Date.UTC(2014, 12, 21), y: 165 },{ x: Date.UTC(2014, 12, 21), y: 166 },{ x: Date.UTC(2016, 2, 26), y: 167 },{ x: Date.UTC(2016, 2, 26), y: 168 },{ x: Date.UTC(2016, 2, 26), y: 169 },{ x: Date.UTC(2017, 5, 1), y: 169 }],
        tooltip: {
            xDateFormat: '%m %Y',
            valueSuffix: ' jeux de données '
        }

    }, {
        yAxis: 2,
        name: 'Pays',
        id: 'pays',
        type: 'area',
        step: 'left',
        tooltip: {
            headerFormat: '<span style="font-size: 11px;color:#666">{point.x:%B %e, %Y}</span><br>',
            pointFormat: '{point.name}<br><b>{point.y}</b>',
            valueSuffix: ' pays'
        },
        data: [
            { x: Date.UTC(1957, 12, 25), y: 1, name: 'Nouvelle-Calédonie', image: 'ncl' },
            { x: Date.UTC(1979, 1, 4), y: 2, name: 'Polynésie Française', image: 'pyf' },
            { x: Date.UTC(1998, 8, 21), y: 3, name: 'Wallis et Futuna', image: 'wls' },
            { x: Date.UTC(1999, 11, 18), y: 4, name: 'Vanuatu', image: 'vut' },
            { x: Date.UTC(2010, 10, 1), y: 5, name: 'Micronésie', image: 'fsm' },
            { x: Date.UTC(2011, 5, 31), y: 6, name: 'Îles Marshall', image: 'mhl' },
            { x: Date.UTC(2011, 7, 31), y: 7, name: 'Papouasie Nouvelle Guinée', image: 'png' },
            { x: Date.UTC(2011, 8, 1), y: 8, name: 'Tuvalu', image: 'tuv' },
            { x: Date.UTC(2011, 11, 1), y: 9, name: 'Kiribati', image: 'kir' },
            { x: Date.UTC(2012, 3, 23), y: 10, name: 'Palau', image: 'plw' },
            { x: Date.UTC(2012, 5, 4), y: 11, name: 'Tokelau', image: 'tkl' },
            { x: Date.UTC(2012, 6, 18), y: 12, name: 'Nauru', image: 'nru' },
            { x: Date.UTC(2012, 8, 31), y: 13, name: 'Samoa', image: 'wsm' },
            { x: Date.UTC(2012, 11, 28), y: 14, name: 'Fidji', image: 'fjl' },
            { x: Date.UTC(2017, 05, 1), y: 14, name: ' ', image: null }
        ]

    }]
};

// Add flags for important milestones. This requires Highstock.
if (Highcharts.seriesTypes.flags) {
    options.series.push({
        type: 'flags',
        name: 'IRD',
        color: '#333333',
        shape: 'squarepin',
        //y: -55,
        data: [
            { x: Date.UTC(1957, 12, 30), text: 'Première mesure IRD', title: 'IRD', shape: 'squarepin' },
            { x: Date.UTC(2010, 10, 1), text: 'Arrivée de la CPS', title: 'CPS' },
            { x: Date.UTC(2012, 11, 28), text: 'Participation de l\'USP', title: 'USP' }
        ],
        onSeries: 'pays',
        showInLegend: false
    },{
        type: 'flags',
        name: 'Highcharts',
        color: '#333333',
        shape: 'circlepin',
        data: [
            { x: Date.UTC(2005, 10, 27), text: 'DBOCEANO', title: 'dboceano' },
            { x: Date.UTC(2012, 1, 13), text: 'SITECPSO', title: 'sitecpso 1' },
            { x: Date.UTC(2017, 4, 23), text: 'SITECPSO', title: 'sitecpso 2' }
        ],
        showInLegend: false
    });
}

Highcharts.stockChart('containerGraph', options);