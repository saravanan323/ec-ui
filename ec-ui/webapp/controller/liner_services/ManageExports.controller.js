sap.ui.define([
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/ecui/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.ecui.controller.liner_services.ManageExports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageExports").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("exportsDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("exportsDetailEdit").attachMatched(this._onRouteEditMatched, this);

            this._tableId = this.byId("table_Exports");
            this._pageId = this.byId("page_Exports");
        },
        _onRouteMatched: function () {
            this._mockData();
            this.disableItemNavigated(this._tableId);
        },
        _onRouteCreateMatched: function () {
            this._mockData();
            this.disableItemNavigated(this._tableId);
        },
        _onRouteEditMatched: function () {
            this._mockData();
        },
        _mockData: function () {
            let data = [
                {
                    shipmentNo: 22547,
                    voyageIndex: 18756,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22547,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Sohar",
                    status: 0
                },
                {
                    shipmentNo: 22548,
                    voyageIndex: 18757,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 1
                },
                {
                    shipmentNo: 22549,
                    voyageIndex: 18758,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 0
                }, {
                    shipmentNo: 22550,
                    voyageIndex: 18759,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 0
                }, {
                    shipmentNo: 22551,
                    voyageIndex: 18760,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 1
                },
            ]
            this.getView().setModel(new JSONModel(data), "mngExportsMdl")
        },
        onPressNavCreate: function () {
            let oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("exportsDetailCreate", {
                    layout: "MidColumnFullScreen"//oNextUIState.layout
                });
            }.bind(this));
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("mngExportsMdl");
            var oModel = this.getView().getModel("mngExportsMdl");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("voyageIndex", oBindingContext));

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("exportsDetailEdit", {
                    layout: oNextUIState.layout,
                    blNo: rowObj.blNo
                });
            }.bind(this));
        }
    });
});
