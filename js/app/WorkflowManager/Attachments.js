define([
    "dojo/topic",
    "dojo/dom",
    "dijit/registry",
	"dojo/_base/declare",
    "dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	
	"dojo/text!./templates/Attachments.html",
	"dojo/i18n!./nls/Strings",
    "app/WorkflowManager/AttachmentItem",
	"app/WorkflowManager/config/Topics",
	
	"dojo/_base/lang",
	"dojo/_base/connect",
    "dojo/_base/array",
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
	topic, dom, registry, declare, arrayUtil, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
	template, i18n, AttachmentItem, appTopics,
	lang, connect, arrayUtil, parser, query, on, domStyle, registry,
	FilteringSelect, TextBox, Button, DropDownButton) {

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,

	    //i18n
		i18n_JobName: i18n.properties.jobName,
		i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_NoAttachments: i18n.attachments.noAttachments,
		
		constructor: function () {

		},

		postCreate: function () {
			this.inherited(arguments);
		},

		startup: function () {
			console.log("Attachments started");
		},

		populateAttachments: function (jobAttachments) {
		    var self = lang.hitch(this);
		    arrayUtil.forEach(jobAttachments, function (data, index) {
		        console.log(data);

		        self.addAttachment({ attachmentId: data.id, storageType: data.storageType, type: data.type, folder: data.folder, filename: data.filename });
		    });
		},

		addAttachment: function (attachmentData) {
		    // create a new attachment item
		    var attachmentItem = new AttachmentItem(attachmentData);

		    // place the attachment item into the dom
		    attachmentItem.placeAt(this.fileListContainer);
		},

		removeAttachment: function (args) {
		    console.log("Removing attachment with id: " + args.attachmentId);

		    var attachmentContainer = this.fileListContainer;
            //Replace with dojo node reference
		    var attachmentNode = document.getElementById(args.nodeId);
		    //var attachmentNode = registry.byId(attachmentId);

		    attachmentContainer.removeChild(attachmentNode);
		}
		
	});
});