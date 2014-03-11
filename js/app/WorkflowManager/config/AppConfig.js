define(function() {
	return {
		
		// valid themes: "claro", "nihilo", "soria", "tundra", "bootstrap", "flat", "arcgis"
	    theme: "bootstrap",
		
		app: {
		    ServiceRoot: "http://workflowsample.esri.com/arcgis/rest/services/Workflow/WMServer",
		    UseTokenAuthentication: false,
		    TokenService: "https://your-server/arcgis/tokens",
		    DefaultUser: "demo",
		    jobAOILayer: {
                type: "feature",
                url: "http://workflowsample.esri.com/arcgis/rest/services/AOI/MapServer/0",
                options: {
                    id: "jobsAoi",
                    title: "Jobs AOI",
                    opacity: "0.5",
                    visible: true
                }
            }
		},
		
		// url to your proxy page, must be on same machine hosting your app
		proxy: {
			url: "proxy/proxy.ashx",
			alwaysUseProxy: false
		},

		map: {
			// select default basemap (ArcGIS basemap or custom basemap Id)
			defaultBasemap: "topo",
			
			basemapGallery: {
				isEnabled: true,
				
                // false - use custom basemaps
                //      (Define custom basemaps in BasemapGallery.js)
				// true  - use ArcGIS basemaps
                //      (ArcGIS basemaps: "streets", "satellite", "hybrid", "topo", "gray", "oceans", "national-geographic", "osm")
				showArcGISBasemaps: true
			},
			
			// initialExtent: extent the the map starts at. 
			// helper tool: http://www.arcgis.com/home/item.html?id=dd1091f33a3e4ecb8cd77adf3e585c8a
			initialExtent: {
				xmin: -15489130.48708616,
				ymin: 398794.4860580916,
				xmax: -5891085.7193757,
				ymax: 8509680.431452557,
				spatialReference: {
					wkid: 102100
				}
			},
			
			showAttribution: false,
			showLogo: false,
			
			navigation: {
				slider: {
					isEnabled: true,
					style: "small",  // "small" or "large"
					position: "top-left", // "top-left", "top-right", "bottom-left", "bottom-right"
					orientation: "vertical", // "vertical" or "horizontal"
					labels: ["Street","County","State","Nation","World"] // Only valid when the "large" slider style option is true. 
				},
				hasPanControls: false	
			},
			
			overview: {
				isEnabled: false,
				position: "bottom-left", // "top-right","bottom-right","bottom-left" and "top-left"
				isVisibleOnStartup: true,
				hasMaximizeButton: false
			},
			
			scalebar: {
				isEnabled: false,
				position: "bottom-left",  // "top-right","bottom-right","top-center","bottom-center","bottom-left","top-left"
				style: "line", // ruler" or "line" --- When unit is set to dual the scalebar style will be set to line. As of version 3.4
				unit: "dual"  // "english" or "metric" and starting at version 3.4 "dual"
			},
			
			coordinates: {
				isEnabled: false
			},
			
			legend: {
				isEnabled: false,
				hasDropDownButton: true
			},
			
			drawTool: {
				isEnabled: true,
				tools: ["RECTANGLE", "POLYGON", "FREEHAND_POLYGON"]		// "POINT", "POLYLINE", "POLYGON", "FREEHAND_POLYGON", "RECTANGLE" 
			}
		}
	};
});