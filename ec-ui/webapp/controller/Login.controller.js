sap.ui.define([
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Core',
    'sap/ui/core/Element',
    'com/ecui/utils/ErrorMessage'
    // 'com/app/customerportal/controller/Constant',
], function (BaseController, JSONModel, MessagePopover, MessageItem, Message, coreLibrary, Core, Element, ErrorMessage) {
    "use strict";
    var timerId, that;
    // shortcut for sap.ui.core.MessageType
    var MessageType = coreLibrary.MessageType;

    return BaseController.extend("com.ecui.controller.Login", {
        onInit: function () {
            that = this;
            that.getView().addStyleClass(that.getOwnerComponent().getContentDensityClass());
            //that.getView().setModel(new JSONModel(), "loginMdl");
            //that.showChatBot(false);
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("login").attachMatched(this._onObjectMatched, this);

            //validation related id parameters
            this.formId = this.getView().byId('loginForm');
            this.pageId = this.getView().byId('loginPage');
            this.popoverBtn = this.getView().byId('messagePopoverBtnLogin');
            //
            this.loginBtn = this.getView().byId("loginBtn");
            var oModel = new JSONModel({ email: "", password: "", enable: true })
            this.oView = this.getView();
            this.oView.setModel(oModel, "loginModel");
        },
        _onObjectMatched: function () {
            this.onPressChangePassword();
            //Default theme
            sap.ui.getCore().applyTheme("sap_fiori_3");
            //value state removing if existing state is thare means
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
        },
        onAfterRendering: function () {
            var view = this.getView();
            view.addDelegate({
                onsapenter: function () {
                    view.getController().onPressLogin();
                }
            });
        },

        handleMessagePopoverPress: function (oEvent) {
            //this.errorMessagePopover(oEvent.getSource());
        },
        onPressChangePassword: function (oEvent) {
            var cModel = this.getView().getModel('loginModel');
            cModel.getData().enable = true;
            cModel.refresh();
            this.loginBtn.setText("Login")
        },
        onPressLogin: function (oEvent) {
            var that = this;
            var cModel = this.getView().getModel('loginModel');
            var enableProp = cModel.getData().enable;
            //Error popover
            ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
            //
            var valid = this.eMdl.getData()
            if (valid.length == 0) {
                this.errorMessagePopoverClose()

                this.getRouter().navTo("dashboard");
            } else {
                //this.errorMessagePopover(this.popoverBtn);
            }
        }
    });
});
