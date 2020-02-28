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
            //                  (available in ArcGIS Workflow Manager Server 10.3.1 and later versions)
            //  "none"      - not authenticated
            AuthenticationMode: "none",
            TokenService: "https://your-server/arcgis/tokens",
            // Portal URL and AppId only apply if using portal authentication
            PortalURL: "https://your-server/arcgis",
            // The default appId for the Workflow Manager web application in Portal 10.5 and later versions is "wmxweb".
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

        // url to your proxy page, must be on same machine hosting your app
        proxy: {
            url: "proxy/proxy.ashx",
            alwaysUseProxy: false
        },
        
        //geometry Service
        geometryServiceURL : "https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

        map: {
            // Confiugre maps to be included in the basemap toggle
            // Note: Only cached/tiled basemaps can be included in the gallery
            //       For other basemaps types, specify your map under 'customBasemap'
            basemapToggle: {
                // Enable / disable the basemap toggle.
                // Disable the basemap toggle to use your non-tiled basemap configuration under 'customBasemap'
                isEnabled: true,

                // false - use custom basemaps
                //      (Define custom basemaps below)
                // true  - use ArcGIS basemaps
                //      (ArcGIS basemaps: "streets", "satellite", "hybrid", "topo", "gray", "oceans", "national-geographic", "osm")
                showArcGISBasemaps: true,

                // Select default and next basemap for the basemap toggle (ArcGIS basemap or custom basemap Id)
                defaultBasemap: "topo",
                nextBasemap: "hybrid",

                // Custom basemaps for the basemap toggle
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
                                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"
                            },
                            {
                                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"
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

            // Custom basemap support for non-tiled map services: map-image, imagery
            // Specify a map to be used as the single basemap for the application
            customBasemap: {
                // Example of map-image map service (previously called dynamic map service)
                // Refer to the MapImageLayer documentation for options
                //      https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-MapImageLayer.html
                type: "map-image",
                properties: {
                    id: "usaMap",
                    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
                    // sublayers: [
                    // {
                    //     id: 1,
                    //     visible: true
                    // },
                    // {
                    //     id: 2,
                    //     visible: true
                    // }],
                    opacity: 0.8
                }

                // Example of an imagery map service
                // Refer to the ImageryLayer documentation for options
                //      https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-ImageryLayer.html
                // type: "imagery",
                // properties: {
                //     id: "torontoCanadaImagery",
                //     url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Toronto/ImageServer",
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
                //zoomLevel: 1000,

                // (Optional) An array of custom locator sources used to find search results.
                // If no custome sources are specified, the default settings in the Search widget will be used
                // Refer to the esri/widgets/Search documentation for customizing sources 
                // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#sources
                customSources: []
            }
        }
    };
});
