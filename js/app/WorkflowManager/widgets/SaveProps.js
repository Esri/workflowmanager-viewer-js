define([
    "dojo/topic",
    "dojo/dom",
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",

	"dojo/text!./SaveProps/SaveProps.html",
    "dojo/i18n!./SaveProps/nls/Strings",
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

        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);

            this.savePropsDialog.startup();

            this.savePropsDialog.set("title", "Save Properties?");
            this.savePropsDialog.set("style", "width: 600px;");
            //this.savePropsDialog.onHide(this.controller.clearProps());

            this.savePropsDialog.show();

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
                onClick: lang.hitch(this, function () {
                    this.closeDialog();
                })
            }, this.dismissDialog);
            this.dismissDialogButton.startup();

            this.savePropsDialog.on("hide", this.closeDialog);
        },

        initUI: function () {

        },

        saveProps: function () {
            //save props
            this.controller.updateProperties();
        },

        closeDialog: function () {
            //reset changes made var in props
            this.controller.changesMade = false;
            this.savePropsDialog.hide();
            this.controller.clearProps();
            topic.publish("Properties/SaveDialog/Continue");
        }

    });
});