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
	
	"esri/geometry/webMercatorUtils",
	
    "dojo/text!./Coordinates/templates/Coordinates.html",
	"dojo/i18n!./Coordinates/nls/Strings"
    ], 
	
	function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		topic, dom, domStyle, domConstruct, domClass, lang, string, 
		webMercatorUtils,
		template, i18n
	) {

    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("./js/widget/gis/Coordinates/css/Coordinates.css")];
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
    return declare("widget.gis.Coordinates", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
		
        postCreate: function() {
            this.inherited(arguments);
			
			dojo.connect(this.map, "onMouseMove", lang.hitch(this, "showCoordinates"));
			dojo.connect(this.map, "onMouseDrag", lang.hitch(this, "showCoordinates"));
        },
		
		startup: function() {
			console.log("Coordinates started");	
		},
		
		showCoordinates: function(evt) {
			// get mapPoint from event
			// The map is in web mercator - modify the map point to display the results in geographic
			var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
			// display mouse coordinates
			this.mapCoordinatesContent.innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
		}
		
    });
	
});