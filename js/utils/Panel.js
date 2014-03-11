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
	
    "dojo/text!./Panel/templates/Panel.html",
	"dojo/i18n!./Panel/nls/Strings"
    ], 
	
	function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		topic, dom, domStyle, domConstruct, domClass, lang, string, 
		template, i18n
	) {

    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("gis/dijit/Panel/css/Panel.css")];
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
    return declare("dijit.util.Panel", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
		spinner: null,
		
        postCreate: function() {
            this.inherited(arguments);


			var target = document.getElementById('foo');
			this.spinner = new Spinner(this.getOptions());

        },
		
		startup: function() {
			console.log("Panel started");	
		},
		
		startSpin: function(target) {
			this.spinner.spin(target);
		},
		
		stopSpin: function() {
			this.spinner.stop();
		},
		
		getOptions: function() {
			var opts = {
				lines: 13, // The number of lines to draw
				length: 0, // The length of each line
				width: 14, // The line thickness
				radius: 30, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#000', // #rgb or #rrggbb
				speed: 1, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: 'auto', // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			};
			return opts;
		}
    });
	
});