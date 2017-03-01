define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/topic",
    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/_base/lang",
    "dojo/string",
    "dojox/lang/functional",
    
    "widget/gis/EsriSearch",

    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    
    "dojo/text!./EsriSearch/templates/EsriSearchDropDown.html",
    "dojo/i18n!./EsriSearch/nls/Strings"
    ], 
    
    function(
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
        topic, query, on, dom, domStyle, domConstruct, domClass, lang, string, functional,
        EsriSearch,
        DropDownButton, TooltipDialog,
        template, i18n
    ) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        
        i18n_FindAddressLabel: i18n.findAddressLabel,
        
        postCreate: function() {
            this.inherited(arguments);
            var self = lang.hitch(this);

            this.SearchDropDown = new TooltipDialog({
                "content": new EsriSearch({
                    map: this.map,
                    customSources: this.customSources,
                    sources: this.sources
                })
            });

            this.SearchDropDownButton = new DropDownButton({
                label: self.i18n_FindAddressLabel,
                dropDown: self.SearchDropDown,
            }, this.dropDownButton);

            this.SearchDropDown.content.cleanup = function () {
                self.SearchDropDownButton.closeDropDown();
            };
            
            on(this.SearchDropDownButton, 'click', function (e) {
                self.SearchDropDown.content.focusOnButton();
            });
        },

        startup: function() {
            console.log("Esri Search DropDown started");    
        },
    });
    
});