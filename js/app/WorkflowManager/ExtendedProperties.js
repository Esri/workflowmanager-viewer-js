define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/ExtendedProperties.html",
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
    "dojo/dom-class",
    
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",

    "./widgets/SaveExtendedProps",
    "app/WorkflowManager/ExtendedPropertiesTableList",
    "app/WorkflowManager/config/Topics",
    ],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
    template, i18n,
    lang, connect, arrayUtil, parser, query, on, domStyle, dom, registry, domClass,
    ContentPane, FilteringSelect, TextBox, Button, DropDownButton,
    SaveExtendedProps, ExtendedProperitesTableList, appTopics) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: false,

        i18n_Update: i18n.common.update,
        i18n_NoExtendedProperties: i18n.extendedProperties.noProperties,
        i18n_Required: i18n.extendedProperties.required,

        //additional variables
        recordList: null,
        
        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("Extended Properties started");
            var self = lang.hitch(this);
            
            topic.subscribe(appTopics.extendedProperties.enableButton, function (sender, args) {
                self.btnUpdateRecords.set('disabled', false);
                self.changesMade = true;
            });

            // set up content pane to hold the tables
            this.tableList = new ContentPane({
                id: "extendedPropertiesTableListContianer",
                content: new ExtendedProperitesTableList
            }).placeAt(this.extendedPropertiesTableListAttach);
            this.tableList.content.startup();

            this.btnUpdateRecords = new Button({
                id: "upload",
                label: self.i18n_Update,
                disabled: true,
                "class": "dojo-btn-success",
                onClick: function () {
                    self.updateRecords();
                }
            }, this.btnUpdateRecordsAttach);
        },

        setEditable: function (editable) {
            this.editable = editable;
        },

        populateExtendedProperties: function (containers) {
            var self = lang.hitch(this);
            //resizing the contentPane dynamically
            var contentPane = dom.byId("tabExtendedProperties");
            var tableListContainer = dom.byId("extendedPropertiesTableListContianer");
            tableListContainer.style.maxHeight = contentPane.style.height.split("px")[0] - 80 + "px";

            self.btnUpdateRecords.set('disabled', true);
            self.buttonContainer.style.display = "none";
            self.textContainer.style.display = "";

            if (containers.length > 0) {
                self.buttonContainer.style.display = "";
                self.textContainer.style.display = "none";
                //if there are conatiners hand them off to tableList
                this.tableList.content.populateExtendedPropertiesTables(containers, this.editable);
            }
        },

        closingExtendedProps: function () {
            //called when the jobDialog is closed or if tabcontainer selectedChild oldVal == tabProperties

            //test if updateBtn is active
            if (this.changesMade) {
                //launch save widget
                var saveWidget = new SaveExtendedProps({ controller: this });
                saveWidget.startup();
            } else {
                //clear prop fields
                //this.clearProps();
                topic.publish("Properties/SaveDialog/Continue");
            }
        },

        updateRecords: function () {
            var self = lang.hitch(this);
            this.tableList.content.updateRecords();
            self.btnUpdateRecords.set('disabled', true);
            this.changesMade = false;
        },

        clearProperties: function () {
            this.tableList.content.clearTable();
        }
    });
});