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

    return BaseController.extend("com.ecui.controller.ValidationTest", {
        onInit: function () {
            that = this;
            that.getView().addStyleClass(that.getOwnerComponent().getContentDensityClass());//Generic Error management model
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ValidationTest").attachMatched(this._onObjectMatched, this);

            this.formId = this.getView().byId('validatinForm');
            this.pageId = this.getView().byId('validationPage');
            this.popoverBtn = this.getView().byId('validationPopBtn');

            var oData = { email: "email@gmail.com", password: "pass", phoneNumber: "", stepInput: "", min: new Date(), max: new Date('10/31/2022'), multiInput: "", textArea: "Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut " }
            var oModel = new JSONModel(oData)
            this.oView = this.getView();
            this.oView.setModel(oModel, "validatinMdl");
        },
        _onObjectMatched: function () {
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
        },

        handleMessagePopoverPress: function (oEvent) {
            this.errorMessagePopover(oEvent.getSource());
        },
        onPressSave: function () {
            var that = this;

            //Generic Error management model
            //var eMdl = this.getOwnerComponent().getModel('errors')
            //Error popover
            ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);

            var valid = this.eMdl.getData()
            if (valid.length == 0) {
                this.errorMessagePopoverClose()
                this.getRouter().navTo("dashboard")
            } else {
                this.errorMessagePopover(this.popoverBtn);
            }
        }
    });
});
