define([
    "dojo/_base/declare",
    "dojo/_base/array",
    //"dojo/request/registry",
    "dojo/_base/xhr",
    "dojo/store/Memory",
    "dojo/store/util/QueryResults",
    "dojo/store/util/SimpleQueryEngine"
], function(declare, arrayUtil, xhr, Memory, QueryResults, SimpleQueryEngine) {

    var commonMethods = ["get", "add", "put", "remove"];
    
    return declare(Memory, {
        // url: String
        // URL from which to fetch data for the store
        url: "",        
        
        constructor: function(options) {
            var self = this,
                promise;
            
            // Fire the request and store the returned promise for use by wrapped methods

            promise = this._promise = esri.request({
                url: this.url,
                content: this.params,
                handleAs:"json"
            });
            promise.then(
                function (data) {
                    console.log("Data: ", data);
                    self.setData(data);
                },
                function (error) {
                    console.log("Error: ", error.message);
                }
            );
            
            // Wrap common store functions
            // (query requires more work and is extended separately)
            arrayUtil.forEach(commonMethods, function(method) {
                var originalMethod = this[method];
                this[method] = function() {
                    var args = arguments; // store arguments from original invocation
                    
                    return promise.then(function() {
                        // Invoke original method after request promise resolves
                        return originalMethod.apply(self, args);
                    });
                };
            }, this); // don't forget context! (or use self inside instead of this)
        },
        
        // Extend the query method to also wait for the promise, for both the
        // results themselves and results.total
        query: function(query, options) {
            var self = this,
                results = new QueryResults(this._promise.then(function() {
                    // Defer to the store's query engine (SimpleQueryEngine by default)
                    return self.queryEngine(query, options)(self.data);
                }));
            results.total = results.then(function(results) {
                // SimpleQueryEngine populates a total property itself directly on
                // the results it returns, in the case of a paged query; in other cases,
                // the length of the array is indicative of the total size.
                return "total" in results ? results.total : results.length;
            });
            return results;
        }
        
    });
});