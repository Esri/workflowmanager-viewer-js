define([
    "dojo/topic",
    "dojo/dom",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./AoiFunctions/AoiFunctions.html",
    "dojo/i18n!./AoiFunctions/nls/Strings",
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

        i18n_ClearDialogContent: i18n.clearDialogContent,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);

            this.aoiFunctionsDialog.startup();

            this.aoiFunctionsDialog.set("title", i18n.clearDialogTitle);
            this.aoiFunctionsDialog.set("style", "width: 500px;");

            this.aoiFunctionsDialog.show();

            // Clear aoi button
            this.confirmClearButton = new Button({
                label: i18n.confirmClear,
                name: "confirmClearAoiButton",
                "class": "dojo-btn-success",
                onClick: lang.hitch(this, function () {
                    this.clearAoi();
                })
            }, this.confirmClear);
            this.confirmClearButton.startup();

            // Dismiss dialog button
            this.dismissDialogButton = new Button({
                label: i18n.declineClear,
                name: "cancleClearAoiButton",
                "class": "dojo-btn-danger",
                onClick: lang.hitch(this, function () {
                    this.aoiFunctionsDialog.hide();
                })
            }, this.dismissDialog);
            this.dismissDialogButton.startup();

            this.initUI();
        },

        initUI: function () {

        },

        clearAoi: function () {
            topic.publish("clearAoiConfirmed");
        }

    });
});