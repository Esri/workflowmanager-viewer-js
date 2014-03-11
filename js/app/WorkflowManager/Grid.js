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
		topic, dom, domStyle, domConstruct, domClass, locale, localeNumber,
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
		
		dataGrid: null,

		postCreate: function() {
			this.inherited(arguments);
		},
		
		startup: function() {
			this.initUI();
			console.log("Grid started");	
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
			
			var self = lang.hitch(this);
			var selectedRow;

			// multiple selection
			this.dataGrid.on("dgrid-select", function (event) {
				self.selectedJobIds = Object.keys(self.dataGrid.selection);

				//only execute if row selected was not already selected
				//prevents excessive calls with double click event
				if (!self.rows || self.rows[0].id != event.rows[0].id) {
					// Get the rows that were just selected
					self.rows = event.rows;
					if (self.rows.length == 1) {
						var row = self.rows[0];
						self.selectedRow = row;
						topic.publish(appTopics.grid.rowSelected, self, { selectedId: row.id, selectedFromGrid: event.grid.focused });
					}
				}
			});
			
			this.dataGrid.on("dgrid-deselect", function(event){
				//disable map buttons
				topic.publish(appTopics.map.draw.deactivateAll, null);

				//clear graphics on deselect
				topic.publish(appTopics.map.clearGraphics, null);
			});

			this.dataGrid.on(".dgrid-row:dblclick", function (event) {
				topic.publish(appTopics.grid.jobDialog, this, { event: event, selectedId: self.selectedRow.id });
			});
			
			this.dataGrid.startup();
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
				        }
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
						}
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
				})
				//format date
				arrayUtil.forEach(dateFields, function (dateItem, index) {
					if (item[dateItem]) {
						item[dateItem] = new Date(item[dateItem]);
					}
				})
			});

			this.dataGrid.set("columns", columns);
			this.dataGrid.set("store", new Memory({ data: rows, idProperty: idProperty }));
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