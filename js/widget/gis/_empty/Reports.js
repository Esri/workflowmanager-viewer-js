define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	
	"dojo/topic",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/lang",
    "dojo/string",
	
    "dojo/text!./Reports/templates/Reports.html",
	"dojo/i18n!./Reports/nls/Strings"
    ], 
	
	function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		topic, dom, domStyle, domConstruct, domClass, lang, string, 
		template, i18n
	) {

    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("dijit/gis/Reports/css/Reports.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for(var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());
		
    // main geolocation widget
    return declare("dijit.gis.Reports", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
		
        postCreate: function() {
            this.inherited(arguments);

        },
		
		startup: function() {
			console.log("Reports started");	
		}
    });
	
});