define("workflowmanager/supportclasses/ChangeRule", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        id: null,
        name: null,
        description: null,
        summarize: null,
        notifier: null,
        evaluators: []
    });
});