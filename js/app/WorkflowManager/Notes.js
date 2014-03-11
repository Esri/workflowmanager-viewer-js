define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	
	"dojo/text!./templates/Notes.html",
	"dojo/i18n!./nls/Strings",
	"app/WorkflowManager/config/Topics",
	
	"dojo/_base/lang",
    "dojo/topic",
	"dojo/_base/connect",
	"dojo/parser",
	"dojo/query",
	"dojo/on",
	"dojo/dom-style",
	"dijit/registry",
	
	"dijit/form/FilteringSelect",
	"dijit/form/TextBox",
    "dijit/form/Textarea",
	"dijit/form/Button",
	"dijit/form/DropDownButton"
	],

function (
	declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
	template, i18n, appTopics,
	lang, topic, connect, parser, query, on, domStyle, registry,
	FilteringSelect, TextBox, Textarea, Button, DropDownButton) {

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,

	    //i18n
		i18n_JobNote: i18n.notes.jobNote,

		constructor: function () {

		},

		postCreate: function () {
			this.inherited(arguments);
		},

		startup: function () {
		    var self = lang.hitch(this);
		    console.log("Notes started");

		    // job notes
		    this.createNotesTextarea = new Textarea({
		        placeHolder: i18n.common.loading,
		        id: "createNotesTextarea",
		        name: "createNotesTextarea",
		        disabled: true,
		        style: "width: 400px; min-height: 100px; max-height:100px;"
		    }, this.notesTextarea);
		    this.createNotesTextarea.startup();

		    // Save notes button
		    this.notesSaveButton = new Button({
		        label: i18n.notes.saveNote,
		        id: "notesSaveButton",
		        name: "notesSaveButton",
		        disabled: true,
		        style: "width:160px;",
		        onClick: lang.hitch(this, function () {
		            this.saveButtonClicked();
		        })
		    }, this.btnNotesSave);
		    this.notesSaveButton.startup();

		    on(this.notesForm, "submit", lang.hitch(this, function (e) {
		        e.preventDefault();
		        e.stopPropagation();

		        console.log("FORM SUBMITTED");
		        self.saveButtonClicked();
		    }));
        },

		setCurrentJobNotes: function(data) {
		    this.createNotesTextarea.set("value", data);
		},
		
		setEditable: function (isEditable) {
            if (isEditable) {
                // editable
                this.createNotesTextarea.set("disabled", false);
                this.notesSaveButton.set("disabled", false);
            } else {
                // not editable
                this.createNotesTextarea.set("disabled", true);
                this.notesSaveButton.set("disabled", true);
            }
        },

		saveButtonClicked: function () {
		    console.log("save notes button clicked");
		    topic.publish(appTopics.notes.noteUpdate, this, { noteValue: this.createNotesTextarea.value });
		}
	});
});