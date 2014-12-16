define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/array",

    "esri/map",
    "esri/dijit/Popup",
    "esri/dijit/Attribution",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    "esri/dijit/OverviewMap",
    "esri/dijit/Scalebar",
    "esri/layers/FeatureLayer",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Polygon",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    
    "dojo/topic",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    
    "dojo/_base/lang",
    "dojo/string",
    "dojo/i18n!./EsriMap/nls/Strings",

    "dojo/text!./EsriMap/templates/EsriMap.html",
    "app/WorkflowManager/config/Topics"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, arrayUtil,
        Map, Popup, Attribution, Basemap, BasemapLayer, OverviewMap, Scalebar, FeatureLayer, webMercatorUtils, Polygon, Extent, SpatialReference, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, QueryTask, Query,
        topic, on, dom, domStyle, domConstruct, domClass,
        lang, string, i18n,
        mapTemplate, appTopics
    ) {
        
    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("./js/widget/gis/EsriMap/css/EsriMap.css")];
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
    return declare("widget.gis.EsriMap", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: mapTemplate,
        widgetsInTemplate: true,
        map: null,
        graphicsLayer: null,
        returnedFeatures: {},
        isDrawToolEnabled: false,

        postCreate: function() {
            this.inherited(arguments);

            //var popup = new Popup(null, domConstruct.create("div"));
            var popup = new Popup({}, domConstruct.create("div"));
            popup.startup();
            
            var startingBasemap;
            if (this.mapConfig.basemapGallery.showArcGISBasemaps == false)
            {
                var defaultBasemapName = this.mapConfig.defaultBasemap;
                var customBasemaps = this.mapConfig.customBasemaps; 
                
                for (var i=0; i < customBasemaps.length; i++)
                {
                    var basemap = customBasemaps[i];
                    if (basemap.id == defaultBasemapName)
                    {
                        var layers = [];
                        
                        if (basemap.layers == null || basemap.layers.length < 1)
                        {
                            console.log("Unable to create basemap " + basemap.id + ", no layer information found");
                            break;
                        }
                        
                        for (var j=0; j < basemap.layers.length; j++)
                        {
                            var layerConfig = basemap.layers[j];
                            if (layerConfig.url == null)
                            {
                                console.log("Unable to create basemap " + basemap.id + ", no url specified for a layer in the basemap");
                                break;
                            }
                            
                            layers[j] = new BasemapLayer(layerConfig);
                        }

                        startingBasemap = new Basemap({
                            id: basemap.id,
                            title: basemap.title,
                            layers: layers,
                            thumbnailUrl: basemap.thumbnailUrl,
                        });
                    }
                }
            }
            else
            {
                startingBasemap = this.mapConfig.defaultBasemap;
            }

            this.map = new esri.Map(this.mapId, {
                basemap: startingBasemap,
                extent: new esri.geometry.Extent(this.mapConfig.initialExtent),
                infoWindow: popup,
                slider: this.mapConfig.navigation.slider.isEnabled,
                sliderPosition: this.mapConfig.navigation.slider.position,
                sliderOrientation: this.mapConfig.navigation.slider.orientation,
                sliderStyle: this.mapConfig.navigation.slider.style,
                sliderLabels: this.mapConfig.navigation.slider.labels,
                nav: this.mapConfig.navigation.hasPanControls,
                fadeOnZoom: true,
                showAttribution: this.mapConfig.showAttribution,
                logo: this.mapConfig.showLogo,
                wrapAround180: false
            });
            this.map.on("load", lang.hitch(this, "initMapWidgets"));
            
            // add a graphics layer to the map
            this.graphicsLayer = new GraphicsLayer();
            this.map.addLayer(this.graphicsLayer);
        },

        startup: function () {
            var self = lang.hitch(this);
            this.initTopics();
            
            //catch click events on links inside popup
            on(this.map.infoWindow.domNode, "a:click", function (event) {
                var featureId = event.target.attributes["data-feature-id"].value;
                
                if (event.target.attributes["data-feature-single"].value == "true") {
                    //open job dialog with selected id
                    topic.publish(appTopics.grid.jobDialog, this, { selectedId: featureId, event: event });
                } else  {
                    //repopulate popup with single job info
                    self.singleFeature(self.returnedFeatures[featureId].feature, self.returnedFeatures[featureId].event);
                }
            });
            
            console.log("Map started");
        },

        initMapWidgets: function() {

            topic.publish(this.mapTopics.loaded);

            // Overview Map
            if (this.mapConfig.overview.isEnabled) {
                this.overviewMap = new esri.dijit.OverviewMap({
                    map: this.map,
                    attachTo: this.mapConfig.overview.position,
                    visible: this.mapConfig.overview.isVisibleOnStartup,
                    maximizeButton: this.mapConfig.overview.hasMaximizeButton
                });
                this.overviewMap.startup();
            }

            // Scalebar
            if (this.mapConfig.scalebar.isEnabled) {
                this.scalebar = new esri.dijit.Scalebar({
                    map: this.map,
                    scalebarStyle: this.mapConfig.scalebar.style,
                    scalebarUnit: this.mapConfig.scalebar.unit,
                    attachTo: this.mapConfig.scalebar.position
                });
            }
        },

        initTopics: function() {
            var self = lang.hitch(this);

            topic.subscribe(this.mapTopics.zoom.extent, function(sender, args) {
                var extent = new Extent(parseFloat(args.xmin), parseFloat(args.ymin), parseFloat(args.xmax), parseFloat(args.ymax), new SpatialReference({ wkid: parseInt(args.wkid) }));
                self.map.setExtent(extent);
            });

            //clear graphics when grid row is deselected
            topic.subscribe(appTopics.map.clearGraphics, function () {
                self.graphicsLayer.clear();
            });
            topic.subscribe(appTopics.map.draw.start, function () {
                self.isDrawToolEnabled = true;
            });
            topic.subscribe(appTopics.map.draw.end, function () {
                self.isDrawToolEnabled = false;
            });
        },
        
        drawAoi: function(polygon) {
            if (polygon.rings.length > 0) {
                this.addBoundaryGraphic(polygon, true);
            } else {
                this.graphicsLayer.clear();
            }
        },

        zoomToPolygon: function (polygon) {
            if (polygon.rings.length > 0) {
                this.map.setExtent(polygon.getExtent().expand(1.5));
            }
        },
    
        //add a boundary graphic of a selected state 
        addBoundaryGraphic: function(geometry, clearGraphics) {
            if (clearGraphics) {
                this.graphicsLayer.clear();
            }
            var graphic = new esri.Graphic(geometry, this.getBoundarySymbol());
            this.graphicsLayer.add(graphic);
        },

        getBoundarySymbol: function() {
            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([150, 11, 8, 0.9]), 1), new dojo.Color([209, 57, 42, 0.6]));
        },
        
        addAOIDynamicLayer: function(layerConfig, queryLayerUrl) {
            var self = lang.hitch(this);
            
            self.aoiDynamicLayer = self.getLayerObject(layerConfig);
            self.map.addLayer(self.aoiDynamicLayer);
            self.initializeQueryTask(queryLayerUrl);
            
            self.map.on("click", function(event) {
                if (!self.isDrawToolEnabled) {
                    self.screenPoint = event.screenPoint;
                    self.executeQueryTask(event);
                }
            });
        },

        getLayerObject: function(layer) {
            var self = lang.hitch(this);
            var l;
            //empty features
            this.returnedFeatures = {};

            //console.log("running getLayerObject with: ", layer);
            if (layer.type == 'dynamic') {
                l = new esri.layers.ArcGISDynamicMapServiceLayer(layer.url, layer.options);
            } else if (layer.type == 'tiled') {
                l = new esri.layers.ArcGISTiledMapServiceLayer(layer.url, layer.options);
            } else if (layer.type == 'feature') {
                l = new esri.layers.FeatureLayer(layer.url, layer.options);
            } else {
                console.log('Layer type not supported: ', layer.type);
                l = null;
            }
            
            var jobQueryContent = "";
            
            topic.subscribe(this.mapTopics.layer.jobQuery, function(args, jobStatuses, jobPriorities) {
                jobQueryContent = "";
                self.infoWindowSelectedId = args.id;

                //get status name by id
                args.status = jobStatuses[self.findWithAttr(jobStatuses, "id", args.status)].name;
                
                //get priority name by id
                args.priority = jobPriorities[self.findWithAttr(jobPriorities, "value", args.priority)].name;
                
                for (var key in args) {
                    if ((args.hasOwnProperty(key)) && ((key == "createdBy") || (key == "assignedTo") || (key == "priority") || (key == "status"))) {
                        var obj = args[key];

                        switch (key) {
                            case "createdBy":
                                key = i18n.createdBy;
                                break;
                            case "assignedTo":
                                key = i18n.assignedTo;
                                break;
                            case "priority":
                                key = i18n.priority;
                                break;
                            case "status":
                                key = i18n.status;
                                break;
                        }
                        
                        jobQueryContent = jobQueryContent + "<p>" + key + ": " + obj + "</p>";
                    }
                }
                jobQueryContent = jobQueryContent + "<a href='#' data-feature-single='true' data-feature-id='" + args.id + "'>" + i18n.openJob + "</a>";
                self.map.infoWindow.setTitle("<a href='#' data-feature-single='true' data-feature-id='" + args.id + "'>" + args.name + "</a>");
                self.map.infoWindow.setContent(jobQueryContent);
                self.map.infoWindow.show(self.screenPoint);
            });
            return l;
        },
        
        initializeQueryTask: function(queryLayerUrl) {
            //build query task
            this.queryTask = new esri.tasks.QueryTask(queryLayerUrl);

            //build query filter
            this.query = new esri.tasks.Query();
            this.query.returnGeometry = true;
            this.query.outFields = [this.jobIdField];

            this.symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 0.5]));
            this.singleFeature = this.showFeature;
        },
        
        //map click feature
        executeQueryTask: function (evt) {
            var self = lang.hitch(this);
            self.graphicsLayer.clear();

            self.map.infoWindow.hide();
            self.map.infoWindow.setContent(i18n.loadingJobInfo);
            self.map.infoWindow.setTitle(i18n.loading);

            //onClick event returns the evt point where the user clicked on the map.
            //This contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
            self.query.geometry = evt.mapPoint;
            //Filter also on jobIds currently selected
            self.query.where = self.jobIdField + " IN (" + self.selectedJobIds.join(",") + ")";

            //Execute task and call showResults on completion
            self.queryTask.execute(self.query, function (fset) {
                if (fset.features.length === 0) { 
                    self.clearSelection();
                } else if (fset.features.length === 1) {
                    self.showFeature(fset.features[0], evt);
                } else {
                    self.showFeatureSet(fset, evt);
                }
            });
        },
        
        clearSelection: function() {
            var self = lang.hitch(this);
            //remove all graphics on the maps graphics layer
            self.graphicsLayer.clear();
            topic.publish(this.mapTopics.layer.clearSelection);
        },
        
        showFeature: function (feature, evt) {
            var self = lang.hitch(this);
            //console.log("Showing feature:", feature, evt);
            feature.setSymbol(self.symbol);
            topic.publish(this.mapTopics.layer.click, feature.attributes[self.jobIdField]);
        },
        
        showFeatureSet: function(fset, evt) {
            var self = lang.hitch(this);
            //console.log("Showing feature set:", fset, evt);
            //remove all graphics on the maps graphics layer
            self.graphicsLayer.clear();

            var featureSet = fset;
            var numFeatures = featureSet.features.length;

            //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the infowindow.
            var content = "";
            for (var i = 0; i < numFeatures; i++) {
                var graphic = featureSet.features[i];
                var jobId = graphic.attributes[self.jobIdField];
                content = content + "<a href='#' data-feature-single='false' data-feature-id='" + jobId + "'>" + jobId + "</a><br/>";
                //create feature and event object of all returned
                //to be parsed upon item selection using id as key
                self.returnedFeatures[jobId] = { "feature": graphic, "event": evt };
            }
            self.map.infoWindow.setContent(content);
            self.map.infoWindow.setTitle(i18n.selectAJob);
            self.map.infoWindow.show(evt.screenPoint);
        },

        resize: function () {
            this.map.resize();
        },

        setMapExtent: function (args) {
            var self = this;
            var extent = args;
            if (!args) {
                extent = {
                    xmin: self.map.extent.xmin,
                    ymin: self.map.extent.ymin,
                    xmax: self.map.extent.xmax,
                    ymax: self.map.extent.ymax,
                    spatialReference: {
                        wkid: self.map.extent.spatialReference.wkid
                    }
                };
            }
            this.map.setExtent(new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, new SpatialReference(extent.spatialReference.wkid)));
        },

        refreshLayers: function () {
            this.aoiDynamicLayer.refresh();
        },

        getUpdatedFeatures: function (jobIds) {
            this.selectedJobIds = jobIds;
            var layerDefinitions = [];
            layerDefinitions[this.aoiLayerID] = this.jobIdField + " in (" + jobIds.join() + ")";
            this.aoiDynamicLayer.setLayerDefinitions(layerDefinitions);   
            this.setMapExtent();
            this.refreshLayers();
        },

        findWithAttr: function (array, attr, value) {
            //if array is defined
            if (array) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
            }
        }
    });
});