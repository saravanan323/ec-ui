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
    return BaseController.extend("com.ecui.controller.liner_services.AddEditVoyages", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("voyagesMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("voyagesDetailCreate").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("voyagesDetailEdit").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "VoyageMdl");
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").index || oEvent.getParameter("arguments").index || null;
            this._route = oEvent.getParameter("config").name
            this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), "VoyageMdl");
            this._mockData();
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
            this.oRouter.navTo(this._route, { layout: sNextLayout, index: this._item });
        },

        handleExitFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, index: this._item });
        },

        handleClose: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("voyagesMaster", { layout: sNextLayout });
        },

        onExit: function () {
            this.oRouter.getRoute("voyagesMaster").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
