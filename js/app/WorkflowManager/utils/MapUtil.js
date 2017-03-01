define(function() {
    return {
        
        /*
         * Converts a comma-separated list of layer Ids into an Array that can 
         * be applied to the visibleLayers property of ArcGISDynamicMapServiceLayer and 
         * ArcIMSMapServiceLayer.
         */
        parseLayerList: function (layers, asNumbers)
        {
            if (layers == null || layers.length == 0)
            {
                return null;
            }
            var layerIds = layers.split(",");
            for (var i = 0; i < layerIds.length; i++)
            {
                layerIds[i] = layerIds[i].trim();
                if (asNumbers)
                {
                    layerIds[i] = parseInt(layerIds[i]);
                }
            }
            //return new ArrayCollection(layerIds);
            return layerIds;
        },
   
        /*
         * Convenience function for converting a layer definition query list from
         * a compact representation to the expanded form expected by ArcGISDynamicMapServiceLayer.
         * 
         * For example, an input of:
         *   [ { "layerId":3, "query":"FIELD = 42" } ]
         * is converted to:
         *   [ "", "", "", "FIELD = 42" ]
         */
        formatLayerDefinitions: function (layerDefs)
        {
            var result = [];

            if (layerDefs == null || layerDefs.length == 0)
                return result;
            
            var length = layerDefs.length;
            for (var i = 0; i < length; i++)
            //for (var layerDef:Object in layerDefs)
            {
                var layerDef = layerDefs[i];
                var layerId = layerDef.layerId;
                var query = layerDef.query;
                
                var index = result.length;
                while (index <= layerId)
                {
                    result[index++] = "";
                    //result.push("");
                }
                result[layerId] = query;
            }
            return result;
        },
        
        getLayerDefinition: function (layerId, query)
        {
            return { "layerId":layerId, "query":query };
        }
    };
});
