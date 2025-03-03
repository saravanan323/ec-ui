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
    return BaseController.extend("com.ecui.controller.liner_services.AddEditImports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageImports").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("importsDetailCreate").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("importsDetailEdit").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "ImportsMdl");
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").blNo || oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name
            this.getView().setModel(new JSONModel({ route: this._route, item: this._item, consignee: [], containerDetails: [], cargoDetails: [], freightDetails: [], consigneeCount: 0, cargoCount: 0, containerCount: 0, freightCount: 0 }), "ImportsMdl");
            this._mockData();
        },
        onPressAddItem: function () {
            let obj = {
                type: null,
                code: null,
                name: null,
                city: null,
                postalCode: null,
                country: null
            }
            let oModel = this.getView().getModel("ImportsMdl");
            oModel.getData().consignee.push(obj)
            oModel.getData().consigneeCount = oModel.getData().consignee.length;
            oModel.refresh();
        },
        onPressDeleteItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().consignee;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().consigneeCount = oModel.getData().consignee.length;
            oModel.refresh();
        },

        onPressAddContainerItem: function () {
            let obj = {
                containerNo: null,
                sealNo: null,
                size: null,
                type: null,
                cargoWt: null,
                soc: null,
                shipperDest: null,
                imco: null,
                oog: null,
                damages: null,
                reeferTemp: null,
                packages: null
            }
            let oModel = this.getView().getModel("ImportsMdl");
            oModel.getData().containerDetails.push(obj)
            oModel.getData().containerCount = oModel.getData().containerDetails.length;
            oModel.refresh();
        },
        onPressDeleteContainerItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().containerDetails;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().containerCount = oModel.getData().containerDetails.length;
            oModel.refresh();
        },

        onPressAddCargoItem: function () {
            let obj = {
                containerNo: null,
                sealNo: null,
                size: null,
                type: null,
                cargoWt: null,
                soc: null,
                shipperDest: null,
                imco: null,
                oog: null,
                damages: null,
                reeferTemp: null,
                packages: null
            }
            let oModel = this.getView().getModel("ImportsMdl");
            oModel.getData().cargoDetails.push(obj)
            oModel.getData().cargoCount = oModel.getData().cargoDetails.length;
            oModel.refresh();
        },
        onPressDeleteCargoItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().cargoDetails;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().cargoCount = oModel.getData().cargoDetails.length;
            oModel.refresh();

        },

        onPressAddFreightItem: function () {
            let obj = {
                currency: null,
                code: null,
                name: null,
                conversion: null,
                noOfUnits: null,
                unitRate: null,
                vat: null,
                totalAmt: null
            }
            let oModel = this.getView().getModel("ImportsMdl");
            oModel.getData().freightDetails.push(obj)
            oModel.getData().freightCount = oModel.getData().freightDetails.length;
            oModel.refresh();
        },
        onPressDeleteFreightItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().freightDetails;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().freightCount = oModel.getData().freightDetails.length;
            oModel.refresh();
        },
        _mockData: function () {
            let data = {
                "items": []
            }
            this.getView().setModel(new JSONModel(data))
        },
        onAddLinkDialog: function () {
            // create dialog lazily
            if (!this.oAddLinkDialog) {
                this.oAddLinkDialog = this.loadFragment({
                    name: "com.ecui.view.fragment.AddLink"
                });
            }
            this.oAddLinkDialog.then(function (oDialog) {
                this.oDialog = oDialog;
                this.oDialog.open();
            }.bind(this));
        },
        _closeDialog: function () {
            this.oAddLinkDialog.then(function (oDialog) {
                this.oDialog = oDialog;
                this.oDialog.close();
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                oData.url = undefined;
                oData.description = undefined;
                oData.valueStateUrl = "None"
                oData.valueStateDes = "None"
                oModel.refresh();
            }.bind(this));
        },
        onPressAddLink: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let regEx = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            let match = regEx.test(oData.url);
            if (oData.url && oData.description && match) {
                let obj = {
                    "fileName": oData.url,
                    "url": oData.url,
                    "mediaType": "url",
                    "statuses": [
                        {
                            "title": "Description",
                            "text": oData.description,
                            "active": false
                        }
                    ]
                }
                oData.items.push(obj);
                oModel.refresh();
                this._closeDialog();
            } else {
                oData.valueStateUrl = "Error"
                oData.valueStateDes = oData.description ? "Error" : "None"
                oModel.refresh();
            }
        },
        onChangeUrl: function (oEvent) {
            let url = oEvent.getParameter("value");
            let regEx = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            let match = regEx.test(url);
            if (match) {
                oEvent.getSource().setValueState("None");
            } else {
                oEvent.getSource().setValueState("Error");
                oEvent.getSource().setValueStateText("Invalid URL!");
            }
        },
        onAfterItemRemoved: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let oSource = oEvent.getSource();
            let itemCount = oSource.getItems().length;
            let mediaType = oEvent.getParameter("item").getProperty("mediaType");
            if (mediaType == "url") {
                let index = oEvent.getParameter('item').getBindingContext().getPath().split("/")[2]
                oData.items.splice(index, 1);
                oModel.refresh();
            }
            this.byId("lb_attachmentCount").setText("Items(" + itemCount + ")");
        },
        onUploadCompleted: function (oEvent) {
            let oSource = oEvent.getSource();
            let itemCount = oSource.getItems().length;
            this.byId("lb_attachmentCount").setText("Items(" + itemCount + ")");
        },
        //Full Screen, Exit Full Screen, and Close 
        handleFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, blNo: this._item });
        },

        handleExitFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, blNo: this._item });
        },

        handleClose: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("manageImports", { layout: sNextLayout });
        },

        onExit: function () {
            this.oRouter.getRoute("manageImports").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
