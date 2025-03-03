sap.ui.define([
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core) {
    "use strict";
    var that = this;
    return BaseController.extend("com.ecui.controller.MockScreenDetail", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("mockScreenMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("mockScreenDetailCreate").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("mockScreenDetailEdit").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").name || this._item || "0";
            this._route = oEvent.getParameter("config").name
            //this._mockData();
        },
        _mockData: function () {
        },

        //Full Screen, Exit Full Screen, and Close 
        handleFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, name: this._item });
        },

        handleExitFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, name: this._item });
        },

        handleClose: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("mockScreenMaster", { layout: sNextLayout });
        },

        onExit: function () {
            this.oRouter.getRoute("mockScreenMaster").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
