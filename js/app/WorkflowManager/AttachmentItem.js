define([
    "dojo/topic",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./templates/attachmentItem.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",

    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dijit/registry",

    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/Tooltip",
    "dijit/Dialog",

],

function (
    topic, declare, arrayUtil, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n, appTopics,
    lang, connect, parser, query, on, domStyle, registry,
    FilteringSelect, TextBox, Button, DropDownButton, Tooltip, Dialog) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: true,

        //i18n
        i18n_NoAttachmentType: i18n.attachmentItem.noAttachmentType,
        i18n_NoFilename: i18n.attachmentItem.noFilename,
        i18n_TypeUrl: i18n.attachmentItem.url,
        i18n_TypeEmbedded: i18n.attachmentItem.embedded,
        i18n_TypeFile: i18n.attachmentItem.file,
        i18n_OpenButton: i18n.attachmentItem.open,
        i18n_DialogPrompt: i18n.attachmentItem.prompt,
        i18n_DialogTitle: i18n.attachmentItem.dialogTitle,
        i18n_Ok: i18n.common.ok,

        attachmentTypeVar: null,
        attachmentLinkVar: null,
        attachmentFilenameVar: null,
        attachmentTitleVar: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        setContentURL: function(contentURL) {
            this.attachmentURLLink.href = contentURL;
        },

        //get the url at click
        openAttachment: function(){
            topic.publish(appTopics.attachment.getContentURL, this, { attachmentId: this.attachmentId });
        },

        startup: function () {
            console.log("AttachmentItem started");
            var self = lang.hitch(this);
            dijit.Tooltip.defaultPosition = ["below"];

            // Create a button programmatically:
            var removeAttachmentButton = new Button({
                "class": "icon-button",
                onClick: function () {
                    // Do something:
                    topic.publish(appTopics.attachment.removeAttachment, this, { attachmentId: self.attachmentId, nodeId: self.id });
                }
            }, self.btnRemoveAttachment);
            removeAttachmentButton.startup();

            if (self.folder != "") {
                self.attachmentLinkVar = self.folder;
                self.attachmentFilenameVar = self.folder;
                self.attachmentTitleVar = self.filename;
            } else {
                self.attachmentLinkVar = self.filename;
                self.attachmentFilenameVar = self.filename;
            };

            switch (self.storageType) {
                case 1:
                    self.attachmentTypeVar = self.i18n_TypeFile;
                    self.attachmentURLName.innerHTML = self.attachmentTitleVar;
                    self.attachmentURLLink.target = "_blank";
                    self.attachmentURLLink.onclick = function () {
                        self.openLink();
                        return false;
                    };
                    new Tooltip({
                        connectId: [self.attachmentURLLink],
                        label: self.attachmentTitleVar
                    });
                    break;
                case 2:
                    self.attachmentTypeVar = self.i18n_TypeEmbedded;
                    self.attachmentURLName.innerHTML = self.attachmentFilenameVar;
                    self.attachmentURLLink.onclick = function () {
                        self.openAttachment();
                        return true;
                    };
                    new Tooltip({
                        connectId: [self.attachmentURLLink],
                        label: self.attachmentFilenameVar
                    });
                    break;
                default:
                    self.attachmentTypeVar = self.i18n_TypeUrl;
                    self.attachmentURLName.innerHTML = self.attachmentFilenameVar;
                    self.attachmentURLLink.target = "_blank";
                    self.attachmentURLLink.href = self.checkURLLink(self.attachmentFilenameVar);
                    
                    new Tooltip({
                        connectId: [self.attachmentURLLink],
                        label: self.attachmentFilenameVar
                    });
                    
            };
            self.attachmentRemove.style.display = "";
            self.attachmentType.innerHTML = self.attachmentTypeVar;
            on(self.dialogOk, "click", function () {
                self.OpenFileDialog.hide();
            });
        },

        openLink: function(){
            this.LinkFilePath.innerHTML = this.folder + this.filename;
            this.OpenFileDialog.show();
        },

        checkURLLink: function (url) {
            var firstParam = url.split("//")[0];
            var urlArray = url.split("//");
            if (urlArray.length == 1) {
                url = "http://" + url;
            }
            return url;
        }
    });
});