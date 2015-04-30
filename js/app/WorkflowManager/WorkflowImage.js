define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./templates/WorkflowImage.html",
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
    "dijit/form/DropDownButton"

   
],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n,
    lang, connect, arrayUtil, parser, query, on, domStyle, dom, registry,
    FilteringSelect, TextBox, Button, DropDownButton) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: false,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () { },

        setImage: function(img){
            this.workflowImageContainer.src = img;
        }
    });
});