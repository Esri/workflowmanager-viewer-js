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
    "esri/geometry/screenUtils",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Polygon",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
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
    
    "dojo/promise/Promise",
    "dojo/promise/all",
    
    "dojo/_base/lang",
    "dojo/string",
    "dojo/i18n!./EsriMap/nls/Strings",

    "dojo/text!./EsriMap/templates/EsriMap.html",
    "app/WorkflowManager/config/Topics"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, arrayUtil,
        Map, Popup, Attribution, Basemap, BasemapLayer, OverviewMap, Scalebar, FeatureLayer, screenUtils, webMercatorUtils, Polygon, Extent, SpatialReference, GraphicsLayer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, QueryTask, Query,
        topic, on, dom, domStyle, domConstruct, domClass,
        Promise, all,
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
        returnedFeatures: [],
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
            
            // point tolerance
            if (this.mapConfig.drawTool.pointTolerance && this.mapConfig.drawTool.pointTolerance > 0)
                this.toleranceInPixels = this.mapConfig.drawTool.pointTolerance;
        },

        startup: function () {
            var self = lang.hitch(this);
            this.initTopics();
            
            //catch click events on links inside popup
            on(this.map.infoWindow.domNode, "a:click", function (event) {
                var featureId = event.target.attributes["data-feature-id"].value;

                if (event.target.attributes["data-feature-single"]) {
                    //open job dialog with selected id
                    
                    topic.publish(appTopics.grid.jobDialog, this, { selectedId: featureId, event: event, gridArr: self.returnedFeatures, gridArrPos: self.featurePos +1 });
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
                        self.featurePos = self.jobList.length -1;
                    self.features[self.featurePos].setSymbol(self.symbol);
                    topic.publish(appTopics.map.layer.select, self.returnedFeatures[self.featurePos], self.features[self.featurePos].geometry);
                    self.populateInfoWindow(self.jobList[self.featurePos], self.mapJobStatuses, self.mapJobPriorities);
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

            topic.subscribe(appTopics.map.setup, function (args) {
                self.mapJobPriorities = args.jobPriorities;
                self.mapJobStatuses = args.jobStatuses;
            });
        },
        
        drawLoi: function(jobId, loi, zoomToFeature) {
            if (loi && (loi.type == "point" || loi.type == "multipoint" ||
                (loi.type == "polygon" && (loi.rings && loi.rings.length > 0)))) {
                if (this.map.spatialReference == loi.spatialReference) {
                    this._drawLoi(loi, zoomToFeature);
                } else {
                    // Get the correct geometry for the map's spatial reference
                    this._getAndDrawLoi(jobId, zoomToFeature);
                }
            } else {
                this.graphicsLayer.clear();
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
                poiQuery .returnGeometry = true;
                poiQuery .outSpatialReference = self.map.spatialReference;
                poiQuery .where = self.poiJobIdField + "=" + jobId;
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
                            self.graphicsLayer.clear();
                        }
                    } else {
                        // No results
                        self.graphicsLayer.clear();
                    }
                },
                function(error) {
                    console.log("Error retrieving jobLOIs: " + error);
                }
            );
        },
        
        zoomToFeature: function (geometry) {
            if (geometry.type == "point") {
                this.map.centerAt(geometry);
            } else if (geometry.type == "multipoint") {
                this.map.setExtent(geometry.getExtent().expand(1.5));
            } else if (geometry.type == "polygon" && geometry.rings.length > 0) {
                this.map.setExtent(geometry.getExtent().expand(1.5));
            }
        },
    
        //add a boundary graphic of a selected state 
        addBoundaryGraphic: function (geometry, clearGraphics) {
            if (clearGraphics) {
                this.graphicsLayer.clear();
            }
            
            var symbol = (geometry.type == "point" || geometry.type == "multipoint") ? this.getMarkerSymbol(): this.getBoundarySymbol();
            var graphic = new esri.Graphic(geometry, symbol);
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
            self.map.addLayer(self.aoiDynamicLayer);
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
            var pixelWidth = this.map.extent.getWidth() / this.map.width;
            
            //calculate map coords for tolerance in pixel
            var toleraceInMapCoords = this.toleranceInPixels * pixelWidth;
            
            //calculate & return computed extent
            return new esri.geometry.Extent(
                point.x - toleraceInMapCoords,
                point.y - toleraceInMapCoords,
                point.x + toleraceInMapCoords,
                point.y + toleraceInMapCoords,
                this.map.spatialReference ); 
        },
        
        getLayerObject: function(layer) {
            var self = lang.hitch(this);
            var l;
            //empty features
            this.featurePos = 0;

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
            this.aoiQueryTask = new esri.tasks.QueryTask(aoiQueryLayerUrl);
            this.aoiQuery = new esri.tasks.Query();
            this.aoiQuery.returnGeometry = true;
            this.aoiQuery.outFields = [this.jobIdField];
            this.aoiQuery.outSpatialReference = this.map.spatialReference;  

            if (poiQueryLayerUrl) {
                //build POI query task and filter
                this.poiQueryTask = new esri.tasks.QueryTask(poiQueryLayerUrl);
                this.poiQuery = new esri.tasks.Query();
                this.poiQuery.returnGeometry = true;
                this.poiQuery.outFields = [this.poiJobIdField];
                this.poiQuery.outSpatialReference = this.map.spatialReference;  
            }

            this.markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 1.0]));
            this.symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 0.5]));
            this.singleFeature = this.showFeature;
        },
        
        //map click feature
        executeQueryTask: function (evt, geometry) {
            var self = lang.hitch(this);
            self.graphicsLayer.clear();

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
            self.graphicsLayer.clear();
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
            self.graphicsLayer.clear();

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