define([
    "dojo/topic",
    "dojo/dom",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/dom-class",

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
    // dstore memory needed by dgrid
    "dstore/Memory",

    "dgrid/OnDemandGrid",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Selection",
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
    topic, dom, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, domClass,
    template, i18n, appTopics,
    lang, connect, parser, query, on, string, domStyle, locale, registry,
    Memory, dstoreMemory,
    OnDemandGrid, DijitRegistry, Selection, Pagination, ColumnHider, ColumnResizer,
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
                style: "width:398px;",
                disabled: true,
                onChange: function () {
                    self.holdSubmitButton.set("disabled", false);
                }
            }, this.holdType);
            this.holdTypeFilteringSelect.startup();

            // new hold textarea
            this.createHoldTextarea = new Textarea({
                placeHolder: i18n.common.loading,
                id: "createHoldTextarea",
                name: "createHoldTextarea",
                "class" : "hold-add-text",
                //style: self.textareaStyleAdd,
                disabled: true
            }, this.holdTextarea);
            this.createHoldTextarea.startup();

            // Save hold button
            this.holdSaveButton = new Button({
                label: i18n.holds.saveHold,
                id: "holdSaveButton",
                name: "holdSaveButton",
                "class": "dojo-btn-info",
                disabled: true,
                onClick: lang.hitch(this, function () {
                    this.addButtonClicked();
                })
            }, this.btnSaveHold);
            this.holdSaveButton.startup();

            // Release Hold Button
            this.holdReleaseButton = new Button({
                label: i18n.holds.releaseHold,
                id: "holdReleaseButton",
                name: "holdReleaseButton",
                "class": "dojo-btn-info",
                disabled: true,
                onClick: lang.hitch(this, function () {
                    this.releaseButtonClicked();
                })
            }, this.btnReleaseHold);
            this.holdReleaseButton.startup();

            //  Submit Button
            this.holdSubmitButton = new Button({
                label: i18n.holds.releaseHold,
                id: "holdSubmitButton",
                name: "holdSubmitButton",
                "class": "dojo-btn-success",
                disabled: true,
                onClick: lang.hitch(this, function () {
                    this.saveButtonClicked();
                })
            }, this.submitBtn);
            this.holdSubmitButton.startup();

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
                        return locale.format(object, { selector: "date", formatLength: "long" });
                    }
                },
                releasedBy: {
                    label: i18n.holds.releasedBy
                },
                releaseComments: {
                    label: i18n.holds.releaseComments
                }
            };

            var CustomGrid = declare([OnDemandGrid, DijitRegistry, Selection, ColumnHider, ColumnResizer]);
            this.holdsGrid = new CustomGrid({
                selectionMode: "single",
                loadingMessage: i18n.common.loading,
                noDataMessage: i18n.holds.noHoldsForThisJob,
                columns: columns,
            }, this.gridContainer);
            this.holdsGrid.startup();
            this.holdsGrid.bodyNode.style.height = "250px";
            var self = lang.hitch(this);

            this.holdsGrid.on("dgrid-select", function (event) {
                self.resetView();

                if (event.rows[0].data.isActive)
                    self.enableButton();
                else
                    self.disableButton();

                //only execute if row selected was not already selected
                //prevents excessive calls with double click event
                if (!self.rows || self.rows[0].id != event.rows[0].id) {
                    // Get the rows that were just selected
                    self.rows = event.rows;
                }
            });

            this.holdsGrid.on("dgrid-deselect", function (event) {
                var selectedJobIds = Object.keys(self.holdsGrid.selection);
                self.resetView();

                if (selectedJobIds.length > 0) {
                    self.enableButton();
                } else {
                    self.disableButton();
                }
            });
        },

        setGridData: function (rows) {
            var self = lang.hitch(this);
            this.holdsGrid.set("collection", new dstoreMemory({ data: rows, idProperty: "id" }));
            this.holdsGrid.set("sort", [{ property: "holdDate", descending: true }]);
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
        
        //called everytime update holds is called
        //therefore every change to the grid resests the visibilty
        setEditable: function (isEditable) {
            this.resetView();
            this.isEditable = isEditable;
            if (isEditable) {
                // editable
                this.holdTypeFilteringSelect.set("disabled", false);
                this.createHoldTextarea.set("disabled", false);
                this.holdSaveButton.set("disabled", false);
                this.holdSubmitButton.set("disabled", false);
                //this.holdReleaseButton.set("disabled", false);
            } else {
                // not editable
                this.holdTypeFilteringSelect.set("disabled", true);
                this.createHoldTextarea.set("disabled", true);
                this.holdSaveButton.set("disabled", true);
                this.holdSubmitButton.set("disabled", true);
                //this.holdReleaseButton.set("disabled", true);
            }
        },
        
        addButtonClicked: function () {
            this.holdsGrid.clearSelection();
            this.disableButton();
            this.add = true;
            this.holdSubmitButton.set("disabled", true);
            this.holdSubmitButton.set("label", i18n.holds.add);
            this.holdComment.style.display = "";
            this.holdTypeDropDown.style.display = "";
            this.submitBtnContainer.style.display = "";
            domClass.remove("createHoldTextarea", "hold-release-text");
            domClass.add("createHoldTextarea", "hold-add-text");
        },

        releaseButtonClicked: function () {
            this.add = false;
            this.holdSubmitButton.set("disabled", false);
            this.holdSubmitButton.set("label", i18n.holds.release);
            this.holdTypeDropDown.style.display = "none";
            this.submitBtnContainer.style.display = "";
            this.holdComment.style.display = "";
            domClass.remove("createHoldTextarea", "hold-add-text");
            domClass.add("createHoldTextarea", "hold-release-text");
        },

        saveButtonClicked: function(){
            if(this.add)
            {
                console.log("Hold save button clicked with value: " + this.createHoldTextarea.value + " type: " + this.holdTypeFilteringSelect.value);
                topic.publish(appTopics.holds.addHold, this, { holdType: this.holdTypeFilteringSelect.value, comment: this.createHoldTextarea.value });
            }
            else
            {
                console.log("Hold release button clicked: " + this.rows[0].id);
                topic.publish(appTopics.holds.releaseHold, this, { holdId: this.rows[0].id, comment: this.createHoldTextarea.value });
            }
            this.resetView();
        },

        enableButton: function () {

            if(this.isEditable)
                this.holdReleaseButton.set("disabled", false);
        },

        disableButton: function () {
            this.holdReleaseButton.set("disabled", true);
        },

        resetView: function () {
            this.holdTypeDropDown.style.display = "none";
            this.holdComment.style.display = "none";
            this.submitBtnContainer.style.display = "none";
        }
    });
});