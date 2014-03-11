define("workflowmanager/supportclasses/EmailNotifier", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        type: null,
        name: null,
        subject: null,
        message: null,
        senderEmail: null,
        senderName: null,
        subscribers: [],
        attachJobAttachments: false
    });
});