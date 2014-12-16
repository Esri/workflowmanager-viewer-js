define(function() {
    return {
        
        // valid themes: "claro", "nihilo", "soria", "tundra", "bootstrap"
        theme: "bootstrap",
        
        // Note: If using https, replace http with https and update the port number from
        //       6080 to 6443 as needed.
        app: {
            ServiceRoot: "http://workflowsample.esri.com:6080/arcgis/rest/services/Workflow/WMServer",
            // Determines authentication mode to use for the application
            //  "windows"   - windows authentication
            //  "token"     - ArcGIS Server token authentication
            //  "none"      - not authenticated
            AuthenticationMode: "none",
            TokenService: "https://your-server/arcgis/tokens",
            // When specifying a domain with the default user, use "\\" to separate domain and username
            // e.g.  DefaultUser: "myDomain\\username"
            DefaultUser: "demo",
            // Auto login flag - only applies if AuthenticationMode is set to 'none' and a default user is specified
            AutoLogin: false,

            jobAOILayer: {
                type: "dynamic",
                url: "http://workflowsample.esri.com:6080/arcgis/rest/services/AOI/MapServer",
                AOILayerID: 0,
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
                //      (Define custom basemaps below)
                // true  - use ArcGIS basemaps
                //      (ArcGIS basemaps: "streets", "satellite", "hybrid", "topo", "gray", "oceans", "national-geographic", "osm")
                showArcGISBasemaps: true
            },
            
            // Custom basemaps
            // This section is required only if 'showArcGISBasemaps' is set to false
            customBasemaps : [
                {
                    id: "streets",
                    title: "streets",
                    layers: [{
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                    }],
                    thumbnailUrl: "js/widget/gis/BasemapGallery/images/streets.jpg"
                },
                {
                    id: "hybrid",
                    title: "hybrid",
                    layers: [{
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    },
                    {
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                        isReference: true,
                        displayLevels: [0, 1, 2, 3, 4, 5, 6, 7]
                    },
                    {
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
                        isReference: true,
                        displayLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                    }],
                    thumbnailUrl: "js/widget/gis/BasemapGallery/images/hybrid.jpg"
                },
                {
                    id: "topo",
                    title: "topo",
                    layers: [{
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                    }],
                    thumbnailUrl: "js/widget/gis/BasemapGallery/images/topo.jpg"
                }
            ],

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
                tools: ["RECTANGLE", "POLYGON", "FREEHAND_POLYGON"]        // "POINT", "POLYLINE", "POLYGON", "FREEHAND_POLYGON", "RECTANGLE" 
            }
        }        
    };
});