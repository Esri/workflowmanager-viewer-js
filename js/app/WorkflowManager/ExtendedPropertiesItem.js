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
    lang, connect, arrayUtil, parser, query, on, domStyle, Memory, registry,
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
            self.index = Date.now();

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
                    topic.publish(appTopics.extendedProperties.getFieldValues, this, { tableName: self.tableName, field: self.name });
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
                this.setRequired();
            }

           
        },

        setResponse: function (response) {
            //get the data for drop down lists
            //convert to data store
            var store = [];
            arrayUtil.forEach(response, function (data, index) {
                store.push({ name: data.description, id: data.value})
            });
            this.stateStore = new Memory({ data: store });

            if (this.data != null) {
                this.item = this.stateStore.get(this.data);
            } else {
                this.item = null;
            }

            this.populateComboField();
            this.setRequired();
        },

        setRequired: function () {
            // toggle the required asterisk
            var field = this.field;
            var data = field.get('value');
            if (this.required) {
                this.fieldRequired.style.display = "";
            } else {
                this.fieldRequired.style.display = "none";
            }
        },

        setHighlight: function () {
            //mostly for handling required fields, invalid fields generally handle themselves
            var field = this.field;
            var data = field.get('value');
            if (((data == null || data == "") && this.required) || this.field.state == "Error") {
                this.field.set('state', "Error");
            } else {
                this.field.set('state', "");
            }
        },

        populateValidationTextBox: function (regex) {
            //make a textbox that validates the contents
            //also allows for required fields to be marked when empty
            var self = lang.hitch(this);
            this.field = new ValidationTextBox({
                id: self.tableName + self.index,
                value: this.data,
                regExp: regex,
                disabled: !self.update || !self.editable,
                invalidMessage: self.i18n_InvalidMessage,
                style: "float: left; margin-right: 5px",
                onChange: function () {
                    self.changed = true;
                    wholeText.set('label', self.field.get('value'));
                    topic.publish(appTopics.extendedProperties.enableButton, this, {});
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
            }, this.fieldValue);

            var wholeText = new Tooltip({
                id: "tooltip" + self.index,
                connectId: [self.tableName + self.index],
                label: self.data,
                position: ["below"]
            });
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
                value: this.data,
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
            this.date = (this.data !== null) ? new Date(this.data) : null;
            this.field = new DateTextBox({
                id: self.tableName + self.index,
                disabled: !self.update || !self.editable,
                style: "float: left",
                value: this.date,
                onChange: function () {
                    self.changed = true;
                    topic.publish(appTopics.extendedProperties.enableButton, this, {});
                },
                onFocus: function () {
                    self.setHighlight();
                },
                onBlur: function () {
                    self.setHighlight();
                }
            }, this.fieldValue);
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
                default:
                    data = field.get('value');
            }
            var state = field.state;
            //flagging
            if (((data == null || data == "") && this.required) || state == "Error") {
                this.setHighlight();
                if (!(data === undefined) && (data == null || data == "") && this.required) {
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
                            return data.id;
                        default:
                            return data;
                    }
                } else {
                    return null;
                }
            }
        }
    });
});