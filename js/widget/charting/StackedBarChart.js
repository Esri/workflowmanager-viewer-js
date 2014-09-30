define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./StackedBarChart/templates/StackedBarChart.html",
    "dojo/i18n!./StackedBarChart/nls/Strings",

    "dojo/_base/fx",
    "dojo/fx",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/connect",    
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dijit/registry",
    "dojo/fx",
    "dojo/_base/fx",
    "dijit/form/ToggleButton",

    "dojo/topic",
    "app/WorkflowManager/config/Topics"

  
],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template, i18n,
    fx, coreFx, lang, arrayUtil, connect, parser, query, on, dom, domStyle, domConstruct, domClass, registry, coreFx, baseFx, ToggleButton,
    topic, appTopics) {

    (function() {
        var css = [require.toUrl("./js/widget/charting/StackedBarChart/css/StackedBarChart.css")];
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
        widgetsInTemplate: true,

        barChart: null,
        barLegend: null,

        //stored groupType
        groupType: null,

        color: null,
        colors: [
            "#2D64A0",
            "#45963C",
            "#31A8B5",
            "#ED9C28",
            "#D2322D",
            "#442EA0",
            "#992B65",
            "#4E91CE",
            "#74C967",
            "#62D7DD",
            "#F7C959",
            "#F45353",
            "#5F4CC9",
            "#C65495",
            "#AAAFAF",
            "#777B7B",
            "#333535"
        ],

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("StackedBarChart started");
        },
        resize: function () {
        },
        
        prepareData: function(seriesKeys, dataKeys, dataValues) {
            // seriesKeys are the titles for each series but also the key to access the dataValues array
            // dataKeys are the titles for each slice of a serie
            // dataValues are the values for each slice of a serie
            var data = [];
            var intIndex = 0;
            var intTotal = 0;
            var intMaxValue = 0;
            
            //arrayUtil.forEach(dataKeys, lang.hitch(this, function(key) {
            //    this.statisticsContainer.content.addPieChart(key, seriesKeys, dataValues[key]);
            //}));
            
            arrayUtil.forEach(dataKeys, function(dataKey, index) {
                
                // get total numbers for the serie
                var intTotalSerie = 0;
                arrayUtil.forEach(seriesKeys, function(serieKey) {
                    if (dataValues[dataKey][serieKey] == undefined) {
                        dataValues[dataKey][serieKey] = 0;
                    }
                    intTotalSerie += dataValues[dataKey][serieKey];
                });
                
                // update the total of the dataStore
                if (intTotalSerie > intMaxValue) {
                    intMaxValue = intTotalSerie;
                }
                
                // add the serie to the data array
                data.push({ id: index, title: dataKey, total: intTotalSerie, values: dataValues[dataKey], keys: seriesKeys }); // dataKey is the title
            });

            var dataStore = new Object;
            dataStore.maxValue = intMaxValue;
            dataStore.data = data;
            this.updateSeries(dataStore);
        },

        //changes GroupType when it is changed
        updateGroup: function(group){
            this.groupType = group;
        },

        updateSeries: function (dataStore) {
            var animArray = [];
            
            var self = lang.hitch(this);

            this.stackedBarChartContainer.innerHTML = "";
            
            arrayUtil.forEach(dataStore.data, function (serie, index) {
                // create a series container
                var div = domConstruct.create("div", {
                    'class': 'stackedBar-container'
                }, self.stackedBarChartContainer);

                //onclick implementation on barchart
                //filtering implemented, publish
                on(div, "click", function (e) {
                    //f1 is group
                    var currentShape = this.lastChild;
                    topic.publish(appTopics.chart.handleShape, this, { shape: currentShape });
                    currentShape.style.opacity = .5;
                    var filterGroup = self.groupType;
                    var filterField1 = (serie.title != "") ? serie.title : "N/A";
                    topic.publish(appTopics.grid.filter, self, { filterField1Type: filterGroup, filterField2Type: null, filterField1: filterField1, filterFiled2: null });

                });

                // add the label
                var barLabel = domConstruct.create("div", {
                    'innerHTML': (serie.title != "") ? serie.title : "N/A",
                    'class': 'stackedBar-label'
                }, div);

                // add the wrapper (for the actual slices)
                var barWrapper = domConstruct.create("div", {
                    'class': 'stackedBar-wrapper'
                }, div);

                // calculate the width of the bar
                var barWidth = (serie.total / dataStore.maxValue) * 100;
                
                // add the slices to the bar
                var intIndex = 0;
                arrayUtil.forEach(serie.keys, function(key) {
                    var sliceWidth = (serie.values[key] / serie.total) * barWidth;
                    var barNode = domConstruct.create("div", {
                        'style': 'background-color:' + self.colors[intIndex % self.colors.length] + '; width: ' + sliceWidth + '%; float: left;',
                        'class': 'stackedBar'
                    }, barWrapper);    
                    intIndex += 1;            
                });

                // add the actual number behind the bar
                var barValue = domConstruct.create("span", {
                    'innerHTML': serie.total,
                    'class': 'stackedBar-value'
                }, barWrapper);

                //animation
                /*
                var anime = fx.animateProperty({
                    node: barNode,
                    properties: {
                        width: { end: barWidth, start: 0, units: "%" }
                    },
                    duration:800
                });
                animArray.push(anime);
                */
                
            });

            if (this.hasLegend != null && this.hasLegend) {
                this.createLegend(dataStore);    
            }

            //play animation
            coreFx.combine(animArray).play();
            console.log("StackedBarChart updated");
        },
        
        createLegend: function(dataStore) {
            
            this.stackedBarChartLegend.innerHTML = "";
            
            var div = domConstruct.create("div", {
                'class': 'stackedBarLegend-container'
            }, this.stackedBarChartLegend);
            
            // add the wrapper (for the actual slices)
            var barWrapper = domConstruct.create("div", {
                //'class': 'stackedBar-wrapper'
            }, div);
            
            var intIndex = 0;
            arrayUtil.forEach(dataStore.data[0].keys, lang.hitch(this, function(key) {
                domConstruct.create("div", {
                    'style': 'background-color:' + this.colors[intIndex % this.colors.length] + ';',
                    'class': 'stackedBarLegend-symbol'
                }, barWrapper);    
                
                domConstruct.create("div", {
                    'innerHTML': (key != "") ? key : "N/A",
                }, barWrapper);    
                
                intIndex += 1;
            }));
                
            this.chartLegend
        }

    });
});