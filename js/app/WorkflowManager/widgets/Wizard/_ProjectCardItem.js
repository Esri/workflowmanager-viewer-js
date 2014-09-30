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

  "dojo/text!./templates/_ProjectCardItem.html",
    "dojo/i18n!./nls/Strings"
],

    function (
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        topic, on, dom, domStyle, domClass, domAttr, lang, fx,
        template, i18n
    ) {

        return declare("app._ProjectCardItem", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            widgetsInTemplate: true,
            i18n: i18n,

            postCreate: function () {
                this.inherited(arguments);
                this.setNumber(this.number);            
                this.setLabel(this.label);
            },

            startup: function () {

            },

            setNumber: function(number){
                this.icon.innerHTML = number;
            },

            setLabel: function (label) {
                this.text.innerHTML = label;
            },

            setImage: function (type) {
                dojo.removeClass(this.icon);
                var styleClass = "";
                switch (type) {
                    case "succeeded":
                        styleClass = "icon-ok icon-white";
                        break;
                        
                    case "uncompleted":
                        styleClass = "icon-question icon-white";
                        break;
                    default:
                        styleClass = "";
                }
                dojo.addClass(this.icon, styleClass);
            },
            setContainerTypeClass: function (type) {
                domClass.remove(this.container, ["done", "active", "missing", "question", "empty"]);
                domClass.add(this.container, type);
            }

        });

    });