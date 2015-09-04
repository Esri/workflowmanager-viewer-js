define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/array",

    "dojo/topic",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/date/locale",
    "dojo/number",
    "dojo/on",
    "dojox/gesture/tap",
    
    "dojo/_base/lang",
    "dojo/string",
    
    "dojo/store/Memory",
    
    "dgrid/OnDemandGrid",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Selection",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/extensions/Pagination",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    
    "dijit/form/Button",
    "dijit/Dialog",
    "dijit/form/FilteringSelect",
    
    "dojo/text!./templates/Grid.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, arrayUtil,
        topic, dom, domStyle, domConstruct, domClass, locale, localeNumber, on, tap,
        lang, string, 
        Memory,
        OnDemandGrid, DijitRegistry, Selection, treeGrid, editor, Pagination, ColumnHider, ColumnResizer,
        Button, Dialog, FilteringSelect,
        template, i18n, appTopics
    ) {

    // main geolocation widget
    return declare("dijit.gis.WorkflowManager.Grid", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,

        i18n_JobAssignment: i18n.properties.jobAssignment,
        i18n_JobAssignmentUser: i18n.properties.jobAssignmentUser,
        i18n_JobAssignmentGroup: i18n.properties.jobAssignmentGroup,
        i18n_JobAssignmentUnassigned: i18n.properties.jobAssignmentUnassigned,
        i18n_Yes: i18n.grid.yes,
        i18n_No: i18n.grid.no,
        // Delete
        i18n_PromptDelete: i18n.grid.promptDelete,
        i18n_Delete: i18n.grid.deleteBtn,
        i18n_DeleteTitle: i18n.grid.deleteTitle,
        // Close
        i18n_PromptClose: i18n.grid.promptClose,
        i18n_Close: i18n.grid.closeBtn,
        i18n_CloseTitle: i18n.grid.closeTitle,
        // Reopen
        i18n_PromptReopen: i18n.grid.promptReopen,
        i18n_Reopen: i18n.grid.reopenBtn,
        i18n_ReopenTitle: i18n.grid.reopenTitle,
        
        dataGrid: null,

        postCreate: function() {
            this.inherited(arguments);
        },
        
        startup: function() {
            var self = lang.hitch(this);
            this.initUI();
            console.log("Grid started");

            on(this.btnCloseJob, "click", function () {
                var jobs = Object.keys(self.dataGrid.selection);
                topic.publish(appTopics.grid.closeJobs, this, {jobs: jobs});
            });

            on(this.btnReopenJob, "click", function () {
                var jobs = Object.keys(self.dataGrid.selection);
                topic.publish(appTopics.grid.reopenClosedJobs, this, {jobs: jobs});
            });

            on(this.btnDeleteJob, "click", function () {
                var jobs = Object.keys(self.dataGrid.selection);
                topic.publish(appTopics.grid.deleteJobs, this, {jobs: jobs});
            });
        },
        
        initUI: function() {
            var CustomGrid = declare([OnDemandGrid, DijitRegistry, Selection, ColumnHider, ColumnResizer]);
            this.dataGrid = new CustomGrid({
                selectionMode: "extended",
                bufferRows: Infinity,   //testing with much higher values than default (2000)
                minRowsPerPage: 100,    //default (25)
                loadingMessage: i18n.common.loading,
                noDataMessage: i18n.filter.noJobsForThisQuery,
                store: new Memory()
            }, this.gridContainer);
            
            this.grid = dom.byId("grid");

            var self = lang.hitch(this);
            var selectedRow;

            // multiple selection
            this.dataGrid.on("dgrid-select", function (event) {
                self.selectedJobIds = Object.keys(self.dataGrid.selection);

                switch(self.selectedJobIds.length){
                    case 0:
                        self.disableButtons();
                        break;
                    case 1:
                        self.enableButtons();
                        break;
                    default:
                        //disable map buttons
                        topic.publish(appTopics.map.draw.deactivateAll, null);
                        //clear graphics on deselect
                        topic.publish(appTopics.map.clearGraphics, null);
                }

                //only execute if row selected was not already selected
                //prevents excessive calls with double click event
                if (!self.rows || self.rows[0].id != event.rows[0].id) {
                    // Get the rows that were just selected
                    self.rows = event.rows;
                    if (self.rows.length == 1) {
                        var row = self.rows[0];
                        self.selectedRow = row;
                        var gridArr = self.gridContainer.children[1].firstChild.children;
                        var gridArrPos = self.findGridArrPos(gridArr, self.selectedRow.id);
                        topic.publish(appTopics.grid.rowSelected, self, { 
                            selectedId: row.id, 
                            selectedFromGrid: event.grid.focused,
                            zoomToPolygon: true,
                            gridArr: gridArr,
                            gridArrPos: gridArrPos
                        });
                    }
                }
            });
            
            this.dataGrid.on("dgrid-deselect", function(event){
                var selectedJobIds = Object.keys(self.dataGrid.selection);

                if (selectedJobIds.length > 0) {
                    self.enableButtons();
                } else {
                    self.disableButtons();
                }

            });

            this.dataGrid.on(".dgrid-row:click", function (event) {
                if (Object.keys(self.dataGrid.selection).length > 1) {
                    self.resetButtons();
                }
            });

            this.dataGrid.on(".dgrid-row:dblclick", function (event) {
                topic.publish(appTopics.grid.jobDialog, this, { event: event, selectedId: self.selectedRow.id });
            });

            //enable open dialog on touch screens
            on(this.dataGrid.bodyNode, tap.doubletap, function (event) {
                topic.publish(appTopics.grid.jobDialog, this, { event: event, selectedId: self.selectedRow.id });
            });

            this.dataGrid.startup();
        },

        findGridArrPos: function(gridArr, selID){
            var pos = 1;
            for(pos = 1; pos < (gridArr.length -1); pos++)
            {
                if(gridArr[pos].firstChild.firstChild.firstChild.innerText == selID)
                    break;
            }
            
            return pos;
        },


        setPrivileges: function(canDelete, canClose, canReopen){
            this.canClose = canClose;
            this.canReopen = canReopen;
            this.canDelete = canDelete;
        },

        // based upon privileges
        setButtons: function (canDelete, canClose, canReopen) {
            if (canClose) {
                this.btnCloseContainer.style.display = "";
            } else {
                this.btnCloseContainer.style.display = "none";
            }
            if (canReopen) {
                this.btnReopenContainer.style.display = "";
            } else {
                this.btnReopenContainer.style.display = "none";
            }
            if (canDelete) {
                this.btnDeleteContainer.style.display = "";
            } else {
                this.btnDeleteContainer.style.display = "none";
            }
        },

        resetButtons: function() {
            if (this.canClose) {
                this.btnCloseContainer.style.display = "";
            } else {
                this.btnCloseContainer.style.display = "none";
            }
            if (this.canReopen) {
                this.btnReopenContainer.style.display = "";
            } else {
                this.btnReopenContainer.style.display = "none";
            }
            if (this.canDelete) {
                this.btnDeleteContainer.style.display = "";
            } else {
                this.btnDeleteContainer.style.display = "none";
            }
        },

        enableButtons: function(){
            this.gridButtons.style.display = "";
        },

        disableButtons: function(){
            this.gridButtons.style.display = "none";
        },

        setGridData: function (columns, rows, idProperty) {
            var self = lang.hitch(this);
            var intFields = [];
            var dateFields = [];

            //get columns with datatype int/date, add to arrays
            for (var key in columns) {
                var obj = columns[key];
                switch (obj.type) {
                    //INTEGER
                    case 1:
                        //add current field to array for data to be cast to new type
                        intFields.push(obj.id);
                        break;
                    //SINGLE DOUBLE
                    case 2: case 3:
                        //set locale number formatter
                        obj.formatter = function (object) {
                            //perform format if the field isn't empty
                            if (object) {
                                return localeNumber.format(object);
                            } else {
                                return object;
                            }
                        };
                        break;
                    //DATE
                    case 5:
                        //add current field to array for data to be cast to new type
                        dateFields.push(obj.id);
                        //set column date formatter
                        obj.formatter = function (object) {
                            //perform format if the field isn't empty
                            if (object) {
                                return locale.format(new Date(object), { selector: "date and time", formatLength: "short" });
                            } else {
                                return object;
                            }                            
                        };
                        break;
                        //STRING (4)
                    default:
                        //leave string
                        break;
                }
            }
            //cast field to new type using array of valid columns
            arrayUtil.forEach(rows, function (item, index) {
                //format int
                arrayUtil.forEach(intFields, function (intItem, index) {
                    item[intItem] = parseInt(item[intItem]);
                });
                //format date
                arrayUtil.forEach(dateFields, function (dateItem, index) {
                    if (item[dateItem]) {
                        item[dateItem] = new Date(item[dateItem]);
                    }
                });
            });

            this.dataGrid.set("columns", columns);
            this.dataGrid.set("store", new Memory({ data: rows, idProperty: idProperty }));
            this.resizeGrid();
        },


        resizeGrid: function() {
            this.gridContainer.style.height = this.grid.style.height.split("px")[0] - 43 + "px";
        },

        resetGridData: function (rows) {
            this.dataGrid.set("store", new Memory({ data: rows }));
        },

        filterGrid: function (data, idProperty) {
            var self = lang.hitch(this);
            if (data.length > 0) {
                self.dataGrid.set("query", function (item) {
                    return (arrayUtil.indexOf(data, item.idProperty) > -1);
                });
            } else {
                self.dataGrid.set("query", {});
            }
        }
    
    });
});