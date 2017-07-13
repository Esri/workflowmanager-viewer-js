define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/array",
    "dojo/ready",

    "esri/Basemap",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/widgets/Home",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Locate",
    "esri/widgets/Popup",
    "esri/widgets/Attribution",
    "esri/widgets/Search",

    // TODO No support in 4.x currently
    //"esri/dijit/BasemapLayer",
    //"esri/dijit/OverviewMap",
    //"esri/dijit/Scalebar",

    "esri/layers/MapImageLayer",    // previously ArcGISDynamicMapServiceLayer
    "esri/layers/TileLayer",        // previously ArcGISTiledMapServiceLayer

    "esri/layers/FeatureLayer",
    "esri/geometry/support/webMercatorUtils",
    "esri/geometry/Polygon",
    "esri/geometry/Extent",
    "esri/geometry/SpatialReference",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    
    "dojo/topic",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    
    "dojo/promise/Promise",
    "dojo/promise/all",
    
    "dojo/_base/lang",
    "dojo/string",
    "dojo/i18n!./EsriMap/nls/Strings",

    "dojo/text!./EsriMap/templates/EsriMap.html",

    "app/WorkflowManager/Constants",
    "app/WorkflowManager/config/Topics"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, arrayUtil, ready,
        Basemap, Map, MapView, Graphic, Home, BasemapToggle, Locate, Popup, Attribution, Search,
        MapImageLayer, TileLayer,
        FeatureLayer, webMercatorUtils, Polygon, Extent, SpatialReference, GraphicsLayer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, QueryTask, Query,
        topic, on, dom, domStyle, domConstruct, domClass,
        Promise, all,
        lang, string, i18n,
        mapTemplate, Constants, appTopics
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
        mapView: null,
        graphicsLayer: null,
        returnedFeatures: [],
        isDrawToolEnabled: false,

        postCreate: function() {
            this.inherited(arguments);

            var popup = new Popup({}, domConstruct.create("div"));
            popup.startup();
            
            var startingBasemap;
            if (this.mapConfig.basemapToggle.isEnabled) {
                if (this.mapConfig.basemapToggle.showArcGISBasemaps == false) {
                    var defaultBasemapName = this.mapConfig.basemapToggle.defaultBasemap;
                    var customBasemaps = this.mapConfig.basemapToggle.customBasemaps;
                    startingBasemap = this.createBasemap(defaultBasemapName, customBasemaps);
                } else {
                    startingBasemap = this.mapConfig.basemapToggle.defaultBasemap;
                }
            }

            this.map = new Map({
                basemap: startingBasemap
            });
            this.map.on("load", lang.hitch(this, "initMapWidgets"));

            // add custom non-cached basemap layers to the map
            if (!this.mapConfig.basemapToggle.isEnabled && this.mapConfig.customBasemap) {
                var customMapConfig = this.mapConfig.customBasemap;
                var basemap;
                if (customMapConfig.type == "map-image") {
                    basemap = new MapImageLayer( customMapConfig.properties );
                } else if (customMapConfig.type == "imagery") {
                    basemap = new TileLayer( customMapConfig.properties );
                }
                if (basemap) {
                    this.map.add(basemap);
                }
            }

            // add a graphics layer to the map
            this.graphicsLayer = new GraphicsLayer();
            this.map.add(this.graphicsLayer);
            
            // TODO No support in 4.x currently 
            // point tolerance
            //if (this.mapConfig.drawTool.pointTolerance && this.mapConfig.drawTool.pointTolerance > 0)
            //    this.toleranceInPixels = this.mapConfig.drawTool.pointTolerance;

            ready(lang.hitch(this, function(){
                // create the map view only after DOM is ready
                var initialExtent = this.mapConfig.initialExtent;
                this.mapView = new MapView({
                    container: this.mapId,
                    map: this.map,
                    extent: { // autocasts as new Extent()
                        xmin: initialExtent.xmin,
                        ymin: initialExtent.ymin,
                        xmax: initialExtent.xmax,
                        ymax: initialExtent.ymax,
                        spatialReference: initialExtent.spatialReference.wkid
                    },
                    popup: popup
                });
                
                // Enable Basemap Toggle for now, since BasemapGallery is not yet supported
                if(this.mapConfig.basemapToggle.isEnabled) {
                    var nextBasemap;
                    if (this.mapConfig.basemapToggle.showArcGISBasemaps) {
                        nextBasemap = this.mapConfig.basemapToggle.nextBasemap
                    } else {
                        var basemapName = this.mapConfig.basemapToggle.nextBasemap;
                        var customBasemaps = this.mapConfig.basemapToggle.customBasemaps;
                        nextBasemap = this.createBasemap(basemapName, customBasemaps);
                    }

                    var basemapToggleWidget = new BasemapToggle({
                        view: this.mapView,
                        nextBasemap: nextBasemap
                    });
                    this.mapView.ui.add(basemapToggleWidget, "bottom-right");
                }

                // Add the home widget to the top left corner of the view
                var homeBtn = new Home({
                    view: this.mapView
                }, "homediv");
                homeBtn.startup();
                this.mapView.ui.add(homeBtn, "top-left");
                
                // Adds the search widget below other elements in the top left corner of the view
                var searchWidget = new Search({
                    view: this.mapView
                });
                this.mapView.ui.add(searchWidget, {
                    position: "top-right"
                });                
                
                // Add the locate widget to the top left corner of the view
                /*
                var locatorGraphicsLayer = new GraphicsLayer();
                this.map.add(locatorGraphicsLayer);         
                var locateBtn = new Locate({
                    view: this.mapView,
                    graphicsLayer: locatorGraphicsLayer
                });
                locateBtn.startup();
            
                this.mapView.ui.add(locateBtn, {
                    position: "bottom-left",
                    index: 0
                });
                */
            }));         
        },

        startup: function () {
            var self = lang.hitch(this);
            this.initTopics();
            
            //catch click events on links inside popup (if it exists)
            if (this.map.infoWindow) {
                on(this.map.infoWindow.domNode, "a:click", function (event) {
                    var featureId = event.target.attributes["data-feature-id"].value;

                    if (event.target.attributes["data-feature-single"]) {
                        //open job dialog with selected id

                        topic.publish(appTopics.grid.jobDialog, this, { selectedId: featureId, event: event, gridArr: self.returnedFeatures, gridArrPos: self.featurePos + 1 });
                    } else if (event.target.attributes["data-feature-next"].value == "true") {
                        //move to next
                        self.featurePos++;
                        if (self.featurePos == self.jobList.length)
                            self.featurePos = 0;
                        self.features[self.featurePos].setSymbol(self.symbol);
                        topic.publish(appTopics.map.layer.select, self.returnedFeatures[self.featurePos], self.features[self.featurePos].geometry);
                        self.populateInfoWindow(self.jobList[self.featurePos], self.mapJobStatuses, self.mapJobPriorities);
                    } else if (event.target.attributes["data-feature-next"].value == "false") {
                        //move back
                        self.featurePos--;
                        if (self.featurePos < 0)
                            self.featurePos = self.jobList.length - 1;
                        self.features[self.featurePos].setSymbol(self.symbol);
                        topic.publish(appTopics.map.layer.select, self.returnedFeatures[self.featurePos], self.features[self.featurePos].geometry);
                        self.populateInfoWindow(self.jobList[self.featurePos], self.mapJobStatuses, self.mapJobPriorities);
                    }
                });
            }
            
            console.log("Map started");
        },

        // TODO: Is this still needed?
        initMapWidgets: function() {

            topic.publish(this.mapTopics.loaded);
            
            // TODO No support in 4.x currently
            // Overview Map
            // if (this.mapConfig.overview.isEnabled) {
            //     this.overviewMap = new esri.dijit.OverviewMap({
            //         map: this.map,
            //         attachTo: this.mapConfig.overview.position,
            //         visible: this.mapConfig.overview.isVisibleOnStartup,
            //         maximizeButton: this.mapConfig.overview.hasMaximizeButton
            //     });
            //     this.overviewMap.startup();
            // }

            // TODO No support in 4.x currently
            // Scalebar
            // if (this.mapConfig.scalebar.isEnabled) {
            //     this.scalebar = new esri.dijit.Scalebar({
            //         map: this.map,
            //         scalebarStyle: this.mapConfig.scalebar.style,
            //         scalebarUnit: this.mapConfig.scalebar.unit,
            //         attachTo: this.mapConfig.scalebar.position
            //     });
            // }
        },

        createBasemap: function(basemapName, customBasemaps) {
            for (var i=0; i < customBasemaps.length; i++) {
                var basemap = customBasemaps[i];
                if (basemap.id == basemapName) {
                    var layers = [];
                    if (basemap.layers == null || basemap.layers.length < 1) {
                        console.log("Unable to create basemap " + basemap.id + ", no layer information found");
                        break;
                    }

                    for (var j=0; j < basemap.layers.length; j++) {
                        var layerConfig = basemap.layers[j];
                        if (layerConfig.url == null) {
                            console.log("Unable to create basemap " + basemap.id + ", no url specified for a layer in the basemap");
                            break;
                        }
                        layers[j] = new TileLayer(layerConfig);
                    }

                    return new Basemap({
                        id: basemap.id,
                        title: basemap.title,
                        baseLayers: layers,
                        thumbnailUrl: basemap.thumbnailUrl,
                    });
                }
            }
            // Could not find matching basemap configuration
            console.log("Unable to create basemap " + basemapName + ", no configuration specified");
            return null;
        },

        initTopics: function() {
            var self = lang.hitch(this);

            topic.subscribe(this.mapTopics.zoom.extent, function(sender, args) {
                var extent = new Extent(parseFloat(args.xmin), parseFloat(args.ymin), parseFloat(args.xmax), parseFloat(args.ymax), new SpatialReference({ wkid: parseInt(args.wkid) }));
                self.mapView.extent = extent;
            });

            //clear graphics when grid row is deselected
            topic.subscribe(appTopics.map.clearGraphics, function () {
                self.graphicsLayer.removeAll();
            });
            topic.subscribe(appTopics.map.draw.start, function () {
                self.isDrawToolEnabled = true;
            });
            topic.subscribe(appTopics.map.draw.end, function () {
                self.isDrawToolEnabled = false;
            });

            topic.subscribe(appTopics.map.setup, function (args) {
                self.mapJobPriorities = args.jobPriorities;
                self.mapJobStatuses = args.jobStatuses;
            });
        },
        
        drawLoi: function(jobId, loi, zoomToFeature) {
            if (loi && (loi.type == Constants.GeometryType.POINT || loi.type == Constants.GeometryType.MULTIPOINT ||
                (loi.type == Constants.GeometryType.POLYGON && (loi.rings && loi.rings.length > 0)))) {
                if (this.map.spatialReference == loi.spatialReference) {
                    this._drawLoi(loi, zoomToFeature);
                } else {
                    // Get the correct geometry for the map's spatial reference
                    this._getAndDrawLoi(jobId, zoomToFeature);
                }
            } else {
                this.graphicsLayer.removeAll();
            }
        },
        
        _drawLoi : function(loi, zoomToFeature) {
            this.addBoundaryGraphic(loi, true);
            if (zoomToFeature) {
                //zoom to loi
                this.zoomToFeature(loi);
            }            
        },
        
        _getAndDrawLoi : function(jobId, zoomToFeature) {
            var self = lang.hitch(this);
            var query = new Query();
            query.returnGeometry = true;
            query.outSpatialReference = self.map.spatialReference;
            query.where = self.jobIdField + "=" + jobId;

            //Execute tasks and call showResults on completion
            var aoiReq = self.aoiQueryTask.execute(query);
            var poiReq = null;
            if (self.poiQueryTask) {
                var poiQuery = new Query();
                poiQuery.returnGeometry = true;
                poiQuery.outSpatialReference = self.map.spatialReference;
                poiQuery.where = self.poiJobIdField + "=" + jobId;
                poiReq = self.poiQueryTask.execute(poiQuery);
            }
            
            var promises = (poiReq) ? all([aoiReq, poiReq]) : all([aoiReq]);
            promises.then(
                function (results) {
                    if (results.length === 1 && results[0].features) {
                        // AOI only
                        self._drawLoi(results[0].features[0].geometry, zoomToFeature);
                    } else if (results.length === 2) {
                        // AOI and POI
                        var hasAOIs = results[0].features && results[0].features.length > 0;
                        var hasPOIs = results[1].features && results[1].features.length > 0;
                        if (hasAOIs && hasPOIs) {
                            // There can only be one job LOI, so select the first one
                            self._drawLoi(results[0].features[0].geometry, zoomToFeature);
                        } else if (hasAOIs) {
                            self._drawLoi(results[0].features[0].geometry, zoomToFeature);
                        } else if (hasPOIs) {
                            self._drawLoi(results[1].features[0].geometry, zoomToFeature);
                        } else {
                            self.graphicsLayer.removeAll();
                        }
                    } else {
                        // No results
                        self.graphicsLayer.removeAll();
                    }
                },
                function(error) {
                    console.log("Error retrieving jobLOIs: " + error);
                }
            );
        },
        
        zoomToFeature: function (geometry) {
            if (geometry.type == "point") {
                this.mapView.center = geometry;
            } else if (geometry.type == "multipoint") {
                this.mapView.extent = geometry.extent.expand(1.5);
            } else if (geometry.type == "polygon" && geometry.rings.length > 0) {
                this.mapView.extent = geometry.extent.expand(1.5);
            }
        },
    
        //add a boundary graphic of a selected state 
        addBoundaryGraphic: function (geometry, clearGraphics) {
            if (clearGraphics) {
                this.graphicsLayer.removeAll();
            }
            
            var symbol = (geometry.type == "point" || geometry.type == "multipoint") ? this.getMarkerSymbol(): this.getBoundarySymbol();
            var graphic = new Graphic(geometry, symbol);
            this.graphicsLayer.add(graphic);
        },
        
        getMarkerSymbol: function() {
            return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 1.0]));
        },

        getBoundarySymbol: function() {
            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([150, 11, 8, 0.9]), 1), new dojo.Color([209, 57, 42, 0.6]));
        },
        
        addLOIDynamicLayers: function(args) {
            var self = lang.hitch(this);
            
            self.aoiDynamicLayer = self.getLayerObject(args.layerConfig);
            self.map.add(self.aoiDynamicLayer);
            self.initializeQueryTasks(args.aoiQueryLayerUrl, args.poiQueryLayerUrl);

            self.map.on("click", function(event) {
                if (!self.isDrawToolEnabled) {
                    self.screenPoint = event.screenPoint;
                    
                    if (self.toleranceInPixels) {
                        self.executeQueryTask(event, self.pointToExtent(event.mapPoint));
                    } else {
                        self.executeQueryTask(event);
                    }
                }
            });
        },
        
        pointToExtent: function(point) {
            if (!point)
                return;
            
            //calculate map coords represented per pixel
            var pixelWidth = this.mapView.extent.width / this.map.width;
            
            //calculate map coords for tolerance in pixel
            var toleraceInMapCoords = this.toleranceInPixels * pixelWidth;
            
            //calculate & return computed extent
            return new Extent(
                point.x - toleraceInMapCoords,
                point.y - toleraceInMapCoords,
                point.x + toleraceInMapCoords,
                point.y + toleraceInMapCoords,
                this.mapView.spatialReference ); 
        },
        
        getLayerObject: function(layer) {
            var self = lang.hitch(this);
            var l;
            //empty features
            this.featurePos = 0;

            //console.log("running getLayerObject with: ", layer);
            var layerProps = layer.options;
            layerProps.url = layer.url;
            if (layer.type == 'dynamic') {
                l = new MapImageLayer(layerProps);
            } else if (layer.type == 'tiled') {
                l = new TileLayer(layerProps);
            } else if (layer.type == 'feature') {
                l = new FeatureLayer(layerProps);
            } else {
                console.log('Layer type not supported: ', layer.type);
                l = null;
            }
            
            var jobQueryContent = "";
            
            topic.subscribe(this.mapTopics.layer.jobQuery, function (args) {
                self.populateInfoWindow(args);
            });

            topic.subscribe(this.mapTopics.layer.multiJobQuery, function(args) {
                var jList =[];
                var rows = args.rows;
                //fields are known from ad hoc query
                // ID Name Created_by Assigned_to Priority Status 
                for (var i = 0; i < rows.length; i++) {
                    var job = {};
                    job.id = rows[i][0];
                    job.name = rows[i][1];
                    job.createdBy = rows[i][2];
                    job.assignedTo = rows[i][3];
                    job.priority = Number(rows[i][4]);
                    job.status = Number(rows[i][5]);
                    jList[i] = job;
                }
                self.jobList = jList;
                
                
                self.features[self.featurePos].setSymbol(self.symbol);
                self.populateInfoWindow(jList[0]);
                });
            return l;
        },
        
        populateInfoWindow: function(args) {
            var self = lang.hitch(this);
            
            jobQueryContent = "";
            self.infoWindowSelectedId = args.id;
            if (self.features)
                var numFeatures = self.features.length;
                
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
                            obj = self.mapJobPriorities[self.findWithAttr(self.mapJobPriorities, "value", obj)].name;
                            break;
                        case "status":
                            key = i18n.status;
                            obj = self.mapJobStatuses[self.findWithAttr(self.mapJobStatuses, "id", obj)].name;
                            break;
                    }
                        
                    jobQueryContent = jobQueryContent + "<p>" + key + ": " + obj + "</p>";
                }
            }
            //jobQueryContent = jobQueryContent + "<a href='#' data-feature-single='true' data-feature-id='" + args.id + "'>" + i18n.openJob + "</a>";
            if (numFeatures > 1) {
                jobQueryContent = jobQueryContent + "<a href='#' class='popupNav' data-feature-next='true' data-feature-id='" + self.featurePos + "'>" + i18n.next + "</a>";
                jobQueryContent = jobQueryContent + "<p  class='popupNav'> " + i18n.navInfo.replace("{0}", (self.featurePos +1)).replace("{1}", self.featureCount) + " </p>";
                jobQueryContent = jobQueryContent + "<a href='#' class='popupNav' data-feature-next='false' data-feature-id='" + self.featurePos + "'>" + i18n.back + "</a>";
            }
            self.map.infoWindow.setTitle("<a href='#' data-feature-single='true' data-feature-id='" + args.id + "'>" + args.name + "</a>");
            self.map.infoWindow.setContent(jobQueryContent);
            self.map.infoWindow.show(self.screenPoint);
        },

        initializeQueryTasks: function(aoiQueryLayerUrl, poiQueryLayerUrl) {
            //build AOI query task and filter
            this.aoiQueryTask = new QueryTask(aoiQueryLayerUrl);
            this.aoiQuery = new Query();
            this.aoiQuery.returnGeometry = true;
            this.aoiQuery.outFields = [this.jobIdField];
            this.aoiQuery.outSpatialReference = this.map.spatialReference;  

            if (poiQueryLayerUrl) {
                //build POI query task and filter
                this.poiQueryTask = new QueryTask(poiQueryLayerUrl);
                this.poiQuery = new Query();
                this.poiQuery.returnGeometry = true;
                this.poiQuery.outFields = [this.poiJobIdField];
                this.poiQuery.outSpatialReference = this.map.spatialReference;  
            }

            this.markerSymbol = new SimpleMarkerSymbol({
                color: [255, 0, 0, 1.0],
                style: "circle",
                size: 10,
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [255, 0, 0],
                    width: 1
                }
            });
            this.symbol = new SimpleFillSymbol({
                color: [255, 0, 0, 0.5],
                style: "solid",
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [255, 0, 0],
                    width: 1
                }
            });
            this.singleFeature = this.showFeature;
        },
        
        //map click feature
        executeQueryTask: function (evt, geometry) {
            var self = lang.hitch(this);
            self.graphicsLayer.removeAll();

            self.map.infoWindow.hide();
            self.map.infoWindow.setContent(i18n.loadingJobInfo);
            self.map.infoWindow.setTitle(i18n.loading);

            //onClick event returns the evt point where the user clicked on the map.
            //This contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
            self.aoiQuery.geometry = geometry ? geometry : evt.mapPoint;
            self.aoiQuery.outSpatialReference = self.map.spatialReference;
            //Filter also on jobIds currently selected
            self.aoiQuery.where = self.jobIdField + " IN (" + self.selectedJobIds.join(",") + ")";
            
            if (self.poiQuery) {
                self.poiQuery.geometry = geometry ? geometry : evt.mapPoint;
                self.poiQuery.outSpatialReference = self.map.spatialReference;
                //Filter also on jobIds currently selected
                self.poiQuery.where = self.poiJobIdField + " IN (" + self.selectedJobIds.join(",") + ")";
            }
            
            var aoiReq = self.aoiQueryTask.execute(self.aoiQuery);
            var poiReq = (self.poiQueryTask) ? self.poiQueryTask.execute(self.poiQuery) : null;
            var promises = (poiReq) ? all([aoiReq, poiReq]) : all([aoiReq]);
            promises.then(
                function (results) {
                    if (results.length === 1) {
                        // AOI only
                        if (results[0].features && results[0].features.length > 0)
                            self.showFeatures(results[0].features, evt);
                        else
                            self.clearSelection();
                    } else if (results.length === 2) {
                        // AOI and POI
                        var hasAOIs = results[0].features && results[0].features.length > 0;
                        var hasPOIs = results[1].features && results[1].features.length > 0;
                        if (hasAOIs && hasPOIs) {
                            // TODO Show AOIs and POIs
                            console.log("AOIs and POIs found for map selection.");
                            var combinedFeatures = results[0].features.concat(results[1].features); 
                            self.showFeatures(combinedFeatures, evt);
                        } else if (hasAOIs) {
                            console.log("AOIs found for map selection.");
                            self.showFeatures(results[0].features, evt);
                        } else if (hasPOIs) {
                            console.log("POIs found for map selection.");
                            self.showFeatures(results[1].features, evt);
                        } else {
                            self.clearSelection();
                        }
                    } else {
                        // No results
                        self.clearSelection();
                    }
                },
                function(error) {
                    console.log("Error retrieving jobLOIs: " + error);
                }
            );
        },
        
        clearSelection: function() {
            var self = lang.hitch(this);
            //remove all graphics on the maps graphics layer
            self.graphicsLayer.removeAll();
            topic.publish(this.mapTopics.layer.clearSelection);
        },
        
        showFeature: function (feature, evt) {
            var self = lang.hitch(this);
            //console.log("Showing feature:", feature, evt);
            feature.setSymbol(self.symbol);
            topic.publish(this.mapTopics.layer.click, feature.attributes[self.jobIdField]);
        },
        
        showFeatures: function(features, evt) {
            var self = lang.hitch(this);
            //remove all graphics on the maps graphics layer
            self.graphicsLayer.removeAll();

            self.features = features;
            var numFeatures = self.features.length;
            var feature = features[0];
            self.featurePos = 0;
            self.featureCount = numFeatures;
            self.returnedFeatures = [];
            //Loop through features and build a an array of them.
            for (var i = 0; i < numFeatures; i++) {
                var graphic = features[i];
                if (graphic.geometry.type == "multipoint" || graphic.geometry.type == "point")
                    self.returnedFeatures[i] = graphic.attributes[self.poiJobIdField];
                else
                    self.returnedFeatures[i] = graphic.attributes[self.jobIdField];
            }

            // if only one publish to the normal topic
            // otherwise publish the array to the multiple get job topic
            if (numFeatures == 1) {
                feature.setSymbol(self.symbol);
                topic.publish(this.mapTopics.layer.click, self.returnedFeatures[0]);
            }
            else {
                feature.setSymbol(self.symbol);
                topic.publish(this.mapTopics.layer.multiClick, self.returnedFeatures, features[0].geometry);
            }
        },

        resize: function () {
            this.map.resize();
        },

        setMapExtent: function (args) {
            var self = this;

            var extent = args;
            if (!args) {
                extent = {
                    xmin: self.mapView.extent.xmin,
                    ymin: self.mapView.extent.ymin,
                    xmax: self.mapView.extent.xmax,
                    ymax: self.mapView.extent.ymax,
                    spatialReference: {
                        wkid: self.mapView.extent.spatialReference.wkid
                    }
                };
            }
            this.mapView.extent = new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, new SpatialReference(extent.spatialReference.wkid));
        },

        refreshLayers: function () {
            this.aoiDynamicLayer.refresh();
        },

        getUpdatedFeatures: function (jobIds) {
            this.selectedJobIds = jobIds;
            var sublayers = [];
            sublayers.push({
                id: this.aoiLayerID,
                visible: true,
                definitionExpression: this.jobIdField + " in (" + jobIds.join() + ")"
            });
            if (this.poiLayerID != null) {
                sublayers.push({
                    id: this.poiLayerID,
                    visible: true,
                    definitionExpression: this.poiJobIdField + " in (" + jobIds.join() + ")"
                });
            }
            this.aoiDynamicLayer.sublayers = sublayers;
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