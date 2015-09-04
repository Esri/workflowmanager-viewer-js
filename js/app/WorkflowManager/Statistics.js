define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/Statistics.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/parser",
    "dojo/query",
    "dojo/aspect",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dijit/registry",
    
    // data handling
    "dojo/store/Observable",
    "dojo/store/Memory",
    
    // Charting widgets
    "widget/charting/PieChart",
    "widget/charting/BarChart",
    "widget/charting/StackedBarChart",
    
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/form/RadioButton"
    ],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
    template, i18n, appTopics,
    dom, lang, connect, arrayUtil, parser, query, aspect, on, topic, domStyle, registry,
    Observable, Memory,
    PieChart, BarChart, StackedBarChart,
    FilteringSelect, TextBox, Button, DropDownButton, RadioButton) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
        statsPieCharts: [],
        
        // i18n
        i18n_CategorizedBy: i18n.statistics.categorizedBy,
        i18n_GroupedBy: i18n.statistics.groupedBy,
        i18n_BarChart: i18n.statistics.barChart,
        i18n_PieChart: i18n.statistics.pieChart,
        i18n_Reset: i18n.statistics.reset,
        i18n_SelectACategory: i18n.statistics.selectACategory,
        
        //store categoryType, groupType
        categoryType: null,
        groupType: null,

        // Selected Feature
        currentShape: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.initUI();
            this.initTopics();
            console.log("Statistics started");
        },

        initTopics: function () {
            var self = lang.hitch(this);
            topic.subscribe(appTopics.chart.handleShape, function (sender, args) {
                if (args) {
                    self.handleShape(args.shape);
                } else {
                    self.handleShape();
                }
            });
        },

        handleShape: function (shape) {
            if (this.currentShape) {
                if (this.currentShape.className) {
                    this.currentShape.style.opacity = 1.0;
                } else {
                    this.currentShape.fillStyle.a = 1;
                    this.currentShape.setFill(this.currentShape.fillStyle);
                }
                if (!shape) {
                    this.resetButton.style.display = "none";
                }
            } else {
                if (shape) {
                    this.resetButton.style.display = "";
                }
            }
            this.currentShape = shape;
        },
       
        initUI: function() {
            var self = lang.hitch(this);
            
            // initialize the categorized by
            var chartCategorizedByStore = new Observable(new Memory({
                idProperty: "index",
                data: [
                    { id: 0, label: "", index: 0 }
                ]
            }));
            
            this.chartCategorizedBy = new FilteringSelect({
                placeHolder: i18n.common.loading,
                name: "cboChartCategorizedBy",
                style: "width:150px;",
                store: chartCategorizedByStore,
                searchAttr: "label",
                required: false,
                onChange: function(id) {
                    self.currentSelection = this.item;
                    if ((this.item) && (this.item.label != "")) {
                        self.populateGroupedByDropdown(this.item.index);
                        //reset the grid before the chart changes to match
                        topic.publish(appTopics.grid.resetFilter, self, {});
                        //save label and pass it to stackBarChart
                        self.categoryType = this.item.id;
                        topic.publish(appTopics.statistics.chartCategorizedBy, self, { });
                    }
                }
            }, this.cboChartCategorizedBy);
            this.chartCategorizedBy.set("value", chartCategorizedByStore.getIdentity(chartCategorizedByStore.data[0]));
            this.chartCategorizedBy.startup();
            on.once(this.chartCategorizedBy, "onChange", this.chartCategorizedBy.set("placeHolder", i18n.common.selectOption));
            
            // initialize the grouped by dropdown
            var chartGroupedByStore = new Memory({
                data: [
                    { id: 0, label: "", index: 0 }
                ]
            });
            
            this.chartGroupedBy = new FilteringSelect({
                placeHolder: i18n.common.loading,
                name: "cboChartGroupedBy",
                style: "width:150px;",
                store: chartGroupedByStore,
                searchAttr: "label",
                value: i18n.statistics.none,
                onChange: function (id) {
                    self.currentGroupedBySelection = this.item;
                    //reset grid before chart changes to match
                    topic.publish(appTopics.grid.resetFilter, self, {});
                    //save label and pass it to barChart
                    self.groupType = this.item.id;
                    topic.publish(appTopics.statistics.chartGroupedBy, self, { id: this.item.id, item: this.item });
                }
            }, this.cboChartGroupedBy);
            this.chartGroupedBy.set("value", chartGroupedByStore.getIdentity(chartGroupedByStore.data[0]));
            this.chartGroupedBy.startup();
            on.once(this.chartGroupedBy, "onChange", this.chartGroupedBy.set("placeHolder", i18n.common.selectOption));

            // initialize the pie chart
            this.statsBarChart = new BarChart({}).placeAt(this.statsBarChartContainer);
            this.statsBarChart.startup();
            
            this.statsPieChart = new PieChart({hasLegend: true}).placeAt(this.statsPieChartContainer);
            this.statsPieChart.startup();
            
            this.statsStackedBarChart = new StackedBarChart({hasLegend: true}).placeAt(this.groupedStatsBarChartContainer);
            this.statsStackedBarChart.startup();
            
            this.toggleCharts();
        },
        
        //button event
        resetRow: function () {
            topic.publish(appTopics.grid.resetFilter, self, {});
        },
        
        populateDropdowns: function (customColumns, selectFirstCategory) {
            var self = lang.hitch(this);
            var selectedIndex;
            this.customColumns = customColumns;

            this.categorizedByStore = new Memory({
                idProperty: "index",
                data: [
                    { label: "Select", index: -1 }
                ]
            });
            
            arrayUtil.forEach(customColumns, function (item, i) {
                if ((item.id.toLowerCase().indexOf("JOB_ID".toLowerCase()) != -1) || (item.id.toLowerCase().indexOf("JOB_NAME".toLowerCase()) != -1)) {
                    item.hidden = true;
                }
                if (item.hidden == false) {
                    self.categorizedByStore.put(item);
                }
            });

            this.chartCategorizedBy.set("store", this.categorizedByStore);

            //query store for previously selected option in the new store
            if (selectFirstCategory) {
                varFirstCategoryIndex = this.getFirstCategoryIndex();
                selectedIndex = this.chartCategorizedBy.store.query({ index: varFirstCategoryIndex });
            } else if (this.currentSelection) {
                selectedIndex = this.chartCategorizedBy.store.query({ id: this.currentSelection.id });
            } else {
                selectedIndex = [{ index: 0 }];
            }
                        
            //select first option if no option is already selected
            if ((!this.chartCategorizedBy.get("value")) || (selectedIndex.length < 1)) {
                this.categoryType = this.categorizedByStore.data[0].id;
                this.chartCategorizedBy.set("value", this.categorizedByStore.getIdentity(this.categorizedByStore.data[0]));
            } else {
                this.chartCategorizedBy.set("value", selectedIndex[0].index);
            }

            this.populateGroupedByDropdown();
        },
        
        getFirstCategoryIndex: function () {
            var storeData = this.chartCategorizedBy.store.data;
            for (var i=0; i < storeData.length; i++) {
                if (storeData[i].index > 0)
                    return storeData[i].index;
            }
            return -1;
        },
        
        populateGroupedByDropdown: function (index) {
            var self = lang.hitch(this);
            var selectedIndex;

            this.groupedByStore = new Memory({
                idProperty: "index",
                data: [
                    { label: "None", index: -1 }
                ]
            });
            arrayUtil.forEach(this.customColumns, function (entry, i) {
                if (entry.hidden == false) {
                    self.groupedByStore.put(entry);
                }
            });
            
            //if an index is passed in with call, remove that item from store
            //for grouped by filtering select
            index = this.chartCategorizedBy.value;
            if (index > -1) {
                self.groupedByStore.remove(index);
            }

            this.chartGroupedBy.set("store", this.groupedByStore);

            //query store for previously selected option in the new store
            if (this.currentGroupedBySelection) {
                selectedIndex = this.chartGroupedBy.store.query({ id: this.currentGroupedBySelection.id });
            } else {
                selectedIndex = [{ index: 0 }];
            }

            //select first option if no option is already selected
            if ((!this.chartGroupedBy.get("value")) || (selectedIndex.length < 1)) {
                this.chartGroupedBy.set("value", this.groupedByStore.getIdentity(this.groupedByStore.data[0]));
            } else {
                this.chartGroupedBy.set("value", selectedIndex[0].index);
            }
        },
        
        toggleCharts: function () {
            var checkedButtons = dojo.query('[name=chartType]').filter(function (radio) {
                return radio.checked;
            });
            
            //reset filter before changing grid
            topic.publish(appTopics.grid.resetFilter, self, {});

            if (this.chartCategorizedBy.value <= 0) {
                domStyle.set(this.messageStatsChartContainer, "display", "block");
                domStyle.set(this.simpleStatsChartContainer, "display", "none");
                domStyle.set(this.groupedStatsChartContainer, "display", "none");
                
            } else if (this.chartGroupedBy.value > 0) { // grouped by
                domStyle.set(this.messageStatsChartContainer, "display", "none");
                domStyle.set(this.simpleStatsChartContainer, "display", "none");
                domStyle.set(this.groupedStatsChartContainer, "display", "block");
                
                if (checkedButtons[0].value == "chartTypeBar") { // bar
                    domStyle.set(this.groupedStatsPieChartContainer, "display", "none");
                    domStyle.set(this.groupedStatsBarChartContainer, "display", "block");
                } else { // pie
                    domStyle.set(this.groupedStatsPieChartContainer, "display", "block");
                    domStyle.set(this.groupedStatsBarChartContainer, "display", "none");
                }
                
            } else { // NOT grouped by
                domStyle.set(this.messageStatsChartContainer, "display", "none");
                domStyle.set(this.simpleStatsChartContainer, "display", "block");
                domStyle.set(this.groupedStatsChartContainer, "display", "none");
                
                if (checkedButtons[0].value == "chartTypeBar") { // bar
                    domStyle.set(this.statsPieChartContainer, "display", "none");
                    domStyle.set(this.statsBarChartContainer, "display", "block");
                } else { // pie
                    domStyle.set(this.statsPieChartContainer, "display", "block");
                    domStyle.set(this.statsBarChartContainer, "display", "none");
                }
            }
        },
        
        clearGroupedBySelection: function() {
            if (this.chartGroupedBy.value > 0) {
                this.chartGroupedBy.set("value", this.chartGroupedBy.store.data[0].index);
            }
        },
        
        clearGroupedByCharts: function() {
            arrayUtil.forEach(this.statsPieCharts, function(chart) {
                chart.destroy();
            });
            this.statsPieCharts.length = 0;
            this.groupedStatsPieChartContainer.innerHTML = "";
        },

        //toss in an extra argument for prepare data, gain access to the title of the chart
        //and allow the click to determine what chart it is clicking
        //additional parameters are the category and group currently selected
        addPieChart: function(title, arrKeys, arrData) {
            var chart = new PieChart({title: title, hasLegend: true}).placeAt(this.groupedStatsPieChartContainer);
            chart.prepareData(arrKeys, arrData, title, this.categoryType, this.groupType);
            chart.startup();
            this.statsPieCharts.push(chart);
        }
        
    });
});