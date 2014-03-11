define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	
	"dojo/topic",
    "dojo/query",
    "dojo/on",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/lang",
    "dojo/string",
	"dojox/lang/functional",
	
	"esri/dijit/Basemap",
	"esri/dijit/BasemapLayer",
	"esri/dijit/BasemapGallery",
	
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	
    "dojo/text!./BasemapGallery/templates/BasemapGallery.html",
	"dojo/i18n!./BasemapGallery/nls/Strings"
    ], 
	
	function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		topic, query, on, dom, domStyle, domConstruct, domClass, lang, string, functional,
		Basemap, BasemapLayer, BasemapGallery,
		DropDownButton, TooltipDialog,
		template, i18n
	) {
		
	//anonymous function to load CSS files required for this module
	(function () {
	    var css = [require.toUrl("./js/widget/gis/BasemapGallery/css/BasemapGallery.css")];
	    var head = document.getElementsByTagName("head").item(0),
            link;
	    for (var i = 0, il = css.length; i < il; i++) {
	        link = document.createElement("link");
	        link.type = "text/css";
	        link.rel = "stylesheet";
	        link.href = css[i].toString();
	        head.appendChild(link);
	    }
	}());

    // main geolocation widget
    return declare("widget.gis.BasemapGallery", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
		
		i18n_BasemapGallery_Label: i18n.BasemapGallery_Label,
		
        postCreate: function() {
            this.inherited(arguments);

			this.basemapGallery = new BasemapGallery({
				id: this.galleryId,
				"class": "simple",
				showArcGISBasemaps: this.basemapConfig.showArcGISBasemaps,
				map: this.map,
				onSelectionChange: function () {
				    var selectedBasemap = this.getSelected();
					if (selectedBasemap.id === "satellite" || selectedBasemap.id === "hybrid") { 
						// for all dark basemaps add the 'dark attribute' style class so that ui elements render differently
						domClass.add(this.map.container, "dark");
					}
					else {
						domClass.remove(this.map.container, "dark");
					}
				}
			}, domConstruct.create("div"));
			if (!this.basemapConfig.showArcGISBasemaps) {
				this.basemapGallery.basemaps = this.getCustomBasemaps();
			}
			this.basemapGallery.on("onError", function(msg) {console.log(msg)});
			this.basemapGallery.startup();

			var basemapGalleryDropDown = new TooltipDialog({
                "class": "basemap-gallery-dialog",
                style: "max-width: 410px;",
				"content": this.basemapGallery
			});

			this.dropDownButton.set("dropDown", basemapGalleryDropDown);	
			
			/*
			var basemapGalleryButton = new DropDownButton({
				//label: "BasemapGallery Widget",
				"class": "basemaps-control",
				dropDownPosition: ['below-centered', 'above-centered'],
				dropDown: basemapGalleryDropDown
			}, this.dropDownButton);
			*/
        },
		
		startup: function() {
			//this.selectBasemap(this.basemapConfig.defaultBasemapOverridden);
			console.log("BasemapGallery started");	
		},

		getCustomBasemaps: function() {
		    
		    // Customize basemaps here
			return [
				new Basemap({
					id: "streets",
					layers: [new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
					})],
					title: i18n.Basemap_Streets,
					thumbnailUrl: "js/widget/gis/BasemapGallery/images/streets.jpg"
				}),
				new Basemap({
					id: "satellite",
					layers: [new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
					})],
					title: i18n.Basemap_Satellite,
					thumbnailUrl: "js/widget/gis/BasemapGallery/images/satellite.jpg"
				}),
				new Basemap({
					id: "hybrid",
					layers: [new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
					}), new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
						isReference: true,
						displayLevels: [0, 1, 2, 3, 4, 5, 6, 7]
					}), new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
						isReference: true,
						displayLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
					})],
					title: i18n.Basemap_Hybrid,
					thumbnailUrl: "js/widget/gis/BasemapGallery/images/hybrid.jpg"
				}),
                new Basemap({
                    id: "topo",
                    layers: [new BasemapLayer({
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                    })],
                    title: i18n.Basemap_Topographic,
                    thumbnailUrl: "js/widget/gis/BasemapGallery/images/topo.jpg"
                }),
				new Basemap({
					id: "gray",
					layers: [new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"
					}), new BasemapLayer({
						url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",
						isReference: true
					})
					],
					title: i18n.Basemap_Gray,
					thumbnailUrl: "js/widget/gis/BasemapGallery/images/gray.jpg"
				})
			];
		},
		
		selectBasemap: function(basemapId) {
            if (this.basemapConfig.showArcGISBasemaps) {
				// TODO: figure out why the basemap isn't selected with this command (breaks the viewer)
				//this.map.setBasemap(basemapId);
            } else {
				this.basemapGallery.select(basemapId);
            }
		}
    });
	
});