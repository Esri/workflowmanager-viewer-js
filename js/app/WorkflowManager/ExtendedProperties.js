define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	
	"dojo/text!./templates/ExtendedProperties.html",
	"dojo/i18n!./nls/Strings",
	
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/parser",
	"dojo/query",
	"dojo/on",
	"dojo/dom-style",
	"dijit/registry",
	
	"dijit/form/FilteringSelect",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/DropDownButton"
	],

function (
	declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
	template, i18n,
	lang, connect, parser, query, on, domStyle, registry,
	FilteringSelect, TextBox, Button, DropDownButton) {

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: false,
		
		constructor: function () {

		},

		postCreate: function () {
			this.inherited(arguments);
		},

		startup: function () {
			console.log("Extended Properties started");
		}
		
	});
});