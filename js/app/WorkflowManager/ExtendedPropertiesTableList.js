define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./templates/ExtendedPropertiesTableList.html",
    "dojo/i18n!./nls/Strings",

    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom",
    "dijit/registry",

    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",

    "app/WorkflowManager/Alert",
    "app/WorkflowManager/ExtendedPropertiesRecord",
    "app/WorkflowManager/config/Topics",
],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n,
    lang, connect, arrayUtil, parser, query, on, domStyle, dom, registry,
    FilteringSelect, TextBox, Button, DropDownButton,
    Alert, ExtendedProperitesRecord, appTopics) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: false,

        i18n_Update: i18n.common.update,
        i18n_NoExtendedProperties: i18n.extendedProperties.noProperties,

        //additional variables
        recordList: null,
        errors: {},

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("Extended Properties Table List started");
            var self = lang.hitch(this);
            this.validUpdate = true;

            //start looking for invalid updates
            topic.subscribe(appTopics.extendedProperties.invalidUpdate, function (sender, args) {
                if (args.missingField) {
                    //there is a missing field
                    self.errors.missingField = true;
                } else if (args.invalidField) {
                    //there is an invalid field
                    self.errors.invalidField = true;
                }
                self.validUpdate = false;
            });
        },

        setPrivileges: function (canManageProperties) {
            this.canManageProperties = canManageProperties;
        },

        populateExtendedPropertiesTables: function (containers, editable) {
            //split the tables and throw them into another function
            //like attachments
            var self = lang.hitch(this);
            self.recordList = [];
            arrayUtil.forEach(containers, function (data, index) {
                if (data && data.relationshipType == 1) {
                    var records = data.records[0];
                    if (records && records.recordValues && records.recordValues.length > 0) {
                        // order records based on displayOrder field
                        records.recordValues = records.recordValues.sort(function(r1, r2) {
                            return r1.displayOrder - r2.displayOrder;
                        });
                    }
                    self.addExtendedPropertiesRecord({ alias: data.tableAlias, record: records, tableName: data.tableName, editable: editable });
                }
            });
        },

        addExtendedPropertiesRecord: function (recordData) {
            //make a new record thingy and add it as a child to the div
            var extendedPropertiesRecord = new ExtendedProperitesRecord(recordData);
            extendedPropertiesRecord.placeAt(this.extendedPropertiesList);
            extendedPropertiesRecord.startup();
            this.recordList.push(extendedPropertiesRecord);
        },

        updateRecords: function () {
            var self = lang.hitch(this);
            //clear previous update list, if there was one
            self.updateList = [];
            arrayUtil.forEach(this.recordList, function (data, index) {
                var record = data.getUpdateTable();
                if (record) {
                    //if there was a record to update add it to the list
                    //also mkae the properties element into a JSON string
                    record.properties = JSON.stringify(record.properties);
                    self.updateList.push(record);
                }
            });
            if (self.validUpdate) {
                //if the update is valid then perform the update
                arrayUtil.forEach(this.updateList, function (data, index) {
                    topic.publish(appTopics.extendedProperties.updateExtendedProperties, this, { record: data });
                });
            } else {
                self.showErrors();
            }
            //reset flags
            self.validUpdate = true;
            self.errors = {};
        },

        showErrors: function() {
            var errMsg = i18n.error.errorUpdatingExtendedProperties;
            if (this.errors.missingField) {
                errMsg += "<br>-" + i18n.error.errorMissingFields;
            }
            if (this.errors.invalidField) {
                errMsg += "<br>-" + i18n.error.errorInvalidFields;
            }
            var error = "";
            Alert.show(i18n.error.title, errMsg, error);
        },


        clearTable: function () {
            if (this.extendedPropertiesList.children.length > 0) {
                arrayUtil.forEach(this.recordList, function (data, index) {
                    if (data) {
                        data.clearRecord();
                    }
                });
                dojo.empty(this.extendedPropertiesList);
            }
        }

    });
});