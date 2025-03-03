sap.ui.define(
    [
        "com/ecui/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "com/ecui/utils/AppConstants",
        "com/ecui/utils/Formatter",
        "sap/m/MessageBox",
        "com/ecui/utils/ErrorMessage",
    ],
    function (
        BaseController,
        JSONModel,
        AppConstants,
        Formatter,
        MessageBox,
        ErrorMessage
    ) {
        "use strict";
        return BaseController.extend(
            "com.ecui.equipment_demands.EquipmentDemandDetails",
            {
                formatter: Formatter,
                onInit: function () {
                    this.oOwnerComponent = this.getOwnerComponent();
                    this.oRouter = this.oOwnerComponent.getRouter();
                    this.oModel = this.oOwnerComponent.getModel();
                    this.oRouter
                        .getRoute("equipment-demand-details")
                        .attachMatched(this._onRouteDetailMatched, this);
                    this.oRouter
                        .getRoute("equipment-demands")
                        .attachMatched(this._onRouteMatched, this);

                    this._tableId = this.getView().byId("table_eqdDetails");
                },
                _onRouteMatched: function () {
                    //
                },
                _onRouteDetailMatched: function (oEvent) {
                    this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                    this._route = oEvent.getParameter("config").name;
                    this.genericTitle("Equipment Demand Details");
                    this.getView().setModel(new JSONModel({
                        route: this._route,
                        item: this._item,
                        utilization: [
                            {
                                demand: "equipment cost",
                                activtity_type: "MACHINE",
                                costCenter: "000014040",
                                startDate: "02-12-2023",
                                endDate: "31-12-2023"
                            }
                        ],
                        dateHours: [{

                        },
                        {

                        },
                        {

                        }]
                    }), 'equipmentDemandDetailsMdl');
                    //this.errorPopoverParams("basic");
                },
                errorPopoverParams: function (formId) {
                    let ids = {
                        basic: "sf_basicDetails",
                        attachment: "sf_attachment",
                        property: "sf_PropHierarchy",
                    };
                    this.formId = this.getView().byId(ids[formId]);
                    this.pageId = this.getView().byId("page_eqdDetails");
                    this.popoverBtn = this.getView().byId("btn_pOHDetail");

                    //******Set Initially Empty Error Mdl******
                    this.eMdl = this.getOwnerComponent().getModel("errors");
                    ErrorMessage.removeValueState(this.formId, this.eMdl);

                    this.eMdl.setData([]);
                    this.errorData = [];
                },
                onPressCancel: function () {
                    this.onNavBack();
                },
                onPressAdd: function () {
                    //let selItems = this._tableId.getSelectedItems();
                    // if (selItems.length > 0) {
                    // create dialog lazily
                    this.pDialog ??= this.loadFragment({
                        name: "com.ecui.confirm_equipment.AddConfirmationHours"
                    });

                    this.pDialog.then((oDialog) => oDialog.open());
                    //}
                },
                _closeDialog: function () {
                    this.pDialog.then((oDialog) => oDialog.close());
                    this._tableId.removeSelections();
                },
                onPressView: function () {
                    //let selItems = this._tableId.getSelectedItems();
                    // if (selItems.length > 0) {
                    // create dialog lazily
                    this.pDialog1 ??= this.loadFragment({
                        name: "com.ecui.confirm_equipment.ConfirmedHours"
                    });

                    this.pDialog1.then((oDialog) => oDialog.open());
                    //}
                },
                _closeViewDialog: function () {
                    this.pDialog1.then((oDialog) => oDialog.close());
                    this._tableId.removeSelections();
                },
                //Full Screen, Exit Full Screen, and Close 
                handleFullScreen: function () {
                    var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleExitFullScreen: function () {
                    var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleClose: function () {
                    /* var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                    this.oRouter.navTo("confirm-equipment-utilization", { layout: sNextLayout }); */
                    this.onNavBack();
                },

                onExit: function () {
                    this.oRouter.getRoute("confirm-equipment-utilization").detachPatternMatched(this._onRouteMatched, this);
                    this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
                }
            }
        );
    }
);
