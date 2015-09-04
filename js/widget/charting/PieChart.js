define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./PieChart/templates/PieChart.html",
    "dojo/i18n!./PieChart/nls/Strings",

    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/query",
    "dijit/registry",
    
    "dijit/form/CheckBox",
    "dijit/form/ToggleButton",
    
    "dojox/charting/Chart",
    "dojox/charting/widget/Legend",
    "dojox/charting/widget/SelectableLegend",
    "dojox/charting/plot2d/Pie",
    "dojox/charting/action2d/Highlight",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/MoveSlice",
    "dojox/charting/Theme",
    "dojox/charting/themes/PlotKit/green", // theme
    "dojox/charting/StoreSeries",
    
    "dojo/fx",
    "dojo/_base/fx",
    "dijit/registry",
     
    "app/WorkflowManager/config/Topics"
    
], function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template, i18n,
    arrayUtil, lang, topic, domStyle, domConstruct, domClass, on, query, registry, 
    CheckBox, ToggleButton,
    Chart, Legend, SelectableLegend, Pie, Highlight, Tooltip, MoveSlice, Theme, greenTheme, StoreSeries, 
    coreFx, baseFx, registry,
    appTopics) {
        
    (function() {
        var css = [require.toUrl("./js/widget/charting/PieChart/css/PieChart.css")];
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
        pieChart: false,
        pieLegend: false,
        expanderTB: null,

        //additional variables
        fieldArr: [],

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
            
            // not used (once used again -> set opacity: 0 as start value in "Container" attach-point in template)
            //initialize expander 
            //this.initExpander();

            //set chart header if there is one
            if (this.header != null) {
                this.chartTitleNode.innerHTML = this.header;
            }
            else {
                //domStyle.set(this.chartTitleUnderlineNode, "display", "none");
            }

            var strokeStyle = { color: "#EFEFEF", width: 2 };
            var currentTheme = new Theme({
                colors: [
                    "#1F517F",
                    "#3A7532",
                    "#239999",
                    "#DB8F2A",
                    "#C12B2B",
                    "#3E308E",
                    "#87275E",
                    "#5EA1D3",
                    "#76CC7A",
                    "#62D7DD",
                    "#F7C959",
                    "#F45353",
                    "#5F4CC9",
                    "#C65495",
                    "#AAAFAF",
                    "#777B7B",
                    "#333535"
                ]
            });
            currentTheme.chart.fill = "transparent";
            currentTheme.plotarea.fill = "transparent";

            this.pieChart = new Chart(this.chartContainerNode);
            this.pieChart.setTheme(currentTheme);
            this.pieChart.addPlot("default", {
                type: "Pie",
                labels: false,
                font: "normal normal 10pt Tahoma",
                fontColor: "#333",
                labelOffset: -40,
                labelStyle: "columns",
                radius: 110,
                animate: true,
                markers: true,
                stroke: strokeStyle
            }).addSeries("Status", []); // no data added when initialized

            this.pieChart.render();
            if (this.hasLegend != null && this.hasLegend) {
                this.pieLegend = new Legend({ chart: this.pieChart, horizontal: false }, this.legendContainerNode);                
            }
            
            if (this.title != null) {
                this.pieChartTitle.innerHTML = this.title;
                domStyle.set(this.pieChartTitle, "display", "block");
            }

        },

        startup: function () {
            console.log("PieChart started");
           //this.createSeries();
        },
        
        /*
        createSeries: function() {
            var wedges = ["Slice 1", "Slice 2", "Slice 3", "Slice 4", "Slice 5"];
            var pieData = [];
            pieData.push({ id: 0, text: "Slice 1", y: 17 });
            pieData.push({ id: 1, text: "Slice 2", y: 7 });
            pieData.push({ id: 2, text: "Slice 3", y: 3 });
            pieData.push({ id: 3, text: "Slice 4", y: 2 });
            pieData.push({ id: 4, text: "Slice 5", y: 1 });

            TOTAL_Count = 30;

            var filteredDataStore = new Object;
            filteredDataStore.total = TOTAL_Count;
            filteredDataStore.wedges = wedges;
            filteredDataStore.data = pieData;
            this.updateSeries("Test series", filteredDataStore);
        },
        */

       
        //store the category and group
        prepareData: function (arrKeys, arrData) {
            var self = lang.hitch(this);
            var categoryType = arguments[3];
            var groupType = arguments[4];
            this.chartContainerNode.className = "pie";
            var data = [];
            var intIndex = 0;
            var intTotal = 0;
            //prepare for values with empty strings
            for (var key in arrData) {
                var obj = arrData[key];
                if (!key) {
                    delete arrData.key;
                    arrData["N/A"] = obj;
                }
            }

            this.fieldArr = [];

            arrayUtil.forEach(arrKeys, function (value, index) {
                //prepare for values with empty strings
                if (!value) {
                    value = "N/A";
                }
                if (arrData[value] == undefined) {
                    arrData[value] = 0;
                }
                data.push({ id: index, text: value, y: arrData[value] });
                //fill array with important things
                self.fieldArr.push(data[index].text);
                intTotal += arrData[value];
                intIndex += 1;
            });

            //grab graph title, aka grouped by selection
            var grouped = arguments[2];
            this.pieChart.connectToPlot("default", function (evt) {
                var type = evt.type;
                var id = evt.index;
                // React to mouseover event
                if (type == "onclick") {
                    //f1 is the categories
                    //f2 is the group
                    var filterField2 = grouped;
                    var filterField1 = self.fieldArr[id];
                    if (filterField1) {
                        if (!self.queryed) {
                            //queryed to stop multi click events
                            self.queryed = true;
                            topic.publish(appTopics.chart.handleShape, this, { shape: evt.shape });
                            evt.shape.fillStyle.a = .5;
                            evt.shape.setFill(evt.shape.fillStyle);
                            topic.publish(appTopics.grid.filter, self, { filterField1: filterField1, filterField2: filterField2 });
                        }
                    }
                } else if (type == "onmouseout") {
                    self.queryed = false;
                }
                    //topic.publish(appTopics.filter.jobQueriesChanged, this, { selectedId: id });
            });

            var dataStore = new Object;
            dataStore.total = intTotal;
            dataStore.data = data;
            this.updateSeries("", dataStore);
        },

        /*
        Example
        
        dataStore: {
            data: [
                { id=0, text="Landbase Updates", y=56}, 
                { id=1, text="Data Edits", y=61}, 
                { id=2, text="Create Version", y=63}
            ],
            total: 180
        }
        */

        updateSeries: function (title, dataStore) {
            //update chart header
            this.chartTitleNode.innerHTML = title ? title : "N/A";
            //add tooltips to the data
            var updatedSeries = arrayUtil.map(dataStore.data, function (wedge) {
                var percentage = wedge.y / dataStore.total;
                percentage = percentage.toFixed(2);
                if (!wedge.y) {
                    wedge.y = 0;
                }
                return {
                    y: wedge.y,
                    text: wedge.text, 
                    tooltip: wedge.text + ": <span style='font-weight:bold'>" + wedge.y + "</span> (" + Math.round(percentage * 100) + "%)"
                };
            });

            this.pieChart.updateSeries("Status", updatedSeries);
            new MoveSlice(this.pieChart, "default");
            //new Highlight(this.pieChart, "default");
            new Tooltip(this.pieChart, "default");
            this.pieChart.render();
            if (this.pieLegend) {
                this.pieLegend.refresh();
            }

            //console.log("PieChart updated");
        },

        // not used
        initExpander: function () {
            var self = lang.hitch(this);
            self.expanderTB = new ToggleButton({
                "showLabel": false,
                "checked": false,
                "title": "expand grid",
                "iconClass": "icon-chevron-left",
                "onChange": function () {
                    this.set("title", this.checked ? "collapse chart panel" : "expand chart panel");
                    this.set("iconClass", this.checked ? "icon-chevron-right" : "icon-chevron-left");
                    if (this.checked) {                        
                        domStyle.set('charts-container', 'width', '32%');
                        registry.byId('main-container').resize();
                        domStyle.set(self.Container, 'opacity', '1');
                        //domStyle.set(self.containerToggleWrapper, 'top', '8px');
                        self.pieChart.resize();
                        domClass.add(self.containerToggleWrapper, "expanded");
                    }
                    else {
                        domClass.remove(self.containerToggleWrapper, "expanded");
                        var body = dojo.body();
                        //domStyle.set(self.containerToggleWrapper, 'top', '50%');
                        var anims = coreFx.combine([
                                         baseFx.animateProperty({
                                             node: "charts-container",
                                             properties: {
                                                 left: body.clientWidth - 58,
                                                 width: 24
                                             },
                                             duration: '500'
                                         })
                        ]).play();

                        dojo.connect(anims, 'onEnd', function () {
                            registry.byId('main-container').resize();
                            domStyle.set(self.Container, 'opacity', '0');
                        });
                    }//end of else
                }
            }, this.containerToggle);
        },
        
        // not used
        checkIsOpenStatus: function () {
            var self = lang.hitch(this);
            if (dojo.byId('charts-container').clientWidth > 35) {
                self.expanderTB.setChecked(true);
            }
            else {
                self.expanderTB.setChecked(false);
            }
        }

    });
});