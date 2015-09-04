define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dijit/form/Button",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dojo/_base/connect",
    "dojo/on",
    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/topic",

    "dojo/i18n!./EsriSearch/nls/Strings",
    
    "esri/dijit/Search",
    "dojo/text!./EsriSearch/templates/EsriSearch.html",
    "app/WorkflowManager/config/Topics"
], 

function(
    declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
    Button, lang, Color, connect, on, domStyle, arrayUtil, topic,
    i18n,
    Search, Template, appTopics) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: Template,
        toolbar: null,
        graphics: null,

        postCreate: function() {
            this.inherited(arguments);
            var self = lang.hitch(this);

            this.search = new Search({
                map: this.map,
                zoomScale: this.zoomLevel,
            }, this.EsriSearchContainer);
            if (this.customSources)
                this.search.set('sources', this.sources);
            this.search.startup();
            on(this.search, 'select-result', function (e) {
                self.cleanup();
            });
        },
        
        startup: function () {
            console.log("Esri Search Tool started");
            
        },

        focusOnButton: function () {
            var self = lang.hitch(this);
            setTimeout(function () {
                self.search.submitNode.focus();
            }, 5);
            
        }
    });
});