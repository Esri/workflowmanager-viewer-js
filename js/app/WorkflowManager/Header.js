define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	
	"dojo/text!./templates/Header.html",
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

		// i18n
		i18n_Title: i18n.header.title,
		i18n_SubHeader: i18n.header.subHeader,
		i18n_Logout: i18n.header.logout,
		i18n_Welcome: i18n.header.welcome,
		
		constructor: function () {

		},

		postCreate: function () {
			this.inherited(arguments);

			// hookup links
			on(this.headerLogout, "click", lang.hitch(this, "logout"));
		},

		startup: function () {
		    console.log("Header started");

		    if (this.hasLogout) {
		        this.showLogout();
		    } else {
		        this.hideLogout();
		    }
		},
		
		setUserName: function(name) {
			this.txtUsername.innerHTML = name;	
		},
		
		logout: function() {
		    console.log("Logout clicked");
		    location.reload();
		},

		showLogout: function () {
		    domStyle.set(this.logoutContainer, "display", "inline");
		},

		hideLogout: function () {
		    domStyle.set(this.logoutContainer, "display", "none");
		}

	});
});