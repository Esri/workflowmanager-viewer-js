define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/Aoi.html",
    "dojo/text!./templates/AoiMap.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    "./config/AppConfig",
    
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/string",
    "dojo/dom-style",
    "dijit/registry",

    "dojo/store/Memory",

    // GIS widgets
    "widget/gis/EsriMap",
    
    // TODO No support in 4.x currently
    //"widget/gis/BasemapGallery",
    //"widget/gis/DrawTool",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button",
    "dijit/form/DropDownButton"
    ],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, mapTemplate, i18n, appTopics, config,
    lang, connect, parser, query, on, string, domStyle, registry,
    Memory,
    EsriMap, 
    BorderContainer, ContentPane, FilteringSelect, TextBox, Textarea, Button, DropDownButton) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
        i18n_JobName: i18n.properties.jobName,
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_Resize: i18n.properties.resize,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("AOI Started");

            this.initUI();
        },

        initUI: function () {
            var self = lang.hitch(this);

            // Map
            this.aoiMapPanel = new ContentPane({
                region: "center",
                id: "aoiMap",
                style: "width: 100%; height: 100%;",
                content: mapTemplate
            }).placeAt(this.mapContainer);
            this.aoiMapPanel.startup();

            this.resizeMapBtn = new Button({
                label: this.i18n_Resize,
                onClick: function () {
                    self.aoiMap.resize();
                }
            }).placeAt("aoiMapBR");

            this.initMap();
        },

        initMap: function () {
            var self = lang.hitch(this);

            this.aoiMap = new EsriMap({
                mapConfig: config.map,
                mapTopics: appTopics.map,
                mapId: self.aoiMapPanel.id
            });
            this.aoiMap.startup();

            // TODO No support in 4.x currently
            // BasemapGallery
            // if (config.map.basemapGallery.isEnabled) {
            //     this.aoiBasemapGallery = new BasemapGallery({ map: this.aoiMap.map, basemapConfig: config.map.basemapGallery, galleryId: "aoiMapBasemapGallery" }, "aoiBasemapGalleryContainer");
            //     this.aoiBasemapGallery.startup();
            //     this.aoiBasemapGallery.selectBasemap(config.map.defaultBasemap);
            // }

            // TODO No support in 4.x currently
            // DrawTool
            // if (config.map.drawTool.isEnabled) {
            //     this.aoiDrawTool = new DrawTool({ map: this.aoiMap.map, drawConfig: config.map.drawTool }, "aoiDrawContainer");
            //     this.aoiDrawTool.startup();    
            // }
        }

    });
});