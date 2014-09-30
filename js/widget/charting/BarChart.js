define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./BarChart/templates/BarChart.html",
    "dojo/i18n!./BarChart/nls/Strings",

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
        var css = [require.toUrl("./js/widget/charting/BarChart/css/BarChart.css")];
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

        color: null,
        //expanderTB: null,

        categoryType: null,

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);

            //this.initExpander();
            
            this.colors = [
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
            ];
        },

        startup: function () {
            console.log("BarChart started");
        },
        resize: function () {
        },
        
        prepareData: function(arrKeys, arrData) {
            var data = [];
            var intIndex = 0;
            var intTotal = 0;
            var intMaxValue = 0;
            arrayUtil.forEach(arrKeys, function(value, index) {
                if (arrData[value] == undefined) {
                    arrData[value] = 0;
                }
                data.push({ id: index, text: value, value: arrData[value] });
                intTotal += arrData[value];
                intIndex += 1;
                if (arrData[value] > intMaxValue) {
                    intMaxValue = arrData[value];
                }
            });

            var dataStore = new Object;
            dataStore.total = intTotal;
            dataStore.maxValue = intMaxValue;
            dataStore.data = data;
            this.updateSeries("", dataStore);
        },
        
        updateCategory: function(category) {
            this.categoryType = category;
        },

        updateSeries: function (title, dataStore) {
            var animArray = [];
            
            var self = lang.hitch(this);

            this.barChartContainer.innerHTML = "";
            
            arrayUtil.forEach(dataStore.data, function (bar, index) {
                var div = domConstruct.create("div", {
                    'class': 'bar-container'
                }, self.barChartContainer);

                //onclick implementation on barchart
                //filtering implementation, publish
                on(div, "click", function (e) {
                    //f1 is categories
                    var currentShape = this.lastChild;
                    topic.publish(appTopics.chart.handleShape, this, { shape: currentShape});
                    currentShape.style.opacity = .5;
                    
                    var filterCategory = self.categoryType;
                    var filterField1 = (bar.text != "") ? bar.text : "N/A";
                    topic.publish(appTopics.grid.filter, self, { filterField1Type: filterCategory, filterField2Type: null, filterField1: filterField1, filterField2: null });

                });

                var barLabel = domConstruct.create("div", {
                    'innerHTML': (bar.text != "") ? bar.text : "N/A",
                    'class': 'bar-label'
                }, div);
                var barWrapper = domConstruct.create("div", {
                    'class': 'bar-wrapper'
                }, div);

                var barWidth = (bar.value / dataStore.maxValue) * 100;
                //barWidth = barWidth === 0 ? 1 : barWidth;
                var barNode = domConstruct.create("div", {
                    'style': 'background-color:' + self.colors[index % self.colors.length],
                    'class':'bar'
                }, barWrapper);
                
                var barValue = domConstruct.create("span", {
                    'innerHTML': bar.value,
                    'class': 'bar-value'
                }, barWrapper);

                //animation
                var anime = fx.animateProperty({
                    node: barNode,
                    properties: {
                        width: { end: barWidth, start: 0, units: "%" }
                    },
                    duration:800
                });
                animArray.push(anime);
            });

            ////update chart header
            this.chartTitleNode.innerHTML = title ? title : ""; //"<span class= 'lighten'>" + selectLayer + ":</span> " + selectedField;
            //play animation
            coreFx.combine(animArray).play();
            //console.log("BarChart updated");
        }

    });
});