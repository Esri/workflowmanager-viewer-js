define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/on",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/_base/lang",

    "dojo/text!./Login/templates/Login.html",
    "dojo/i18n!./Login/nls/Strings",

    "dijit/form/Form",
    "dijit/form/Button",
    "dijit/form/ValidationTextBox"
],

    function (
        declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        on, dom, domAttr, domStyle, lang,
        template, i18n,
        Form, Button, ValidationTextBox
    ) {

        //anonymous function to load CSS files required for this module
        (function () {
            var css = [require.toUrl("./js/widget/Login/css/Login.css")];
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
        return declare("app.Login", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            widgetsInTemplate: true,
            i18n: i18n,
            tooltip: null,

            defaultUser: null,
            useTokenAuthentication: false,

            i18n_Login: i18n.button.title,
            i18n_LoginAttempt: i18n.button.titleLoginAttempt,

            postCreate: function () {
                this.inherited(arguments);
                // TODO Is this really necessary if we already have something to handle submitting the form?
                on(this.loginButton, "click", lang.hitch(this, this.validateUser));
            },

            startup: function (user) {
                var self = lang.hitch(this);
                console.log("Login page started");
                
                // TODO Check if there is a user/token cookie

				// set user
                if (user && user != null && user != "")
                    this.usernameInput.set("value", user);
                else
                    this.usernameInput.set("value", self.defaultUser);                
                this.usernameInput.set("required", true);

                if (self.authenticationMode == "token")
                    self.useTokenAuthentication = true;

                if (self.useTokenAuthentication) {
                    console.log("Token authentication, password is required");
                    //show password stuff
                    self.passwordInput.set("required", true);
                    domStyle.set(self.passwordContainer, "display", "inline");
                } else {
                    if (self.authenticationMode == "portal")
                        console.log("Portal authentication ...");
                    else
                        console.log("Password is not required");
                    //hide show password stuff
                    self.passwordInput.set("required", false);
                    domStyle.set(self.passwordContainer, "display", "none");
                }

                //Stops page from refreshing and validates the user input
                on(this.loginForm, "submit", lang.hitch(this, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("FORM SUBMITTED");
                    self.validateUser();
                }));
                
                //This should happen when the controller is ready for login
                domStyle.set(this.loginPage, "opacity", "1");
                domStyle.set("loadingMessage", "display", "none");
                domStyle.set("loadingImage", "display", "none");

                if (user) {
                    this.validateUser(user);
                }
            },

            validateUser: function (user) {
                var self = lang.hitch(this);
                if (!(typeof user == "string")) {
                    user = null;
                }
                if (!user) {
                    //get username input
                    self.loginErrorContainer.innerHTML = "";
                    var username = self.usernameInput.get("value");
                    if (!username || username.trim() == "") {
                        // no username entered
                        self.loginErrorContainer.innerHTML = i18n.error.invalidUsername;
                        return;
                    }

                    //get password input
                    var password = self.passwordInput.get("value");
                    if (self.useTokenAuthentication) {
                        if (!password) {
                            // no password entered
                            self.loginErrorContainer.innerHTML = i18n.error.invalidPassword;
                            return;
                        }
                    }
                } else {
                    var username = user;
                }

                self.loginButton.set("disabled", true);
                self.loginButton.set("label", this.i18n_LoginAttempt);

                //validate user
                self.currentUsername = username;
                self.controller.validateLogin(self.currentUsername, password);
                
            },
            
            invalidUser: function() {
                // handle an invalid user login
                if (this.useTokenAuthentication) {
                    this.loginErrorContainer.innerHTML = i18n.error.invalidUsernameOrPassword;
                } else {
                    this.loginErrorContainer.innerHTML = i18n.error.invalidUsername;    
                }
                this.loginButton.set("disabled", false);
                this.loginButton.set("label", "Login");
            }
        });
    });