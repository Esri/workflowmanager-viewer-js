define( function() {
    return {
        
        // valid themes: "claro", "nihilo", "soria", "tundra", "bootstrap"
        theme: "bootstrap",
        
        // Note: If using https, replace http with https and include port numbers
        //       6080 or 6443 as needed.
        app: {
            ServiceRoot: "https://workflowsample.esri.com/arcgis/rest/services/Workflow/WMServer",
            // Determines authentication mode to use for the application
            //  "windows"   - windows authentication
            //  "token"     - ArcGIS Server token authentication
            //  "portal"    - ArcGIS Portal authentication
            //                  (available in ArcGIS Workflow Manager (Classic) Server 10.3.1 and later versions)
            //  "none"      - not authenticated
            AuthenticationMode: "none",
            TokenService: "https://your-server/arcgis/tokens",
            // Portal URL and AppId only apply if using portal authentication
            PortalURL: "https://your-server/arcgis",
            // The default appId for the Workflow Manager (Classic) web application in Portal 10.5 and later versions is "wmxweb".
            // Update the appId to the appropriate value as needed.
            AppId: "wmxweb",
            // When specifying a domain with the default user, use "\\" to separate domain and username
            // e.g.  DefaultUser: "myDomain\\username"
            DefaultUser: "demo",
            // Auto login flag - only applies if AuthenticationMode is set to 'none' and a default user is specified
            AutoLogin: false,
            //Default Query - uncomment to use and set via a path, be sure to include all containing folders
            //DefaultQuery: "Public Queries\\Personal Queries\\all jobs",

            jobLOILayer: {
                type: "dynamic",
                url: "https://workflowsample.esri.com/arcgis/rest/services/Workflow_LOI/MapServer",
                // Point layer ID
                POILayerID: 0,
                // Polygon layer ID
                AOILayerID: 1,
                options: {
                    id: "jobsLoi",
                    title: "Jobs LOI",
                    opacity: "0.5",
                    visible: true
                }
            }
        },

        // Url to your proxy page, must be on same machine hosting your app
        proxy: {
            url: "proxy/proxy.ashx",
            alwaysUseProxy: false
        },
        
        // Geometry Service
        geometryServiceURL : "https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",       

        map: {
            // Confiugre maps to be included in the basemap gallery
            // Note: Only cached/tiled basemaps can be included in the gallery
            //       For other basemaps types, specify your map under 'customBasemap'
            basemapGallery: {
                // Enable / disable the basemap gallery.
                // Disable the map gallery to use your non-cached basemap configuration under 'customBasemap'
                isEnabled: true,

                // false - use custom basemaps
                //      (Define custom basemaps below)
                // true  - use ArcGIS basemaps
                //      (ArcGIS basemaps: "streets", "satellite", "hybrid", "topo", "gray", "oceans", "national-geographic", "osm")
                showArcGISBasemaps: true,

                // Select default basemap for the basemap gallery (ArcGIS basemap or custom basemap Id)
                defaultBasemap: "topo",

                // Custom basemaps for the basemap gallery
                // This section is required only if 'showArcGISBasemaps' is set to false
                customBasemaps : [
                    {
                        id: "streets",
                        title: "streets",
                        layers: [{
                            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                        }],
                        thumbnailUrl: "js/widget/gis/BasemapGallery/images/streets.jpg"
                    },
                    {
                        id: "hybrid",
                        title: "hybrid",
                        layers: [{
                            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                        },
                            {
                                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                                isReference: true,
                                displayLevels: [0, 1, 2, 3, 4, 5, 6, 7]
                            },
                            {
                                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
                                isReference: true,
                                displayLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                            }],
                        thumbnailUrl: "js/widget/gis/BasemapGallery/images/hybrid.jpg"
                    },
                    {
                        id: "topo",
                        title: "topo",
                        layers: [{
                            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                        }],
                        thumbnailUrl: "js/widget/gis/BasemapGallery/images/topo.jpg"
                    }
                ]
            },

            // Custom basemap support of other map types: dynamic, image
            // Specify a map to be used as the single basemap for the application
            customBasemap: {
                // Example of a dynamic basemap
                // Refer to the ArcGISDynamicMapServiceLayer documentation for options
                //      https://developers.arcgis.com/javascript/3/jsapi/arcgisdynamicmapservicelayer-amd.html
                type: "dynamic",
                url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
                options: {
                    id: "usaMap",
                    // imageParameters: {
                    //     layerIds: [1, 2],
                    //     layerOption: "show"
                    // },
                    opacity: 0.8,
                    showAttribution: false
                }

                // Example of an image service basemap
                // Refer to the ArcGISImageServiceLayer documentation for options
                //      https://developers.arcgis.com/javascript/3/jsapi/arcgisimageservicelayer-amd.html
                // type: "image",
                // url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Toronto/ImageServer",
                // options: {
                //     id: "torontoCanadaImagery",
                //     imageServiceParameters: {
                //         noData: 0,
                //     },
                //     opacity: 0.75
                // }
            },

            // InitialExtent: extent the the map starts at. 
            // helper tool: https://www.arcgis.com/home/item.html?id=dd1091f33a3e4ecb8cd77adf3e585c8a
            initialExtent: {
                xmin: -15489130.48708616,
                ymin: 398794.4860580916,
                xmax: -5891085.7193757,
                ymax: 8509680.431452557,
                spatialReference: {
                    wkid: 102100
                }
            },

            // Search widget provides a way to perform search capabilities based on locator service(s). 
            search: {
                // If the result does not have an associated extent, specify this number to use as the zoom scale for the result.
                zoomLevel: 1000,
                
                // false - use default locator service
                // true  - use custom locator service(s)
                customSources: false,
                
                // An array of locator sources used to find search results. Only applicable if using custom locator sources.
                // Refer to the esri/dijit/Search widget documentation for customizing locator sources.
                // https://developers.arcgis.com/javascript/3/jsapi/search-amd.html#sources
                // For example:
                // locatorSources: [
                //     {
                //         locator: new Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                //         <additional options>
                //     }
                // ]
                locatorSources: []
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
                tools: ["MULTI_POINT", "RECTANGLE", "POLYGON", "FREEHAND_POLYGON"],        // "POINT", "MULTI_POINT", "POLYGON", "FREEHAND_POLYGON", "RECTANGLE"
                
                // Selecting a point on the map is a little more difficult than selecting a polygon because 
                // the mouse click is required to fall directly on the point in order for a result to be returned. 
                // To makes things easier, a “tolerance” envelope can be built around the clicked point
                // by specifying a point tolerance (number of pixels).
                pointTolerance : 2
            }
        }        
    };
});
