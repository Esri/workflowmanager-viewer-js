define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./templates/ExtendedPropertiesRecord.html",
    "dojo/i18n!./nls/Strings",

    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dijit/registry",

    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",

    "app/WorkflowManager/ExtendedPropertiesItem",
    "app/WorkflowManager/config/Topics",
    "dojo/topic"
],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n,
    lang, connect, arrayUtil, parser, query, on, domStyle, registry,
    FilteringSelect, TextBox, Button, DropDownButton,
    ExtendedProperitesItem, appTopics, topic) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: false,

        //additional variables
        itemList: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("Extended Properties Record started");
            var self = lang.hitch(this);

            this.tableTitle.innerHTML = this.alias;
            this.populateFieldList(this.record);
        },

        populateFieldList: function (record) {
            var self = lang.hitch(this);
            //just doing the alias and data
            //TODO: Display type and displaying the correct thing
            self.itemList = [];
            if (record) {
                arrayUtil.forEach(record.recordValues, function (data, index) {
                    if (data.userVisible) {
                        self.addExtendedPropertiesItem({ alias: data.alias, data: data.data, dataType: data.dataType, displayType: data.displayType, required: data.required, update: data.canUpdate, tableName: self.tableName, name: data.name, editable: self.editable});
                    } else {
                        self.itemList.push(null);
                    }
                });
            }
        },

        addExtendedPropertiesItem: function (itemData) {
            // add a new extended properties item
            var extendedPropertiesItem = new ExtendedProperitesItem(itemData);
            extendedPropertiesItem.placeAt(this.fieldList);
            this.itemList.push(extendedPropertiesItem);
            extendedPropertiesItem.startup();
        },

        getUpdateTable: function () {
            var self = lang.hitch(this);
            // grab and return the record fields
            if (!self.record) {
                return null;
            }
            var record = { recordId: self.record.id, properties: {}, tableName: self.tableName, length: 0 };
            arrayUtil.forEach(this.itemList, function (data, index) {
                if (data && self.record.recordValues[index].canUpdate) {
                    var item = data.getUpdateItem()
                    if (item != null) {
                        //if there is an item to update add it to the list
                        //use the field name as an index
                        record.length++;
                        record.properties[self.record.recordValues[index].name] = item;
                    }
                }
            });
            if (record.length > 0) {
                //if there is anything in the record then update.
                return record;
            } else {
                return null;
            }
        },

        clearRecord: function () {
            dojo.empty(this.fieldList);
        }

    });
});