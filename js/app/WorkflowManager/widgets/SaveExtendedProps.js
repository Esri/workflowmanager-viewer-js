define([
    "dojo/topic",
    "dojo/dom",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./SaveExtendedProps/SaveExtendedProps.html",
    "dojo/i18n!./SaveExtendedProps/nls/Strings",
    "app/WorkflowManager/config/Topics",

    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/string",
    "dojo/dom-style",
    "dijit/registry",

    "dijit/form/Button",
    "dijit/Dialog"
],

function (
    topic, dom, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n, appTopics,
    lang, connect, parser, query, on, string, domStyle, registry,
    Button, Dialog) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: true,

        //i18n
        i18n_SaveProperties: i18n.saveProperties,
        i18n_SavePrompt: i18n.savePrompt,

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);

            this.saveExtendedPropsDialog.startup();

            this.saveExtendedPropsDialog.set("title", i18n.saveProperties);
            this.saveExtendedPropsDialog.set("style", "width: 600px;");
            //this.savePropsDialog.onHide(this.controller.clearProps());

            this.saveExtendedPropsDialog.show();

            // Clear aoi button
            this.confirmSaveButton = new Button({
                label: i18n.confirmSave,
                name: "confirmSaveButton",
                "class": "dojo-btn-success",
                onClick: lang.hitch(this, function () {
                    this.saveProps();
                    this.closeDialog();
                })
            }, this.confirmSave);
            this.confirmSaveButton.startup();

            // Dismiss dialog button
            this.dismissDialogButton = new Button({
                label: i18n.declineSave,
                name: "dismissDialogButton",
                "class": "dojo-btn-danger",
                onClick: lang.hitch(this, function () {
                    this.closeDialog();
                })
            }, this.dismissDialog);
            this.dismissDialogButton.startup();

            this.saveExtendedPropsDialog.on("hide", this.closeDialog);
        },

        initUI: function () {

        },

        saveProps: function () {
            //save props
            this.controller.updateRecords();
        },

        closeDialog: function () {
            //reset changes made var in props
            this.controller.changesMade = false;
            this.saveExtendedPropsDialog.hide();
            //this.controller.clearProps();
            topic.publish("Properties/SaveDialog/Continue");
        }

    });
});
