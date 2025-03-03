sap.ui.define([
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/f/library'
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, fioriLibrary) {
    "use strict";
    var that = this;
    return BaseController.extend("com.ecui.controller.MockScreen", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("mockScreenMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("mockScreenDetailCreate").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("mockScreenDetailEdit").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function () {
            //
            this._mockData();
        },
        _mockData: function () {
            let data = {
                Products: [
                    {
                        Name: "iPhone",
                        Quantity: 5,
                        Price: "500.00 AED"
                    },
                    {
                        Name: "Android",
                        Quantity: 5,
                        Price: "300.00 AED"
                    }
                ],
                Fields: [
                    {
                        Name: "Name",
                        items: [
                            {
                                Name: "iPhone"
                            },
                            {
                                Name: "Android"
                            }
                        ]
                    },
                    {
                        Name: "Quantity",
                        items: [
                            {
                                Name: "5"
                            },
                            {
                                Name: "6"
                            }
                        ]
                    },
                    {
                        Name: "Price",
                        items: [
                            {
                                Name: "100"
                            },
                            {
                                Name: "200"
                            }
                        ]
                    }
                ]
            }
            this.getView().setModel(new JSONModel(data), "mockData")
        },
        onPressNavCreate: function (oEvent) {
            let oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("mockScreenDetailCreate", {
                    layout: oNextUIState.layout
                });
            }.bind(this));
        },
        onListItemPress: function (oEvent) {
            var productObj = oEvent.getSource().getBindingContext("mockData").getObject(),
                oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("mockScreenDetailEdit", {
                    layout: oNextUIState.layout,
                    name: productObj.Name
                });
            }.bind(this));
        }
    });
});
