define("workflowmanager/supportclasses/AOIEvaluator", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        type: null,
        name: null,
        relation: null,
        inverse: null,
        useJobAOI: null,
        aoi: null
    });
});