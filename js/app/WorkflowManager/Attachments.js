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
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dijit/registry",
    "dojo/dom-class",
    
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/Tooltip",
    "dojox/form/Uploader",

    "./Constants"
    ],

function (
    topic, dom, registry, declare, arrayUtil, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    template, i18n, AttachmentItem, appTopics,
    lang, connect, parser, query, on, domStyle, registry, domClass,
    FilteringSelect, TextBox, Button, DropDownButton, Tooltip, Uploader,
    Constants) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,

        //number of attachments
        //for use with remove all
        numberAttachments: 0,
        attachmentList: [],

        listCollapsed: true,

        //i18n
        i18n_JobName: i18n.properties.jobName,
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_NoAttachments: i18n.attachments.noAttachments,
        i18n_RemoveAll: i18n.attachments.removeAll,
        i18n_AttachmentType: i18n.attachments.type,
        i18n_AttachmentFile: i18n.attachments.filename,
        i18n_AttachmentAction: i18n.attachments.action,
        i18n_Add: i18n.attachments.add,
        i18n_Ok: i18n.common.ok,
        i18n_AddEmbedTooltip: i18n.attachments.addEmbedAttachTooltip,
        i18n_AddLinkTooltip: i18n.attachments.addLinkAttachTooltip,
        i18n_AddURLTooltip: i18n.attachments.addURLAttachTooltip,
        i18n_LinkPrompt: i18n.attachments.linkPrompt,
        i18n_URLPrompt: i18n.attachments.urlPrompt,
        i18n_Browser: i18n.attachments.browser,
        i18n_Embed: i18n.attachments.embed,
        i18n_Link: i18n.attachments.link,
        i18n_URL: i18n.attachments.url,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var self = lang.hitch(this);
            console.log("Attachments started");

            //upload button and text box for file name
            this.uploader = new Uploader({
                id: "uploader",
                label: this.i18n_Browser,
                multiple: false,
                uploadOnSelect: false,
                url: "UploadFile.php",
                "class": "dojo-btn-success",
                onChange: function () {
                    var files = self.uploader.getFileList();
                    self.uploadAttachment(self.attachType, files[0]);
                }
            }, this.fileUploader);
            this.uploader.startup();
            this.fileBrowser = dijit.byId("uploader");

            this.attachDojoTextBox = new TextBox({
                value: ""
            }, this.attachTextBox);

            this.initTooltips();
            this.initEvents();
        },

        initTooltips: function () {
            new Tooltip({
                connectId: [this.addEmbedAttach],
                label: this.i18n_AddEmbedTooltip
            });
            new Tooltip({
                connectId: [this.addLinkAttach],
                label: this.i18n_AddLinkTooltip
            });
            new Tooltip({
                connectId: [this.addURLAttach],
                label: this.i18n_AddURLTooltip
            });
        },

        initEvents: function () {
            var self = lang.hitch(this);

            on(this.addButton, "click", function () {
                var value = self.attachDojoTextBox.get('value');
                self.uploadAttachment(self.attachType, value);
                self.attachDojoTextBox.set('value', "");
            });
            on(self.dialogOk, "click", function () {
                self.errorDialog.hide();
            });
        },

        toggleEmbedAttachmentType: function(){
            this.linkURLAttachmentContainer.style.display = "none";
            this.embedAttachmentContainer.style.display = "";
            this.attachType = Constants.JobAttachmentType.EMBEDDED;
        },

        toggleLinkAttachmentType: function(){
            this.attachDojoTextBox.set('placeHolder', this.i18n_LinkPrompt);
            this.embedAttachmentContainer.style.display = "none";
            this.linkURLAttachmentContainer.style.display = "";
            this.attachType = Constants.JobAttachmentType.FILE;
            this.attachDojoTextBox.set('value', "");
        },

        toggleURLAttachmentType: function(){
            this.attachDojoTextBox.set('placeHolder', this.i18n_URLPrompt);
            this.embedAttachmentContainer.style.display = "none";
            this.linkURLAttachmentContainer.style.display = "";
            this.attachType = Constants.JobAttachmentType.URL;
            this.attachDojoTextBox.set('value', "");
        },

        disableAttachments: function(){
            // Disable embedded attachments.  Form data not supported in esri/request
            //this.embedAttach.set('disabled', true);
            this.linkAttach.set('disabled', true);
            this.urlAttach.set('disabled', true);
            this.embedAttachmentContainer.style.display = "none";
        },

        enableAttachments: function(){
            // Disable embedded attachments.  Form data not supported in esri/request
            //this.embedAttach.set('disabled', false);
            this.linkAttach.set('disabled', false);
            this.urlAttach.set('disabled', false);
            this.embedAttachmentContainer.style.display = "";
        },

        //hide the attachment ui
        resetAttachmentPanes: function () {
            this.attachType = Constants.JobAttachmentType.EMBEDDED;
            this.linkURLAttachmentContainer.style.display = "none";
            if (this.canAddAttachments) {
                this.embedAttachmentContainer.style.display = "";
            }
            // Disable embedded attachments.  Form data not supported in esri/request
            //this.embedAttach.set('checked', true);
            this.linkAttach.set('checked', false);
            this.urlAttach.set('checked', false);
            this.attachDojoTextBox.set('value', "");
        },

        showErrorDialog: function () {
            this.dialogPrompt.innerHTML = this.i18n_HoldPrompt;
            this.errorDialog.show();
        },

        handlePrivileges: function (properties) {
            this.canRemove = (properties.canManageAttach && !(properties.jobHold) && !(properties.jobClosed));
            this.jobOnHold = (properties.jobHold && !properties.canAddHeld);
            this.canAddAttachments = !(properties.jobClosed || this.jobOnHold);

            if (properties.canManageAttach) {
                this.attachmentTypeContainer.style.display = "";
                if (!this.canAddAttachments) {
                    this.disableAttachments();
                } else {
                    this.enableAttachments();
                }
            } else {
                this.attachmentTypeContainer.style.display = "none";
            }
        },

        uploadAttachment: function (type, value) {
            switch (type) {
                case Constants.JobAttachmentType.URL:
                    topic.publish(appTopics.attachment.uploadAttachment, this, { url: value });
                    break;
                case Constants.JobAttachmentType.FILE:
                    topic.publish(appTopics.attachment.uploadAttachment, this, { link: value });
                    break;
                case Constants.JobAttachmentType.EMBEDDED:
                    var form = dom.byId('sendForm');
                    topic.publish(appTopics.attachment.uploadAttachment, this, { form: form });
                    break;
            }
        },

        populateAttachments: function (jobAttachments) {
            var self = lang.hitch(this);
            self.attachmentList = [];
            arrayUtil.forEach(jobAttachments, function (data, index) {
                console.log(data);
                self.addAttachments({ attachmentId: data.id, storageType: data.storageType, type: data.type, folder: data.folder, filename: data.filename });
            });
        },

        //flag is true then clear numberAttachments
        updateNumberAttachments: function (flag) {
            if (flag) {
                this.attachmentList = [];
                this.attachmentsInfo.innerHTML = this.i18n_NoAttachments;
                this.attachmentFileList.style.display = "none";
            } else {
                switch (this.attachmentList.length) {
                    case 0:
                        this.attachmentsInfo.innerHTML = this.i18n_NoAttachments;
                        this.attachmentFileList.style.display = "none";
                        break;
                    default:
                        this.attachmentsInfo.innerHTML = "";
                        this.attachmentFileList.style.display = "";
                }
            }
        },

        addAttachments: function (attachmentData) {
            // create a new attachment item
            var attachmentItem = new AttachmentItem(attachmentData);
            this.attachmentList.push({attachmentId: attachmentItem.attachmentId, nodeId: attachmentItem.id});
            // place the attachment item into the dom
            attachmentItem.placeAt(this.fileListContainer);
            if (!this.canRemove) {
                attachmentItem.attachmentRemove.style.display = "none";
            }
            this.updateNumberAttachments();
        },

        removeAttachment: function (args) {
            console.log("Removing attachment with id: " + args.attachmentId);
            var attachmentContainer = this.fileListContainer;
            //Replace with dojo node reference
            var attachmentNode = document.getElementById(args.nodeId);
            //var attachmentNode = registry.byId(attachmentId);

            //list only altered when signle removes happen
                for (key in this.attachmentList) {
                    var selected = this.attachmentList[key];
                    if (selected.attachmentId == args.attachmentId) {
                        break;
                    }
                }
                this.attachmentList.splice(key, 1);
            attachmentContainer.removeChild(attachmentNode);
            this.updateNumberAttachments();
        }
        
    });
});