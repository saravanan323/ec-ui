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
    return BaseController.extend("com.ecui.controller.liner_services.UploadManifest", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("uploadManifest").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this._mockData();
        },
        _mockData: function () {
            let data = [
                {
                    sNo: 1,
                    line: "HL",
                    blNo: "HLCAULY22037101"
                },
                {
                    sNo: 2,
                    line: "HL",
                    blNo: "HLCAULY22037101"
                }, {
                    sNo: 3,
                    line: "HL",
                    blNo: "HLCAULY22037101"
                }
            ]
            this.getView().setModel(new JSONModel(data), "blListMdl")
        },
        onExit: function () {
            this.oRouter.getRoute("uploadManifest").detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
