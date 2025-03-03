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
    return BaseController.extend("com.ecui.controller.liner_services.ManageVoyages", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("voyagesMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("voyagesDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("voyagesDetailEdit").attachMatched(this._onRouteEditMatched, this);

            this._tableId = this.byId("table_Voyages");
            this._pageId = this.byId("page_mngVoyages");
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
                    vesselIndex: 22547,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Sohar"
                },
                {
                    voyageIndex: 18757,
                    shippingLine: "Hopag Lloyd",
                    vesselIndex: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah"
                },
                {
                    voyageIndex: 18758,
                    shippingLine: "Hopag Lloyd",
                    vesselIndex: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah"
                },
                {
                    voyageIndex: 18759,
                    shippingLine: "Hopag Lloyd",
                    vesselIndex: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah"
                },
                {
                    voyageIndex: 18760,
                    shippingLine: "Hopag Lloyd",
                    vesselIndex: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah"
                },
                {
                    voyageIndex: 18761,
                    shippingLine: "Hopag Lloyd",
                    vesselIndex: 22548,
                    vesselName: "Northern Dexterity",
                    vesselETA: "11-Aug-2022 9:35",
                    vesselETS: "13-Aug-2022 19:35",
                    pod: "Salalah"
                }
            ]
            this.getView().setModel(new JSONModel(data), "voyagesMdl")
        },
        onPressNavCreate: function (oEvent) {
            let oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("voyagesDetailCreate", {
                    layout: "MidColumnFullScreen"//oNextUIState.layout
                });
            }.bind(this));
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("voyagesMdl");
            var oModel = this.getView().getModel("voyagesMdl");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("voyageIndex", oBindingContext));

            //this._pageId, setHeaderExpanded
            this._pageId.setHeaderExpanded(false)

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("voyagesDetailEdit", {
                    layout: oNextUIState.layout,
                    index: rowObj.voyageIndex
                });
            }.bind(this));
        }
    });
});
