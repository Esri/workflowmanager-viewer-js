define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

	"dojo/topic",
	"dojo/on",
	"dojo/fx",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/_base/lang",
	"dojo/_base/array",

	"dijit/registry",

  "dojo/text!./ProjectCard/templates/ProjectCard.html",
	"dojo/i18n!./ProjectCard/nls/Strings",

	"./ProjectCard/_ProjectCardItem"
],

	function (
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
		topic, on, coreFx, dom, domStyle, domClass, domAttr, lang, arrayUtil,
		registry,
		template, i18n,
		_ProjectCardItem
	) {

		//anonymous function to load CSS files required for this module
		(function () {
			var css = [require.toUrl("./js/app/NCDOT/ProjectCard/css/ProjectCard.css")];
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

		// main geolocation widget
		return declare("app.ProjectCard", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			widgetsInTemplate: true,
			i18n: i18n,

			constructor: function () {
				this.stepItems = [
						"Project type",
						"Route",
						"Map Sketch",
						"Details",
						"Cost",
						"Score",
						"Summary"
				];
				this.cardItemList = [];
				this.currentCardId = 0;
			},

			postCreate: function () {
				this.inherited(arguments);
				arrayUtil.forEach(this.stepItems, lang.hitch(this, function (item, i) {
					if (i == this.stepItems.length - 1) {
						this.cardItemList[i] = new _ProjectCardItem({ 'label': item, 'class': 'card-item last', 'number': i + 1, 'status': 'not-started' }).placeAt(this.cardContainer);
					}
					else {
						this.cardItemList[i] = new _ProjectCardItem({ 'label': item, 'class': 'card-item', 'number': i + 1, 'status': 'not-started' }).placeAt(this.cardContainer);
					}
				}));
				this.cardItemList[0].setContainerTypeClass("active");

				// subscribe to topics from "Form" widget
				topic.subscribe("Form/stepRemoved", lang.hitch(this, this.removeNthStep));

				topic.subscribe("Form/StepChanged", lang.hitch(this, function (sender, args) {
					this.stepChanged(sender, args);
				}));

				topic.subscribe("Form/StepCompleted", lang.hitch(this, function (sender, args) {
					//this.updateStepSummary(sender, args);
				}));

				topic.subscribe("Form/ProjectSubmitted", lang.hitch(this, function (sender, args) {
					this._cancelClicked();
				}));

				//click events
				this.own(on(this.cancelButton, "click", lang.hitch(this, this._cancelClicked)));

				this.startup();
			},

			startup: function () {
				console.log("Project Card started");
			},

			_cancelClicked: function () {

				// show expander
				var expander = registry.byId("left").expander;
				if (expander) {
					expander.show();
				}

				// update left panel
				domStyle.set("left", { "width": "400px" });
				domStyle.set("projectListContainer", { "opacity": 1, "left": "0" });
				if (this.parentNode) {
					domStyle.set(this.parentNode, { "opacity": 0, "left": "-400px" });
				}
				registry.byId("borderContainer").resize();

				topic.publish("createNewProject/canceled", this);
			},

			// remove a step
			removeNthStep: function (sender, n) {
				//coreFx.wipeOut({
				//	node: this.cardItemList[n - 1].domNode,
				//	onEnd: lang.hitch(this, function () {
				//		this.cardItemList[n - 1].destroy();
				//		// reset step numbers
				//		for (i = n; i < this.cardItemList.length; i++) {
				//			this.cardItemList[i].setNumber(i);
				//		}
				//		this.stepItems.splice(n - 1, 1);
				//		this.cardItemList.splice(n - 1, 1);
				//		console.log(this.cardItemList);
				//	})
				//}).play();
			
			},

			stepChanged: function (sender, args) {
				var fromItemNode = this.cardItemList[args.from];
				var toItemNode = this.cardItemList[args.to];
				if (args.status) {
					// add click event to "succeeded" steps
					// TODO: consolidate click events
					if (args.status == "succeeded" ) {
						this.own(on(fromItemNode, "click", lang.hitch(this, function () {
							this.gotoNthStep(sender.currentStep, args.to);
						})));
					}
					if ( args.status == "uncompleted") {
						this.own(on(fromItemNode, "click", lang.hitch(this, function () {
							this.gotoNthStep(sender.currentStep, args.from + 1);
						})));
					}
					// for the "from" item
					domClass.remove(fromItemNode.domNode, "active");

					if (fromItemNode.status != "succeeded") {
						domClass.remove(fromItemNode.domNode, "uncompleted succeeded");
						domClass.add(fromItemNode.domNode, args.status);
						fromItemNode.setImage(args.status);
						fromItemNode.status = args.status;
					}
					//for the "to" item
					if (toItemNode.status != "succeeded") {
						domClass.remove(toItemNode.domNode, "active uncompleted succeeded");
						toItemNode.setImage(null);
						toItemNode.status = "in-progress";
					}

					domClass.add(toItemNode.domNode, "active");

				} else { //no status changed == null
					if (args.from >= 0) { // has "from" index
						if (fromItemNode.status == "in-progress") {
							domClass.remove(fromItemNode.domNode, "uncompleted succeeded");
							domClass.add(fromItemNode.domNode, "uncompleted");
							fromItemNode.setImage("uncompleted");
							fromItemNode.status = "uncompleted";
							// TODO: consolidate click events
							this.own(on(fromItemNode, "click", lang.hitch(this, function () {
								this.gotoNthStep(sender.currentStep, args.from + 1);
							})));
						}
						domClass.remove(fromItemNode.domNode, "active");
					}
					domClass.add(toItemNode.domNode, "active");
				}
			},

			gotoNthStep: function (from, to) {
				if (from != to) {
					topic.publish("ProjectCard/StepChanged", this, { from: from, to: to, status: null });
				}
			},

			updateStepSummary: function (sender, args) {
				var stepIndex = sender.currentStep - 1;
				domStyle.set(this.cardItemList[stepIndex].stepSummary, "display", "block");
				var stepSummaryNode = this.cardItemList[stepIndex].stepSummary;
				switch (stepIndex) {
					case 0:
						stepSummaryNode.innerHTML = args.projectMode + ", " + args.projectTier;
						break;
					case 1:
						var index = 0;
						var routes = args.routes;
						stepSummaryNode.innerHTML = "";
						for (route in args.routes) {
							if (index == Object.keys(args.routes).length - 1) {
								stepSummaryNode.innerHTML += routes[route].prefix + "-" + routes[route].number;
							} else {
								stepSummaryNode.innerHTML += routes[route].prefix + "-" + routes[route].number + ", ";
							}
							index++;
						};
						break;
					case 2:
						domClass.add(stepSummaryNode, "map-sketch");
						stepSummaryNode.innerHTML = "<i class='icon-map-marker'></i><span class='dots'></span><i class='icon-map-marker'></i>";
						break;
					case 3:
						stepSummaryNode.innerHTML = args.transPlan + ", " + args.functionalClassification;
						break;
					case 4:
						stepSummaryNode.innerHTML = "<i class='icon-dollar' style='margin-right: 8px'></i>" + args.totalCost;
						break;
					case 5:
						var content = "";
						for (var i = 0; i < 3; i++) {
							if (i != args.length - 1) {
								content += args[i] + "/";
							} else {
								content += args[i];
							}
						}
						stepSummaryNode.innerHTML = content;
						break;
				}
			}

		});

	});