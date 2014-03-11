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
	
	"dojo/text!./Expander/templates/Expander.html",
	"dojo/i18n!./Expander/nls/Strings",
	
	"dijit/registry"
],

function (
	declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	topic, on, dom, domStyle, domClass, domAttr, lang, fx,
	template, i18n,
	registry
) {

	//anonymous function to load CSS files required for this module
	(function () {
		var css = [require.toUrl("./js/utils/Expander/css/Expander.css")];
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

	return declare("utils.Expander", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,
		widgetsInTemplate: true,
		i18n: i18n,
		isOpen: true,

		postCreate: function () {
			this.inherited(arguments);
			
			switch (this.region) {
				case "left":
					domClass.add(this.domNode, "expanderLeft");
					break;	
				case "right":
					domClass.add(this.domNode, "expanderRight");
					domAttr.set(this.expanderIcon, "title", i18n.right.close);
					break;
			}

			this.adjustPosition();
			this.own(on(this.expanderIcon, "click", lang.hitch(this, this.togglePane)));

		},

		startup: function () {
			console.log("Panel Expander started");
		},

		show:function(){
			domStyle.set(this.domNode, "display", "block");
		},

		hide: function(){
			domStyle.set(this.domNode, "display", "none");
		},

		adjustPosition: function () {
			if (this.region && this.horizontalMargin) {
				domStyle.set(this.domNode, this.region, this.horizontalMargin);
				domStyle.set(this.domNode, "top", "50%");
			}
		},

		togglePane: function () {
			var paneNode = this.attachedPane.domNode ? this.attachedPane.domNode : this.attachedPane; // if panel is a contentpane, then takes its dom node
			var marginDirection = this.region == "left" ? "marginLeft" : "marginRight";
			var borderDirection = this.region == "left" ? "borderRight" : "borderLeft";

			if (this.isOpen) {
				domStyle.set(this.domNode, { "left": "0", "top": "50%"});
				//domStyle.set(paneNode, marginDirection, "-" + this.horizontalMargin);
				domStyle.set(paneNode.children[0], "opacity", "0");
				fx.animateProperty({
					node: paneNode,
					duration: 400,
					properties: {
						width: 0
					},
					onEnd: lang.hitch(this, function () {
						registry.byId("borderContainer").resize();

						domClass.replace(this.expanderIconInner, "icon-double-angle-right", "icon-double-angle-left");
						// set button's title
						if (this.region == "left") {
							domAttr.set(this.expanderIcon, "title", i18n.left.open);
						}
						if (this.region == "right") {
							domClass.add(this.domNode, "expanderRight");
							domAttr.set(this.expanderIcon, "title", i18n.right.open);
						}

						this.isOpen = false;
					})
				}).play();
			} else {
				domStyle.set(paneNode, borderDirection, "0 none");
				//domStyle.set(paneNode, marginDirection, "0");
				domStyle.set(paneNode.children[0], "opacity", "1");
				domStyle.set(this.domNode, this.region, this.horizontalMargin);

				fx.animateProperty({
					node: paneNode,
					duration: 400,
					properties: {
						width: 400
					},
					onEnd: lang.hitch(this, function () {
						registry.byId("borderContainer").resize();
						domClass.replace(this.expanderIconInner, "icon-double-angle-left", "icon-double-angle-right");
						// set button's title
						if (this.region == "left") {
							domAttr.set(this.expanderIcon, "title", i18n.left.close);
						}
						if (this.region == "right") {
							domClass.add(this.domNode, "expanderRight");
							domAttr.set(this.expanderIcon, "title", i18n.right.close);
						}
						this.isOpen = true;
					})
				}).play();
			}
			
		}

	});

});