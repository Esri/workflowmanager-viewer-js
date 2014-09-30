define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./LineChart/templates/LineChart.html",

    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/connect",    
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dijit/registry",

    "dojox/charting/Chart",
    "dojox/charting/widget/Legend",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/Theme",
    "dojox/charting/themes/PlotKit/green", // theme
    "dojox/charting/StoreSeries",
    "dojox/charting/action2d/MouseIndicator",
    "dojox/charting/axis2d/Default"
],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template,
    arrayUtil, lang, connect, parser, query, on, domStyle, registry,
    Chart, Legend, Lines, Tooltip, Theme, greenTheme, StoreSeries, MouseIndicator) {
        
    (function() {
        var css = [require.toUrl("./js/widget/charting/LineChart/css/LineChart.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for(var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: false,
        lineChart: false,
        lineLegend: false,

        header: null,
        type : null,

        constructor: function (type) {            
        },

        postCreate: function () {
            this.inherited(arguments);

            //set chart header if there is one
            if (this.header) {
                this.chartTitleNode.innerHTML = this.header;
            }
            else {
                //domStyle.set(this.chartTitleUnderlineNode, "display", "none");
            }

            var currentTheme = new Theme({
                colors: [
                    "#FA916C",
                        "#68C6E6",
                        "#9ADB70",
                        "#EB490B",
                        "#F2D780",
                        "#E44960"
                ]
            });
            currentTheme.chart.fill = "transparent";
            currentTheme.plotarea.fill = "transparent";

            this.lineChart = new Chart(this.chartContainerNode, { margins: { l: 10, t: 10, b: 10, r: 10 }});
            this.lineChart.setTheme(currentTheme)
            .addPlot("default", {
                type: "Lines",
                markers: true,
                //animate: true
            })
            .addAxis("x", {
                fixLower: "minor", 
                fixUpper: "minor", 
                minorTicks: true, 
                min:1999,
                max:2014
            })
            .addAxis("y", { 
                vertical: true, 
                fixLower: "minor", 
                fixUpper: "major", 
                min: 0, 
                max: 10, 
                minorTicks: true 
            });

            this.lineChart.addSeries("revenue", [{ x: 2000, y: 3 }, { x: 2001, y: 2 }, { x: 2002, y: 5 }, { x: 2003, y: 4 },
            { x: 2004, y: 5 }, { x: 2005, y: 7 }, { x: 2006, y: 7 }, { x: 2007, y: 8 }, { x: 2008, y: 6 }, { x: 2009, y: 5 },
            { x: 2010, y: 6 }, { x: 2011, y: 5 }, { x: 2012, y: 8 }, { x: 2013, y: 9 }]);
            
            //new Tooltip(this.lineChart, "default");

            new MouseIndicator(this.lineChart, "default", { series: "revenue",
                lineStroke: { color: "#333", width: 2 }, labelFunc: function (v) {
                    return "year " + v.x + ": " + v.y;
                },
                fill: "#333",
                stroke: "transparent",
                fontColor: "white",
                markerStroke: { color: "#FA916C", width: 3 },
                markerFill: "white",
                mouseOver: true
            });

            this.lineChart.render();
            //this.lineLegend = new Legend({ chart: this.lineChart , horizontal: false }, this.legendContainerNode);
        },

        startup: function () {
            console.log("LineChart started");
        },

        resize: function(){
            this.lineChart.resize();
        },
        
        updateSeries: function (momentumSeriesData) {
                            
            var months = [];
            var years = [];
            var newPartners = momentumSeriesData.newPartners;
            var numOfNewPartners = []; var len = 0;
            var tempCount = 0;
            for(var i = 0, len = newPartners.length; i < len; i++){
                 months.push(newPartners[i].monthName); years.push(newPartners[i].year);    
                 tempCount += parseInt(newPartners[i].newPartners);                 
                 numOfNewPartners.push({  x : i+1, y : tempCount, tooltip : tempCount });      
            }
    
                            
            var partnerSubmissions = momentumSeriesData.partnerSubmissions;
            var numOfSubmission = []; tempCount = 0;
            for(i = 0, len = partnerSubmissions.length; i < len; i++){
                tempCount += parseInt(partnerSubmissions[i].numberOfSubmissions);                                     
                numOfSubmission.push({  x : i+1, y : tempCount, tooltip : tempCount});          
            }
            
            var partnerUploads = momentumSeriesData.partnerUploads;
            var numOfUploads = []; tempCount = 0;
            for(i = 0, len = partnerUploads.length; i < len; i++){
                tempCount += parseInt(partnerUploads[i].numberOfUploads);                 
                numOfUploads.push({  x : i+1, y : tempCount, tooltip : tempCount });                
            }
            
            var monthLabels = [];
            
            for(i = 0, len = months.length; i < len;){                 
                monthLabels.push({text : months[i] + "-" + years[i], value : ++i});    
            }
            
            /*[{value: 1, text: "Aug"}, {value: 2, text: "Sep"},
                                    {value: 3, text: "Oct"}, {value: 4, text: "Nov"},{value: 5, text: "Dec"}, {value: 6, text: "Jan"}] */
            
            this.lineChart.addAxis("x", { fixLower: "major", fixUpper: "major", minorTicks: false, 
                            labels : monthLabels });
            //console.log(monthLabels);
                            
             this.lineChart.updateSeries("New partners", numOfNewPartners);
             this.lineChart.updateSeries("Uploads", numOfUploads);
             this.lineChart.updateSeries("Submissions", numOfSubmission);
             
             this.lineChart.render();
             this.lineLegend.refresh();                        
        },
        updateTimeSeries: function (momentumSeriesData2) {
            console.log(momentumSeriesData2);    
            
            var months = []; var years = [];
            var submissionTimes = momentumSeriesData2.submissionTime;
            var submissionTimeValues = []; var len = 0;
            var tempCount = 0;
            for(var i = 0, len = submissionTimes.length; i < len; i++){
                 months.push(submissionTimes[i].monthName); years.push(submissionTimes[i].year);    
                 tempCount += parseInt(submissionTimes[i].time);                 
                 submissionTimeValues.push({  x : i+1, y : tempCount, tooltip : tempCount });      
            }
    
                            
            var responseTimes = momentumSeriesData2.responseTime;
            var responseTimeValues = []; tempCount = 0;
            for(i = 0, len = responseTimes.length; i < len; i++){
                tempCount += parseInt(responseTimes[i].time);                                     
                responseTimeValues.push({  x : i+1, y : tempCount, tooltip : tempCount});          
            }
                        
            var monthLabels = [];
            
            for(i = 0, len = months.length; i < len;){                 
                monthLabels.push({text : months[i] + "-" + years[i], value : ++i});    
            }
            
            
            this.lineChart.addAxis("x", { fixLower: "major", fixUpper: "major", minorTicks: false, 
                            labels : monthLabels });
            
                            
            this.lineChart.updateSeries("Submission time", submissionTimeValues);
            this.lineChart.updateSeries("Response time", responseTimeValues);
            
             
            this.lineChart.render();
            this.lineLegend.refresh();                        
        }
    });
});