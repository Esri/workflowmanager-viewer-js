define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

	"dojo/topic",
	"dojo/on",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/_base/lang",
	"dojo/_base/fx",

    "dojo/text!./Wizard/templates/Wizard.html",
    "dojo/i18n!./Wizard/nls/Strings",

	"dijit/registry",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/DropDownMenu",
	"dijit/MenuItem",
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/form/RadioButton",
	"dijit/form/CheckBox"
],

	function (
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
		topic, on, dom, domStyle, domClass, domAttr, lang, fx,
		template, i18n,
		registry, Button, DropDownButton, DropDownMenu, MenuItem, Select, TextBox, RadioButton, CheckBox,
		ProjectType, Route, MapSketch, Details, Cost, Score, Summary,
		enums
	) {

		//anonymous function to load CSS files required for this module
		(function () {
		    var css = [require.toUrl("./js/app/WorkflowManager/widgets/Wizard/css/Wizard.css")];
			var head = document.getElementsByTagName("head").item(0),
					link;
			for (var i = 0, il = css.length; i < il; i++) {
				link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = css[i].toString();
				head.appendChild(link);
			}
		}());

		return declare("app.Form", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			widgetsInTemplate: true,
			i18n: i18n,
			currentStep: 1,

			postCreate: function () {
				this.inherited(arguments);

                /*
				this.stepItems = [
						{ title: "Project type", widget: null },
						{ title: "Route", widget: null },
						{ title: "Map Sketch", widget: null },
						{ title: "Details", widget: null },
						{ title: "Cost", widget: null },
						{ title: "Score", widget: null },
						{ title: "Summary", widget: null }
				];

				// this object stores all input data from each step
				this.projectData = [];

				domStyle.set(this.saveDialogButton.domNode, "display", "none");

				on(this.previousButton, "click", lang.hitch(this, this.GoToPreviousStep));
				on(this.nextButton, "click", lang.hitch(this, this.GoToNextStep));
				on(this.submitButton, "click", lang.hitch(this, this.SubmitProject));
				// add step 1's content to form's body
				this.GoToNthStep(0, 1);

				// subcribe to topics
				topic.subscribe("createNewProject/canceled", lang.hitch(this, function () {
					this.hide();
				}));

				topic.subscribe("ProjectCard/StepChanged", lang.hitch(this, function (sender, args) {
					this.currentStep = args.to;
					this.GoToNthStep(args.from, args.to, args.status);
				}));
                */

				// show
				//this.show();
			},

			startup: function () {
				console.log("Wizard started");
			},

			show: function () {
			    domStyle.set(this.domNode, "display", "block");
			    //domStyle.set(this.ProjectCardContainer, { "opacity": 1, "left": "0" });
                /*
			    fx.animateProperty({
			        node: this.domNode,
			        duration: 500,
			        properties: {
			            opacity: 1,
			            left: { end: 250, start: 300, units: "px" }
			        }
			    }).play();
                */
			},

			hide: function(){
			    fx.animateProperty({
			        node: this.domNode,
			        duration: 500,
			        properties: {
			            opacity: 0,
			            left: { end: 450, start: 400, units: "px" }
			        },
			        onEnd: lang.hitch(this, function () {
			            domStyle.set(this.domNode, "display", "none");
			        })
			    }).play();
			},

		    // Page navigations
			GoToPreviousStep: function () {
				this.currentStep -= 1;
				this.GoToNthStep(this.currentStep + 1, this.currentStep, "uncompleted");
			},

			GoToNextStep: function () {
			    var self = lang.hitch(this);

				if (this.stepItems) {
					var formValues = this.stepItems[this.currentStep - 1].widget.getFormValues();
					// push into projectData
					if (!this.projectData[this.currentStep - 1]) {
						this.projectData.push({ stepName: this.stepItems[this.currentStep - 1].title, data: formValues });
					} else {
						this.projectData[this.currentStep - 1] = { stepName: this.stepItems[this.currentStep - 1].title, data: formValues };
					}
					console.log(this.projectData);
					topic.publish("Form/StepCompleted", this, formValues);

				}
			},

			GoToNthStep: function (from, to, status) {
				// show/hide "previous" button
				if (to > 1) {
					domStyle.set(this.previousButton.domNode, "display", "block");
				} else {
					domStyle.set(this.previousButton.domNode, "display", "none");
				}
				// reposition the left arrow
				domStyle.set(this.stepArrow, "top", 116 + 54 * (to - 1) + "px");

				// update title
				this.stepNumber.innerHTML = to;
				this.stepTitle.innerHTML = this.stepItems[to - 1].title;

				// update form body
				this.updateFormBody(to);

				topic.publish("Form/StepChanged", this, { from: from - 1, to: to - 1, status: status });
			},

			updateFormBody: function (n) {
				//hide previous step's content
				if (this.visibleStepWidget) {
					domStyle.set(this.visibleStepWidget.domNode, "display", "none");
				}
				if (!this.stepItems[n - 1].widget) {
					var step;
					switch (this.stepItems[n - 1].title) { //TODO: put titles in an enum
						case "Project type":
							step = new ProjectType({mode: this.projectMode}, this.formBody);
							break;
						case "Route":
							step = new Route({mode: this.projectMode, highwayImprovementType: this.mapMode}).placeAt(this.stepItems[n - 2].widget, "after");
							break;
						case "Map Sketch":
							step = new MapSketch({ mode: this.projectMode }).placeAt(this.stepItems[n - 2].widget, "after");
							this.switchToMapSketch();
							break;
						case "Details":
							step = new Details({ mode: this.projectMode, detailsMode: this.detailsMode, improvementTypeId: this.improvementTypeId}).placeAt(this.stepItems[n - 2].widget, "after");
							break;
						case "Cost":
							step = new Cost({ mode: this.projectMode }).placeAt(this.stepItems[n - 2].widget, "after");
							this.switchToCost();
							break;
						case "Score":
							step = new Score({ mode: this.projectMode, scoreMode: this.scoreMode }).placeAt(this.stepItems[n - 2].widget, "after");
							this.switchToScore();
							break;
						case "Summary":
							step = new Summary({ data: this.projectData }).placeAt(this.stepItems[n - 2].widget, "after");
							this.switchToSummary();
							break;
					}
					step.startup();

					this.stepItems[n - 1].widget = step;
					this.visibleStepWidget = step;
				} else {
					this.visibleStepWidget = this.stepItems[n - 1].widget;
					domStyle.set(this.stepItems[n - 1].widget.domNode, "display", "");
					// switch to map while in the "Map Sketch" step
					if (n == 3) {
						this.switchToMapSketch();
					} else if (n == 5) {
						this.switchToCost();
					} else if (n == 6) {
						this.switchToScore();
					} else if (n == 7) {
						this.stepItems[6].widget.toggleProjectMode(this.projectData);

						this.switchToSummary();
					}
				}

				
			},

		});

	});