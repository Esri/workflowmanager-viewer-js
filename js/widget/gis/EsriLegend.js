define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/topic",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/_base/lang",
    "dojo/string",
    
    "esri/dijit/Legend",
    
    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    
    "dojo/text!./EsriLegend/templates/EsriLegend.html",
    "dojo/i18n!./EsriLegend/nls/Strings"
    ], 
    
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
        topic, dom, domStyle, domConstruct, domClass, lang, string, 
        Legend,
        DropDownButton, TooltipDialog,
        template, i18n
    ) {

    //anonymous function to load CSS files required for this module
    (function() {
        var css = [require.toUrl("./js/widget/gis/EsriLegend/css/EsriLegend.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for(var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());
        
    // main geolocation widget
    return declare("widget.gis.EsriLegend", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        
        i18n_Legend_Label: i18n.Legend_Label,
        
        postCreate: function() {
            this.inherited(arguments);
            
            this.legend = new Legend({
                map: this.map
            }, this.legendContainer);
            
            if (this.legendConfig.hasDropDownButton) {
                var legendDropDown = new TooltipDialog({
                    "content": this.legend,
                    "class": "legend-dropdown-dialog"
                });
                
                /*
                var legendButton = new DropDownButton({
                    label: this.i18n_Legend_Label,
                    "class": "legend-control",
                    dropDownPosition: ['below-centered', 'above-centered'],
                    dropDown: legendDropDown
                }, this.legend);
                */

                this.dropDownButton.set("dropDown", legendDropDown);
            } else {
                domStyle.set(this.dropDownButton.domNode, "display", "none");
                this.legend.startup();
            }
        },
        
        startup: function() {
            console.log("EsriLegend started");    
            
        }
    });
    
});