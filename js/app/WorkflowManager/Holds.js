define([
    "dojo/topic",
    "dojo/dom",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./templates/Holds.html",
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
    "dijit/form/DropDownButton",
    "dijit/form/Form"
],

function (
    topic, dom, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n, appTopics,
    lang, connect, parser, query, on, string, domStyle, locale, registry,
    Memory,
    OnDemandGrid, DijitRegistry, Selection, treeGrid, editor, Pagination, ColumnHider, ColumnResizer,
    FilteringSelect, TextBox, Textarea, Button, DropDownButton, Form) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: true,

        i18n_JobName: i18n.properties.jobName,
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_Comment: i18n.holds.comment,
        i18n_HoldType: i18n.holds.holdType,

        dataGrid: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("Holds started");
            var self = lang.hitch(this);

            // hold type filtering select
            this.holdTypeFilteringSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "holdTypeFilteringSelect",
                name: "holdTypeFilteringSelect",
                required: false,
                style: "width:200px;",
                disabled: true
            }, this.holdType);
            this.holdTypeFilteringSelect.startup();

            // new hold textarea
            this.createHoldTextarea = new Textarea({
                placeHolder: i18n.common.loading,
                id: "createHoldTextarea",
                name: "createHoldTextarea",
                style: "width: 400px; min-height: 100px; max-height:100px;",
                disabled: true
            }, this.holdTextarea);
            this.createHoldTextarea.startup();

            // Save hold button
            this.holdSaveButton = new Button({
                label: i18n.holds.saveHold,
                id: "holdSaveButton",
                name: "holdSaveButton",
                style: "width:160px;",
                "class": "dojo-btn-success",
                disabled: true,
                onClick: lang.hitch(this, function () {
                    this.saveButtonClicked();
                })
            }, this.btnSaveHold);
            this.holdSaveButton.startup();

            on(this.holdsForm, "submit", lang.hitch(this, function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log("FORM SUBMITTED");
                self.saveButtonClicked();
            }));

            this.initUI();
        },

        initUI: function () {
            var columns = {
                id: {
                    label: i18n.holds.id
                },
                typeName: {
                    label: i18n.holds.type
                },
                holdComments: {
                    label: i18n.holds.comment
                },
                holdDate: {
                    label: i18n.holds.holdDate,
                    formatter: function (object) {
                        return locale.format(object, { selector: "date and time", formatLength: "short" });
                    }
                },
                releasedBy: {
                    label: i18n.holds.releasedBy
                }
            };

            var CustomGrid = declare([OnDemandGrid, DijitRegistry, Selection, ColumnHider, ColumnResizer]);
            this.holdsGrid = new CustomGrid({
                selectionMode: "none",
                loadingMessage: i18n.common.loading,
                noDataMessage: i18n.holds.noHoldsForThisJob,
                columns: columns
            }, this.gridContainer);
            this.holdsGrid.startup();
        },

        setGridData: function (rows) {
            var self = lang.hitch(this);
            this.holdsGrid.set("store", new Memory({ data: rows, idProperty: "id" }));
            this.holdsGrid.set("sort", [{ attribute: "holdDate", descending: true }]);
        },

        populateDropdowns: function (args) {
            this.holdTypeFilteringSelect.set("store", new Memory({ data: args.holdTypes, idProperty: "id" }));
            this.holdTypeFilteringSelect.set("placeHolder", "");
        },

        holdAddedSuccess: function () {
            var self = lang.hitch(this);
            this.holdTypeFilteringSelect.set("value", "");
            this.createHoldTextarea.set("value", "");
        },
        
        setEditable: function (isEditable) {
            if (isEditable) {
                // editable
                this.holdTypeFilteringSelect.set("disabled", false);
                this.createHoldTextarea.set("disabled", false);
                this.holdSaveButton.set("disabled", false);
            } else {
                // not editable
                this.holdTypeFilteringSelect.set("disabled", true);
                this.createHoldTextarea.set("disabled", true);
                this.holdSaveButton.set("disabled", true);
            }
        },
                
        saveButtonClicked: function () {
            console.log("Hold save button clicked with value: " + this.createHoldTextarea.value + " type: " + this.holdTypeFilteringSelect.value);
            topic.publish(appTopics.holds.addHold, this, { holdType: this.holdTypeFilteringSelect.value, comment: this.createHoldTextarea.value });
        }
    });
});