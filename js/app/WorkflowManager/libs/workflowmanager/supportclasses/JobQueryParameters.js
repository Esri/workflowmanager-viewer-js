define("workflowmanager/supportclasses/JobQueryParameters", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        fields: null,
        aliases: null,
        tables: null,
        where: null,
        orderBy: null
    });
});