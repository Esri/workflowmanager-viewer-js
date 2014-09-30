define([
    "dojo/topic",
    "dojo/dom",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/History.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/string",
    "dojo/dom-style",
    "dojo/date/locale",
    "dijit/registry",

    "dojo/store/Memory",

    "dgrid/OnDemandGrid",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Selection",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/extensions/Pagination",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button",
    "dijit/form/DropDownButton"
    ],

function (
    topic, dom, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n, appTopics,
    lang, connect, parser, query, on, string, domStyle, locale, registry,
    Memory,
    OnDemandGrid, DijitRegistry, Selection, treeGrid, editor, Pagination, ColumnHider, ColumnResizer,
    FilteringSelect, TextBox, Textarea, Button, DropDownButton) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
        i18n_JobName: i18n.properties.jobName,
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_EnterMessage: i18n.history.enterComment,

        dataGrid: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);
            console.log("History started");

            // job history textArea
            this.createHistoryTextarea = new Textarea({
                placeHolder: i18n.common.loading,
                id: "createHistoryTextarea",
                name: "createHistoryTextarea",
                style: "width: 400px; min-height: 100px; max-height:100px;",
                disabled: true
            }, this.historyTextarea);
            this.createHistoryTextarea.startup();

            // Save history button
            this.historySaveButton = new Button({
                label: i18n.history.saveComment,
                id: "historySaveButton",
                name: "historySaveButton",
                style: "width:160px;",
                "class": "dojo-btn-success",
                disabled: true,
                onClick: lang.hitch(this, function () {
                    this.saveButtonClicked();
                })
            }, this.btnSaveHistory);
            this.historySaveButton.startup();

            on(this.historyForm, "submit", lang.hitch(this, function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log("FORM SUBMITTED");
                self.saveButtonClicked();
            }));

            this.initUI();
        },

        initUI: function () {
            var columns = {
                type: {
                    label: i18n.history.activityType
                },
                user: {
                    label: i18n.history.user
                },
                date: {
                    label: i18n.history.date,
                    formatter: function(object) {
                        return locale.format(object, { selector: "date and time", formatLength: "short" });
                    }
                },
                message: {
                    label: i18n.history.message
                }
            };

            var CustomGrid = declare([OnDemandGrid, DijitRegistry, Selection, ColumnHider, ColumnResizer]);
            this.historyGrid = new CustomGrid({
                selectionMode: "none",
                loadingMessage: i18n.common.loading,
                noDataMessage: i18n.history.noActivityForThisJob,
                columns: columns
            }, this.gridContainer);
            this.historyGrid.startup();
        },

        setGridData: function (rows) {
            var self = lang.hitch(this);
            this.historyGrid.set("store", new Memory({ data: rows, idProperty: "date" }));
            this.historyGrid.set("sort", [{ attribute: "date", descending: true }]);

            // Clear content
            self.createHistoryTextarea.set("value", "");
        },

        commentAddedSuccess: function () {
            var self = lang.hitch(this);
            self.createHistoryTextarea.set("value", "");
        },

        saveButtonClicked: function () {
            console.log("History save button clicked with value: " + this.createHistoryTextarea.value);
            topic.publish(appTopics.manager.logAction, this, { value: this.createHistoryTextarea.value, errorContainer: this.errorContainer });
        },

        setEditable: function (isEditable) {
            if (isEditable) {
                // editable
                this.createHistoryTextarea.set("disabled", false);
                this.historySaveButton.set("disabled", false);
            } else {
                // not editable
                this.createHistoryTextarea.set("disabled", true);
                this.historySaveButton.set("disabled", true);
            }
        }
    });
});