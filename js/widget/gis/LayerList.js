define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

	"dojo/topic",
	"dojo/on",
	"dojo/when",
	"dojo/query",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/array",
	"dojo/_base/lang",

	"dojo/text!./LayerList/templates/LayerList.html",
	"dojo/i18n!./LayerList/nls/Strings",
    "app/ClimateAtlas/config/AppConfig",

	"dijit/registry",
	"dijit/form/Button",
	"dijit/form/CheckBox",
	"dijit/form/TextBox",
	"dijit/form/Textarea",
	"dijit/form/HorizontalSlider",
	"dijit/popup",
	"dijit/TooltipDialog",
	"dijit/Dialog",

	"esri/layers/FeatureLayer"
],

	function (
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
		topic, on, when, queryUtil, dom, domStyle, domConstruct, domClass, arrayUtil, lang,
		template, i18n, AppConfig,
		registry, Button, CheckBox, TextBox, Textarea, HorizontalSlider, popup, TooltipDialog, Dialog,
		FeatureLayer
	) {

		//anonymous function to load CSS files required for this module
		(function () {
			var css = [require.toUrl("./js/widget/gis/LayerList/css/LayerList.css")];
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
		return declare("app.LayerList", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			widgetsInTemplate: true,
			i18n: i18n,
			layersArray: [],
			isPinned: false,
			attrsShown: false,
			userDefinedLayersCount: 0,
			selectedClassNames: { layerInfoButon: "layer-info-button-selected", layerOpacityButon: "layer-opacity-button-selected" },

			postCreate: function () {
			    this.inherited(arguments);

			    //this.layersArray = [
                //    { layerUrl: "http://spot3dev:6080/arcgis/rest/services/MPORPODivBoundaries/MapServer", name: "MPO, RPO, and Division Boundaries", visible: true },
                //    { layerUrl: "http://spot3dev:6080/arcgis/rest/services/CTP/MapServer", name: "CTP Layer", visible: true }
			    //];

				this._initLayersDropDown(this.layersArray);

				this.own(on(this.addOnlineLayerButton, "click", lang.hitch(this, this.addOnlineLayerDialogShow)));
				this.own(on(this.attachShapeFileButton, "click", lang.hitch(this, this.addShapeFileDialogShow)));
				this.own(on(this.confirmAddOnlineLayerButton, "click", lang.hitch(this, this.addOnlineLayer)));
				this.own(on(this.addShapeFileButton, "click", lang.hitch(this, this.addShapeFile)));
				// subscribe to topics
				this.own(topic.subscribe("TOC/Dropdown/Closed", lang.hitch(this, this.closeAll)));
			},

			startup: function () {
				console.log("LayerList started");
			},			

			_initLayersDropDown: function (layersArray) {
				//create list
				this.listNode = domConstruct.create("ul", { "class": "listUL" }, this.layerListContainer);
				arrayUtil.forEach(layersArray, lang.hitch(this, function (layer, index) {
					if (layer) {
						//add layer to the map
						this.map.addLayerFromURL(layer, true).then(lang.hitch(this, function (newLayer) {
							this.createLayerItem(layer, newLayer);
						}));
					}
					else{
						//add a separator if the object is null
						domConstruct.create("li", {
							"class": "divider"
						}, this.listNode);
					}
				}));
			},

			createLayerItem: function (layerInfo, layer, userDefined) {
				// if this layer is the first user added layer, then add a divider
				if (userDefined && !this.userDefinedLayersCount) {
					domConstruct.create("li", {
						"class": "divider user-added-layers-divider"
					}, this.listNode);
				}

				var listItemNode = domConstruct.create("li", {}, this.listNode);

				var checkBox = new CheckBox({
					"checked": layerInfo.visible,
					"id": layer.id,
					"label": layerInfo.name,
					"onChange": lang.hitch(this, function () {
						layer.setVisibility(!layer.visible);
					})
				}).placeAt(listItemNode);
				var layerName = domConstruct.create("label", {
					"innerHTML": layerInfo.name,
					"class": "layerName",
					"for": checkBox.id
				}, checkBox.domNode, "after");
				var attachPoint = layerName;
				// add a remove button if the layer is added by user
				if (userDefined) {
					var layerRemoveButton = domConstruct.create("a", {
						"innerHTML": "<i class='icon-remove-sign'></i>",
						"class": "layer-icon-button layer-remove-button",
						"title": "Remove"
					}, layerName, "after");
					attachPoint = layerRemoveButton;
				}
				var layerInfoButton = domConstruct.create("a", {
					"innerHTML": "<i class='icon-info-sign'></i>",
					"class": "layer-icon-button",
					"title": "Show layer attributes"
				}, attachPoint, "after");
				var layerOpacityButton = domConstruct.create("a", {
					"innerHTML": "<i class='icon-eye-open'></i>",
					"class": "layer-icon-button layer-opacity-button",
					"title": "Change opacity",
					"value": layer.id
				}, layerInfoButton, "after");
				
				this.own(on(layerInfoButton, "click", lang.hitch(this, function () {
					this.showHideLayerAttrs(layerInfoButton);
				})));
				this.own(on(layerOpacityButton, "click", lang.hitch(this, function () {
					this.showHideLayerOpacity(layerOpacityButton);
				})));
				if (layerRemoveButton) {
					this.own(on(layerRemoveButton, "click", lang.hitch(this, function () {
						this.removeLayer(layer);
					})));
				}
			},

			createLayerAttrTable: function () {
				var outerDiv = domConstruct.create("div", { "style": "" });
				var header = domConstruct.create("div", {
				"style": "border-bottom: 1px solid #DDDDDD; margin: 0 -10px; padding: 0 10px 6px;"
				}, outerDiv);

				domConstruct.create("h3", {
					"innerHTML": "Metadata"
				}, header);

				domConstruct.create("a", {
					"href": "#",
					"class": "close-button",
					"style": "right: 18px; top:10px;",
					"onclick": lang.hitch(this, function () {
						this.hideAttrTable();
					})
				}, header);

				var container = domConstruct.create("div", { "class": "layer-attr-container" }, outerDiv);

				domConstruct.create("h3", {
					innerHTML: "Tags"
				}, container);
				domConstruct.create("p", {
					innerHTML: "Roads, Major Roads, State maintained roads, Interstate, Highways, Streets, Centerline, Transportation, Smooth Boundary, Functional Class, Urban, Rural, Boundaries"
				}, container);
				domConstruct.create("h3", {
					innerHTML: "Summary"
				}, container);
				domConstruct.create("p", {
					innerHTML: "This dataset was developed to represent the boundary line between urban and rural functional classification lines. It is used for HPMS reporting."
				}, container);
				domConstruct.create("h3", {
					innerHTML: "Description"
				}, container);
				domConstruct.create("p", {
					innerHTML: "Smooth Bounday represents the Urban Area boundaries (urbanized and small urban) of North Carolina. The boundaries were originally generated by the Census in 2000 and have been adjusted (smoothed) by the Trasnportation Planning Branch of the North Carolina Department of Transportation. Road within the Smooth Boundary are considered Urban; roads outside are considered rural."
				}, container);
				domConstruct.create("h3", {
					innerHTML: "Credits"
				}, container);
				domConstruct.create("p", {
					style: "color: #999",
					innerHTML: "There are no credits for this item."
				}, container);
				domConstruct.create("h3", {
					innerHTML: "Use limitations"
				}, container);
				domConstruct.create("p", {
					innerHTML: "The North Carolina Department of Transportation shall not be held liable for any errors in this data. This includes errors of omission, commission, errors concerning the content of the data, and relative and positional accuracy of the data. This data cannot be construed to be a legal document. Primary sources from which this data was compiled must be consulted for verification of information contained in this data. This data may not be resold."
				}, container);
				return outerDiv;
			},

			showHideLayerAttrs: function (sender) {
				queryUtil(".layerListContainer ." + this.selectedClassNames.layerOpacityButon).removeClass(this.selectedClassNames.layerOpacityButon);

				var isSelected = domClass.contains(sender, this.selectedClassNames.layerInfoButon);
				queryUtil(".layerListContainer ." + this.selectedClassNames.layerInfoButon).removeClass(this.selectedClassNames.layerInfoButon);
				
				if (isSelected) {
					popup.close(this.layerTooltipDialog);
					this.attrsShown = false;
				} else {					
					domClass.add(sender, this.selectedClassNames.layerInfoButon);
					if (!this.layerTooltipDialog) {
						// test use only 
						var layerAttrTable = this.createLayerAttrTable();
						this.layerTooltipDialog = new TooltipDialog({
							style: "max-width: 240px;",
							content: layerAttrTable
						});
						// this is for not to close the layers&legend dropdown when clicked this dialog
						this.own(on(this.layerTooltipDialog, "click", function (e) {
							e.stopPropagation();
						}));
					}
					popup.open({
						popup: this.layerTooltipDialog,
						around: sender.parentNode,
						orient: ["before-centered", "after-centered"]
					});
					this.attrsShown = true;
				} //end of else
			},

			setDropdown:function(dropdown){
				this.dropdown = dropdown;
			},

			hideAttrTable: function () {
				if (this.attrsShown) {
					var attrButton = queryUtil(".layerListContainer ." + this.selectedClassNames.layerInfoButon)[0];
					attrButton.click();
				}
			},

			showHideLayerOpacity: function (sender) {
				queryUtil(".layerListContainer ." + this.selectedClassNames.layerInfoButon).removeClass(this.selectedClassNames.layerInfoButon);

				var isSelected = domClass.contains(sender, this.selectedClassNames.layerOpacityButon);
				queryUtil(".layerListContainer ." + this.selectedClassNames.layerOpacityButon).removeClass(this.selectedClassNames.layerOpacityButon);

				if (isSelected) {
					popup.close(this.layerOpacityTooltipDialog);
					this.opacitySliderShown = false;
				} else {
					domClass.add(sender, this.selectedClassNames.layerOpacityButon);

					var layer = this.map.map.getLayer(sender.value);
					if (!this.layerOpacityTooltipDialog) {
						var outerDiv = domConstruct.create("div");
						var sliderContainer = domConstruct.create("div", {}, outerDiv);
						var span1 = domConstruct.create("span", { innerHTML: "0%", style: "display:inline-block" }, sliderContainer);
						this.opacitySlider = new HorizontalSlider({
							style: "width: 180px; display:inline-block",
							minimum: 0,
							maximum: 100,
							showButtons: false,
							name:layer.id,
							onChange: lang.hitch(this, function (value) {
								this.changeLayerOpacity(value);
							})
						});
						domConstruct.place(this.opacitySlider.domNode, sliderContainer);
						var span2 = domConstruct.create("span", { innerHTML: "100%", style: "display:inline-block" }, sliderContainer);

						this.layerOpacityTooltipDialog = new TooltipDialog({
							content: outerDiv
						});

						// this is for not to close the layers&legend dropdown when clicked this dialog
						this.own(on(this.layerOpacityTooltipDialog, "click", function (e) {
							e.stopPropagation();
						}));
					}

					this.opacitySlider.set({ "value": layer.opacity * 100, "name": layer.id });
					popup.open({
						popup: this.layerOpacityTooltipDialog,
						around: sender,
						orient: ["below-centered", "above-centered"]
					});
					this.opacitySliderShown = true;
				}
			},

			changeLayerOpacity: function (value) {
				var layerId = this.opacitySlider.get("name");
				var layer = this.map.map.getLayer(layerId);
				layer.setOpacity(value / 100);
			},

			hideLayerOpacitySlider:function(){
				if (this.opacitySliderShown) {
					var opacityButton = queryUtil(".layerListContainer ." + this.selectedClassNames.layerOpacityButon)[0];
					opacityButton.click();
				}
			},

			// add online layers
			addOnlineLayer: function () {
				var layerName = this.newOnlineLayerName.get("value");
				var layerUrl = this.newOnlineLayerUrl.get("value");
				var layerInfo = { layerUrl: layerUrl, name: layerName, visible: true };
				//add layer to the map
				this.map.addLayerFromURL(layerInfo, false).then(lang.hitch(this, function (newLayer) {
					this.createLayerItem(layerInfo, newLayer, true);
					this.onlineLayerDialog.hide();
					this.userDefinedLayersCount++;
				}));
			},

			removeLayer: function (layer) {
				//remove layer from map
				this.map.map.removeLayer(layer);
				//remove layer item from list
				var itemNode = registry.byId(layer.id).domNode.parentNode;
				registry.findWidgets(itemNode).forEach(function (item) {
					item.destroy();
				});
				domConstruct.destroy(itemNode);
				this.userDefinedLayersCount--;
				//if the removed layer is the last user defined layer, remove the separator
				if (!this.userDefinedLayersCount) {
					domConstruct.destroy(queryUtil(".user-added-layers-divider")[0]);
				}
				//hide opacity slider
				this.hideLayerOpacitySlider();
			},

			addOnlineLayerDialogShow: function () {
				this.onlineLayerDialog.show();
			},

			addShapeFileDialogShow: function () {
				this.attachShapeFileDialog.show();
			},

			closeAll: function () {
				this.hideAttrTable();
				this.hideLayerOpacitySlider();
			}

		});

	});