// Copied and modified over from src\app\services\highChartsTheme.ts

module.exports = {
    HighchartsDarkTheme: {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#ac80a0', '#be6e46', '#4bc6b9', '#fefeff', '#dd5e98', '#3e5641', '#cf8e80', '#adeee3',
            '#86deb7', '#63b995', '#50723c', '#423e28'
        ],
        chart: {
            backgroundColor: '#22343c',
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    },

    HighchartsLightTheme: {
        colors: [
            '#7cb5ec',
            '#434348',
            '#90ed7d',
            '#f7a35c',
            '#8085e9',
            '#f15c80',
            '#e4d354',
            '#2b908f',
            '#f45b5b',
            '#91e8e1',
            '#3ab795',
            '#bce784',
            '#ee6352',
            '#6c3a5c',
            '#957186',
            '#243010',
            '#7a306c',
            '#8e8dbe',
            '#a9e4ef',
            '#81f495',
            '#96f550'
        ],
        symbols: [
            'circle',
            'diamond',
            'square',
            'triangle',
            'triangle-down'
        ],
        lang: {
            loading: 'Loading...',
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            shortMonths: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            weekdays: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            decimalPoint: '.',
            numericSymbols: [
                'k',
                'M',
                'G',
                'T',
                'P',
                'E'
            ],
            resetZoom: 'Reset zoom',
            resetZoomTitle: 'Reset zoom level 1:1',
            thousandsSep: ' '
        },
        global: {},
        time: {},
        chart: {
            borderRadius: 0,
            defaultSeriesType: 'line',
            ignoreHiddenSeries: true,
            spacing: [
                10,
                10,
                15,
                10
            ],
            resetZoomButton: {
                theme: {
                    zIndex: 6
                },
                position: {
                    align: 'right',
                    x: -10,
                    y: 10
                }
            },
            width: null,
            height: null,
            borderColor: '#335cad',
            backgroundColor: '#ffffff',
            plotBorderColor: '#cccccc'
        },
        title: {
            text: 'Chart title',
            align: 'center',
            margin: 15,
            widthAdjust: -44
        },
        subtitle: {
            text: '',
            align: 'center',
            widthAdjust: -44
        },
        plotOptions: {
            line: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: '#ffffff',
                    enabledThreshold: 2,
                    radius: 4,
                    states: {
                        normal: {},
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: '#cccccc',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: true,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: 'x'
            },
            area: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: '#ffffff',
                    enabledThreshold: 2,
                    radius: 4,
                    states: {
                        normal: {},
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: '#cccccc',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: false,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                threshold: 0
            },
            spline: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: '#ffffff',
                    enabledThreshold: 2,
                    radius: 4,
                    states: {
                        normal: {},
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: '#cccccc',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: true,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: 'x'
            },
            areaspline: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: '#ffffff',
                    enabledThreshold: 2,
                    radius: 4,
                    states: {
                        normal: {},
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: '#cccccc',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: false,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                threshold: 0
            },
            column: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: null,
                point: {
                    events: {}
                },
                dataLabels: {
                    align: null,
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: null,
                    x: 0,
                    y: null,
                    padding: 5
                },
                cropThreshold: 50,
                pointRange: null,
                softThreshold: false,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: false,
                        brightness: 0.1
                    },
                    select: {
                        marker: {},
                        color: '#cccccc',
                        borderColor: '#000000'
                    }
                },
                stickyTracking: false,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                borderRadius: 0,
                crisp: true,
                groupPadding: 0.2,
                pointPadding: 0.1,
                minPointLength: 0,
                startFromThreshold: true,
                tooltip: {
                    distance: 6
                },
                threshold: 0,
                borderColor: '#ffffff'
            },
            bar: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: null,
                point: {
                    events: {}
                },
                dataLabels: {
                    align: null,
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: null,
                    x: 0,
                    y: null,
                    padding: 5
                },
                cropThreshold: 50,
                pointRange: null,
                softThreshold: false,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: false,
                        brightness: 0.1
                    },
                    select: {
                        marker: {},
                        color: '#cccccc',
                        borderColor: '#000000'
                    }
                },
                stickyTracking: false,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                borderRadius: 0,
                crisp: true,
                groupPadding: 0.2,
                pointPadding: 0.1,
                minPointLength: 0,
                startFromThreshold: true,
                tooltip: {
                    distance: 6
                },
                threshold: 0,
                borderColor: '#ffffff'
            },
            scatter: {
                lineWidth: 0,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: '#ffffff',
                    enabledThreshold: 2,
                    radius: 4,
                    states: {
                        normal: {},
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: '#cccccc',
                            lineColor: '#000000',
                            lineWidth: 2
                        }
                    },
                    enabled: true
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: true,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: 'xy',
                tooltip: {
                    headerFormat: '<span style=\"color:{point.color}\">●</span> <span style=\"font-size: 0.85em\"> {series.name}</span><br/>',
                    pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
                }
            },
            pie: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: null,
                point: {
                    events: {}
                },
                dataLabels: {
                    align: 'center',
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    padding: 5,
                    distance: 30,
                    enabled: true
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: true,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        },
                        brightness: 0.1
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: false,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                center: [
                    null,
                    null
                ],
                clip: false,
                colorByPoint: true,
                ignoreHiddenPoint: true,
                legendType: 'point',
                size: null,
                showInLegend: false,
                slicedOffset: 10,
                tooltip: {
                    followPointer: true
                },
                borderColor: '#ffffff',
                borderWidth: 1
            },
            xrange: {
                lineWidth: 2,
                allowPointSelect: false,
                showCheckbox: false,
                animation: {
                    duration: 1000
                },
                events: {},
                marker: null,
                point: {
                    events: {}
                },
                dataLabels: {
                    align: null,
                    style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'contrast',
                        textOutline: '1px contrast'
                    },
                    verticalAlign: 'middle',
                    x: 0,
                    y: null,
                    padding: 5,
                    inside: true
                },
                cropThreshold: 50,
                pointRange: 0,
                softThreshold: false,
                states: {
                    normal: {},
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: false,
                        brightness: 0.1
                    },
                    select: {
                        marker: {},
                        color: '#cccccc',
                        borderColor: '#000000'
                    }
                },
                stickyTracking: false,
                turboThreshold: 1000,
                findNearestPointBy: 'x',
                borderRadius: 3,
                crisp: true,
                groupPadding: 0.2,
                pointPadding: 0.1,
                minPointLength: 0,
                startFromThreshold: true,
                tooltip: {
                    distance: 6,
                    headerFormat: '<span style=\"font-size: 0.85em\">{point.x} - {point.x2}</span><br/>',
                    pointFormat: '<span style=\"color:{point.color}\">●</span> {series.name}: <b>{point.yCategory}</b><br/>'
                },
                threshold: 0,
                borderColor: '#ffffff',
                colorByPoint: true
            }
        },
        labels: {
            style: {
                position: 'absolute',
                color: '#333333'
            }
        },
        legend: {
            enabled: true,
            align: 'center',
            layout: 'horizontal',
            borderColor: '#999999',
            borderRadius: 0,
            navigation: {
                activeColor: '#003399',
                inactiveColor: '#cccccc'
            },
            itemStyle: {
                color: '#333333',
                fontSize: '12px',
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
            },
            itemHoverStyle: {
                color: '#000000'
            },
            itemHiddenStyle: {
                color: '#cccccc'
            },
            shadow: false,
            itemCheckboxStyle: {
                position: 'absolute',
                width: '13px',
                height: '13px'
            },
            squareSymbol: true,
            symbolPadding: 5,
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            title: {
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        loading: {
            labelStyle: {
                fontWeight: 'bold',
                position: 'relative',
                top: '45%'
            },
            style: {
                position: 'absolute',
                backgroundColor: '#ffffff',
                opacity: 0.5,
                textAlign: 'center'
            }
        },
        tooltip: {
            enabled: true,
            animation: true,
            borderRadius: 3,
            dateTimeLabelFormats: {
                millisecond: '%A, %b %e, %H:%M:%S.%L',
                second: '%A, %b %e, %H:%M:%S',
                minute: '%A, %b %e, %H:%M',
                hour: '%A, %b %e, %H:%M',
                day: '%A, %b %e, %Y',
                week: 'Week from %A, %b %e, %Y',
                month: '%B %Y',
                year: '%Y'
            },
            footerFormat: '',
            padding: 8,
            snap: 10,
            backgroundColor: 'rgba(247,247,247,0.85)',
            borderWidth: 1,
            headerFormat: '<span style=\"font-size: 10px\">{point.key}</span><br/>',
            pointFormat: '<span style=\"color:{point.color}\">●</span> {series.name}: <b>{point.y}</b><br/>',
            shadow: true,
            style: {
                color: '#333333',
                cursor: 'default',
                fontSize: '12px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
            }
        },
        credits: {
            enabled: true,
            href: 'http://www.highcharts.com',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5
            },
            style: {
                cursor: 'pointer',
                color: '#999999',
                fontSize: '9px'
            },
            text: 'Highcharts.com'
        }
    }
}
