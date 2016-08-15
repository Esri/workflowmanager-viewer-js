define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/date/locale",

    "dojo/text!./templates/ExtendedPropertiesItem.html",
    "dojo/i18n!./nls/Strings",

    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/store/Memory",
    "dijit/registry",

    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/form/DateTextBox",
    "dijit/form/ComboBox",
    "dijit/form/ValidationTextBox",
    "dijit/Tooltip",

    "app/WorkflowManager/config/Topics",
    "workflowmanager/Enum",

],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, locale,
    template, i18n,
    lang, connect, arrayUtil, parser, query, on, domConstruct, dom, domStyle, Memory, registry,
    FilteringSelect, TextBox, Button, DropDownButton, DateTextBox, ComboBox, ValidationTextBox, Tooltip,
    appTopics, Enum) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: false,


        i18n_InvalidMessage: i18n.extendedProperties.invalid,

        //additional variables
        changed: null,
        integerRegex: "0|[-+]?[1-9](\\d{0,2}([, ]\\d{3})*|\\d*)",
        decimalNumberRegex: "(0|[-+]?[1-9](\\d{0,2}([, ]\\d{3})*|\\d*))([.,]\\d+)?",
        stringRegex: ".*",
        GUIDRegex: "[{][a-zA-Z0-9]{8}[-]([a-zA-Z0-9]{4}[-]){3}[a-zA-Z0-9]{12}[}]",

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);
            console.log("Extended Properties Item started");
            self.index = self.generateRandomIndex();

            self.fieldTitle.innerHTML = self.alias;

            switch (this.displayType) {
                //TODO: Add display to warn of unsupported display types all good otherwise
                case Enum.ExtendedPropertyDisplayType.DATE:
                    //date display
                    self.populateDateField();
                    break;
                case Enum.ExtendedPropertyDisplayType.DOMAIN:
                case Enum.ExtendedPropertyDisplayType.TABLE_LIST:
                    //combo display
                    topic.publish(appTopics.extendedProperties.getFieldValues, self, { tableName: self.tableName, field: self.name, callback: self.fieldValuesResponse });
                    break;
                case Enum.ExtendedPropertyDisplayType.MULTI_LEVEL_TABLE_LIST:
                    //multi combo display
                    this.fieldError.style.height = "auto";
                    self.fieldTitle.innerHTML += " (" + self.tableField.tableListStoreField + ")";
                    topic.publish(appTopics.extendedProperties.getMultiListValues, self, { field: self.tableField, callback: self.multiFieldValuesResponse });
                    break;
                case Enum.ExtendedPropertyDisplayType.FILE:
                case Enum.ExtendedPropertyDisplayType.FOLDER:
                case Enum.ExtendedPropertyDisplayType.GEO_FILE:
                    //text display
                    self.populateTextField();
                    self.field.set('readOnly', true);
                    break;
                default:
                    //text display
                    switch (this.dataType) {
                        case Enum.FieldType.SMALL_INTEGER:
                        case Enum.FieldType.INTEGER:
                            self.populateValidationTextBox(self.integerRegex);
                            break;
                        case Enum.FieldType.SINGLE:
                        case Enum.FieldType.DOUBLE:
                            self.populateValidationTextBox(self.decimalNumberRegex);
                            break;
                        case Enum.FieldType.GUID:
                            self.populateValidationTextBox(self.GUIDRegex);
                            break;
                        default:
                            self.populateValidationTextBox(self.stringRegex);
                            break;
                    }
            }

            if (self.field) {
                self.setRequired();
            }

           
        },

        // first multi level response
        multiFieldValuesResponse: function (self, response) {
            self.curSelectedValues = response;
            self.populateMultiLevelList();
            self.setRequired();

            //cascade populating the stores
            //// if a default value is set there will be a response
            //// if so run through the response and populate the fields
            //// otherwise just set up the first one and disable the rest
            for (var i = 0; i < self.curSelectedValues.length; i++)
            {
                topic.publish(appTopics.extendedProperties.getMultiListStores, self, { field: self.tableField, curSelectedValues: self.curSelectedValues.slice(0, i), storeLevel: i, callback: self.setMultiListStores });
            }
            if (self.curSelectedValues.length == 0)
                topic.publish(appTopics.extendedProperties.getMultiListStores, self, { field: self.tableField, curSelectedValues: self.curSelectedValues, storeLevel: i, callback: self.setMultiCurrentStore });

        },

        // second multi level response
        setMultiListStores: function (self, response, storeLevel) {
            var store = [];
            arrayUtil.forEach(response, function (data, index) {
                store.push({ name: data.description, id: data.value });
            });
            var ListStore = new Memory({ data: store });
            var ListItem;
            if (storeLevel < self.levelHeight - 1)
                var itemID = self.curSelectedValues[storeLevel];
            else
                var itemID = self.data;
            if (self.curSelectedValues[storeLevel] != undefined && self.curSelectedValues[storeLevel] != null) {
                ListItem = ListStore.get(itemID);
            } else {
                ListItem = null;
            }
            self.setup[storeLevel] = true;
            self.fields[storeLevel].set('store', ListStore);
            self.fields[storeLevel].set('item', ListItem);
        },

        cascadeMultiList: function (index) {
            var self = lang.hitch(this);
            var newItems = self.curSelectedValues.slice(0, index);
            var item = self.fields[index].get('item');
            if (item) {
                newItems[index] = item.name;
                index++;
            }
            self.curSelectedValues = newItems;
            if (index < self.levelHeight)
                topic.publish(appTopics.extendedProperties.getMultiListStores, self, {
                    field: self.tableField, curSelectedValues: newItems, storeLevel: index, callback: self.setMultiCurrentStore
                });
        },

        setMultiCurrentStore: function (self, response, index) {
            var store = [];
            arrayUtil.forEach(response, function (data, index) {
                store.push({ name: data.description, id: data.value });
            });
            var ListStore = new Memory({ data: store });
            self.setup[index] = true;
            self.fields[index].set('disabled', false);
            self.fields[index].set('store', ListStore);
            if (response.length == 1) {
                var listItem = ListStore.get(response[0].value);
                self.setup[index] = false;
                self.fields[index].set('item', listItem);
            } else {
                self.fields[index].set('item', null);
                for (var i = index + 1; i < self.levelHeight; i++) {
                    self.setup[i] = true;
                    self.fields[i].set('disabled', true);
                    self.fields[i].set('item', null);
                }
                self.setHighlight();
                if (response.length == 1) {
                    var listItem = ListStore.get(response[0].value);
                    self.setup[index] = false;
                    self.fields[index].set('item', listItem);
                }
            }
        },

        // combo response
        fieldValuesResponse: function (self, response) {
            //get the data for drop down lists
            //convert to data store
            var store = [];
            arrayUtil.forEach(response, function (data, index) {
                store.push({ name: data.description, id: data.value});
            });
            self.stateStore = new Memory({ data: store });

            if (self.data != null) {
                self.item = self.stateStore.get(self.data);
            } else {
                self.item = null;
            }

            self.populateComboField();
            self.setRequired();
        },

        setRequired: function (index) {
            // toggle the required asterisk
            var field = this.field;
            var data = field.get('value');
            if (this.isRequiredField()) {
                this.fieldRequired.style.display = "";
            } else {
                this.fieldRequired.style.display = "none";
            }
        },

        setHighlight: function () {
            //mostly for handling required fields, invalid fields generally handle themselves
           
            var field = this.field;
            var data = field.get('value');
            if (((data == null || data == "") && this.isRequiredField()) || field.state == "Error") {
                field.set('state', "Error");
            } else {
                field.set('state', "");
            }
        },

        populateValidationTextBox: function (regex) {
            //make a textbox that validates the contents
            //also allows for required fields to be marked when empty
            var self = lang.hitch(this);
            self.field = new ValidationTextBox({
                id: self.tableName + self.index,
                value: self.data,
                regExp: regex,
                disabled: !self.update || !self.editable,
                invalidMessage: self.i18n_InvalidMessage,
                style: "float: left; margin-right: 5px",
                onChange: function () {
                    self.changed = true;
                    wholeText.set('label', self.field.get('value'));
                    topic.publish(appTopics.extendedProperties.enableButton, self, {});
                },
                onFocus: function () {
                    if (self.field.state == "Error") {
                        //stops the tooltip from showing when the invalid tooltip is showing
                        wholeText.showDelay = 99999;
                    } else {
                       wholeText.showDelay = 400;
                    }
                    self.setHighlight();
                },
                onBlur: function () {
                    self.setHighlight();
                }
            }, self.fieldValue);

            var wholeText = new Tooltip({
                id: "tooltip" + self.index,
                connectId: [self.tableName + self.index],
                label: self.data,
                position: ["below"]
            });
        },

        populateMultiLevelList: function () {
            var self = lang.hitch(this);

            self.displayFields = self.tableField.tableListDisplayField.split(",");
            self.levelHeight = self.displayFields.length;
            self.setup = [];
            self.fields = [];
            var input = [self.fieldValue];
            self.multiLevel1.style.display = "";
            self.multiLevel1.innerHTML = self.displayFields[0];

            for (var i = 1; i < self.levelHeight; i++)
            {
                var span = domConstruct.create("span", {});
                domConstruct.place(span, self.fieldError, i + 1);

                var label = domConstruct.create("label", { "class": "extendedProperty-item-multi-label", innerHTML: self.displayFields[i] });
                domConstruct.place(label, span, 0);
                var innerSpan = domConstruct.create("span", {});
                domConstruct.place(innerSpan, span, 1);
                input[i] = domConstruct.create("input", {});
                domConstruct.place(input[i], innerSpan, 0);
                domConstruct.place(self.fieldRequired, innerSpan, 1);
            }

            for (var i = 0; i < this.levelHeight; i++) {
                self.fields[i] = new ComboBox({
                    index: i,
                    id: self.tableName + self.index + i,
                    item: self.item,
                    store: self.stateStore,
                    disabled: !self.update || !self.editable,
                    searchAttr: "name",
                    "class": "",
                    style: "float: left",
                    onChange: function () {
                        if (!self.setup[this.index]) {
                            self.changed = true;
                            self.cascadeMultiList(this.index);
                            topic.publish(appTopics.extendedProperties.enableButton, this, {});
                        } else {
                            self.setup[this.index] = false;
                        }
                    },
                    // allows for the error highlight to be constantly updated
                    onFocus: function () {
                        self.setHighlight();
                        self.setup[this.index] = false;
                    },
                    onBlur: function () {
                        self.setHighlight();
                        self.setup[this.index] = false;
                    }
                }, input[i]);
            }


            self.field = self.fields[self.fields.length - 1];
        },

        populateComboField: function () {
            //makes a combo box for dropdown lists
            //called after set response, this way the update btn is not triggered by accident
            var self = lang.hitch(this);
            this.field = new ComboBox({
                id: self.tableName + self.index,
                item: self.item,
                store: self.stateStore,
                disabled: !self.update || !self.editable,
                searchAttr: "name",
                "class":"",
                style: "float: left",
                onChange: function () {
                    self.changed = true;
                    topic.publish(appTopics.extendedProperties.enableButton, this, {});
                },
                // allows for the error highlight to be constantly updated
                onFocus: function () {
                    self.setHighlight();
                },
                onBlur: function () {
                    self.setHighlight();
                }
            }, this.fieldValue);
        },

        populateTextField: function () {
            //makes a standard text field, currently for file/folder/geodata
            var self = lang.hitch(this);
            this.field = new TextBox({
                id: self.tableName + self.index,
                disabled: !self.update || !self.editable,
                value: self.data,
                style: "float: left; margin-right: 5px",
                onChange: function () {
                    self.changed = true;
                    wholeText.set('label', self.field.get('value'));
                    topic.publish(appTopics.extendedProperties.enableButton, this, {});
                },
                onFocus: function () {
                    self.setHighlight();
                },
                onBlur: function () {
                    self.setHighlight();
                }
            }, this.fieldValue);

            var wholeText = new Tooltip({
                id: "tooltip" + self.index,
                connectId: [self.tableName + self.index],
                label: self.data,
                position: ["below"]
            });

        },

        populateDateField: function () {
            //makes a date box
            //is this localized?
            var self = lang.hitch(this);
            self.date = (self.data !== null) ? new Date(self.data) : null;
            self.field = new DateTextBox({
                id: self.tableName + self.index,
                disabled: !self.update || !self.editable,
                style: "float: left",
                value: this.date,
                onChange: function () {
                    self.changed = true;
                    topic.publish(appTopics.extendedProperties.enableButton, self, {});
                },
                onFocus: function () {
                    self.setHighlight();
                },
                onBlur: function () {
                    self.setHighlight();
                }
            }, self.fieldValue);
        },

        getUpdateItem: function () {
            //returns the data if its changed, null other wise
            //also handles required flagging and invalid flagging
            var field = this.field;
            var data;
            switch (this.displayType) {
                case Enum.ExtendedPropertyDisplayType.TABLE_LIST:
                case Enum.ExtendedPropertyDisplayType.DOMAIN:
                    data = field.get('item');
                    break;
                case Enum.ExtendedPropertyDisplayType.MULTI_LEVEL_TABLE_LIST:
                    data = field.get('item');
                    break;
                default:
                    data = field.get('value');
            }
            var state = field.state;
            //flagging
            if (((data == null || data == "") && this.isRequiredField()) || state == "Error") {
                this.setHighlight();
                if (!(data === undefined) && (data == null || data == "") && this.isRequiredField()) {
                    topic.publish(appTopics.extendedProperties.invalidUpdate, this, { missingField: true });
                } else {
                    topic.publish(appTopics.extendedProperties.invalidUpdate, this, { invalidField: true });
                }
                return null;
            } else {
                //if not missing and valid then check if its changed
                //naive check, only matters if its been changed at all, not if its the same value as before
                if (this.changed) {
                    switch (this.displayType) {
                        case Enum.ExtendedPropertyDisplayType.DATE:
                            return (data !== null) ? data.getTime() : null;
                        case Enum.ExtendedPropertyDisplayType.TABLE_LIST:
                        case Enum.ExtendedPropertyDisplayType.DOMAIN:
                        case Enum.ExtendedPropertyDisplayType.MULTI_LEVEL_TABLE_LIST:
                            return (data !== null) ? data.id : "";
                        default:
                            return data;
                    }
                } else {
                    return null;
                }
            }
        },
        
        isRequiredField : function() {
            // The field is only required if it's not an unsupported type (file, folder, geofile)
            return this.required && this.displayType != Enum.ExtendedPropertyDisplayType.FILE 
                && this.displayType != Enum.ExtendedPropertyDisplayType.FOLDER 
                && this.displayType != Enum.ExtendedPropertyDisplayType.GEO_FILE;
        },
        
        generateRandomIndex : function() {
            // generate a random number from 1 to specified max value (1000000000000)
            return Math.floor((Math.random() * 1000000000000) + 1);
        }
    });
});