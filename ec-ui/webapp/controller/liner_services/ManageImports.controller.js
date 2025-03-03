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
    return BaseController.extend("com.ecui.controller.liner_services.ManageImports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageImports").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("importsDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("importsDetailEdit").attachMatched(this._onRouteEditMatched, this);

            this._tableId = this.byId("table_Imports");
            this._pageId = this.byId("page_Imports");
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
                    voyageIndex: 18758,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22549,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 0
                }, {
                    voyageIndex: 18759,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22550,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 0
                }, {
                    voyageIndex: 18760,
                    shippingLine: "Hopag Lloyd",
                    blNo: 22551,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah",
                    status: 1
                },
            ]
            this.getView().setModel(new JSONModel(data), "mngImportsMdl")
        },
        onPressNavCreate: function () {
            let oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("importsDetailCreate", {
                    layout: "MidColumnFullScreen"//oNextUIState.layout
                });
            }.bind(this));
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("mngImportsMdl");
            var oModel = this.getView().getModel("mngImportsMdl");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("blNo", oBindingContext));

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("importsDetailEdit", {
                    layout: oNextUIState.layout,
                    blNo: rowObj.blNo
                });
            }.bind(this));
        }
    });
});
