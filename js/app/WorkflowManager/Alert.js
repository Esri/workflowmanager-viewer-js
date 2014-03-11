define([
    "dijit/Dialog",
    "dojo/i18n!./nls/Strings"
], function(
    Dialog, i18n
) {
    return {
        
        show: function(title, message, error) {
            var dialogMsg = "";         
            if (message && message != "") {
                dialogMsg = message + "<br/><br/>";
            }
            if (error) {
                if (error.message) {
                    dialogMsg += error.message;
                }
                if (error.details && error.details.length > 0) {
                    dialogMsg += " " + error.details[0];
                }
            }
            var messageDialog = new Dialog({
                title: title,
                style: "width: 600px;",
                "class": "error-dialog",
                draggable: false,
                content: "<div class='tab row'>" +
                        dialogMsg +
                        "<br/><br/>" +
                        "</div>"
                        //This is causing some errors so I've removed it for now
                        //"<div class='dijitDialogPaneActionBar'>" +
                        //    "<button data-dojo-type='dijit/form/Button' type='button' data-dojo-props='onClick:function(){messageDialog.hide();}'>"+ i18n.common.ok + "</button>" +
                        //"</div>"
            });
            messageDialog.show();
        }
    };
});