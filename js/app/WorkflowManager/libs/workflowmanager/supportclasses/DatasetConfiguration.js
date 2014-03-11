define("workflowmanager/supportclasses/DatasetConfiguration", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        name: null,
        dataWorkspaceId: null,
        dataset: null,
        changeFields: null,
        changeCondition: null,
        whereConditions: []
    });
});