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
	"dijit/form/DropDownButton"
],

function (
	topic, declare, arrayUtil, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
	template, i18n, appTopics,
	lang, connect, parser, query, on, domStyle, registry,
	FilteringSelect, TextBox, Button, DropDownButton) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        widgetsInTemplate: true,

        //i18n
        i18n_NoAttachmentType: i18n.attachmentItem.noAttachmentType,
        i18n_NoFilename: i18n.attachmentItem.noFilename,
        i18n_TypeUrl: i18n.attachmentItem.url,
        i18n_TypeEmbedded: i18n.attachmentItem.embedded,
        i18n_TypeFile: i18n.attachmentItem.file,

        attachmentTypeVar: null,
        attachmentLinkVar: null,
        attachmentFilenameVar: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("AttachmentItem started");
            var self = lang.hitch(this);

            // Create a button programmatically:
            var removeAttachmentButton = new Button({
                "class": "icon-button",
                onClick: function () {
                    // Do something:
                    topic.publish(appTopics.attachment.removeAttachment, this, { attachmentId: self.attachmentId, nodeId: self.id });
                }
            }, self.btnRemoveAttachment);
            removeAttachmentButton.startup();

            switch (self.storageType) {
                case 1:
                    self.attachmentTypeVar = self.i18n_TypeFile;
                    break;
                case 2:
                    self.attachmentTypeVar = self.i18n_TypeEmbedded;
                    break;
                default:
                    self.attachmentTypeVar = self.i18n_TypeUrl;
            };

            if (self.folder != "") {
                self.attachmentLinkVar = self.folder;
                self.attachmentFilenameVar = self.folder;
            } else {
                self.attachmentLinkVar = self.filename;
                self.attachmentFilenameVar = self.filename;
            };

            //Set strings
            self.attachmentType.innerHTML = self.attachmentTypeVar;
            self.attachmentFilename.innerHTML = self.attachmentFilenameVar;
            self.attachmentLink.href = self.attachmentLinkVar;

        }
    });
});