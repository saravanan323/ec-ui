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
            "com.ecui.payment_certifcate.PaymentCertifcateDetails",
            {
                formatter: Formatter,
                onInit: function (oEvent) {
                    this.oOwnerComponent = this.getOwnerComponent();
                    this.oRouter = this.oOwnerComponent.getRouter();
                    this.oModel = this.oOwnerComponent.getModel();
                    this.oRouter
                        .getRoute("payment-certifcate-details")
                        .attachMatched(this._onRouteDetailMatched, this);
                    this.oRouter
                        .getRoute("manage-payment-certifcate")
                        .attachMatched(this._onRouteMatched, this);

                    this._tableId = this.getView().byId("table_eqdDetails");
                },
                _onRouteMatched: function () {
                    //
                },
                _onRouteDetailMatched: function (oEvent) {
                    this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                    this._route = oEvent.getParameter("config").name;
                    this.genericTitle("Payment Certifcate Details");
                    let oData = {
                        application_no: "APP-3001",
                        start_date: "2025-02-01",
                        end_date: "2025-12-31",
                        due_date: "2025-12-31",
                        pa_start: "2025-02-01",
                        pa_end: "2025-06-30",
                        po_number: "PO-789456",
                        supplier_id: "SUP-1001",
                        supplier_name: "ABC Suppliers Ltd.",
                        pa_status: this._item,
                        revised_contract_value: "150,000.00 AED",
                        retention: "5.00",
                        total_gross_amount: "140,000 AED",
                        total_retention: "3,000 AED",
                        total_net_amount: "137,000 AED",
                        previous: [
                            {
                                item_id: "ITM-001",
                                product_id: "PRD-1001",
                                quantity: "50.00 EA",
                                total_netvalue: "5,000.00 AED",
                                current_period_qty: "10.00 EA",
                                current_period_amount: "1,000.00 AED",
                                process_completion: "75%"
                            },
                            {
                                item_id: "ITM-002",
                                product_id: "PRD-1001",
                                quantity: "50.00 EA",
                                total_netvalue: "5,000.00 AED",
                                current_period_qty: "10.00 EA",
                                current_period_amount: "1,000.00 AED",
                                process_completion: "75%"
                            },
                            {
                                item_id: "ITM-003",
                                product_id: "PRD-1001",
                                quantity: "50.00 EA",
                                total_netvalue: "5,000.00 AED",
                                current_period_qty: "10.00 EA",
                                current_period_amount: "1,000.00 AED",
                                process_completion: "75%"
                            },
                            {
                                item_id: "ITM-004",
                                product_id: "PRD-1001",
                                quantity: "50.00 EA",
                                total_netvalue: "5,000.00 AED",
                                current_period_qty: "10.00 EA",
                                current_period_amount: "1,000.00 AED",
                                process_completion: "75%"
                            },
                            {
                                item_id: "ITM-005",
                                product_id: "PRD-1001",
                                quantity: "50.00 EA",
                                total_netvalue: "5,000.00 AED",
                                current_period_qty: "10.00 EA",
                                current_period_amount: "1,000.00 AED",
                                process_completion: "75%"
                            }
                        ],
                        current_to_date: [
                            {
                                item_id: "ITM-002",
                                product_id: "PRD-1002",
                                quantity: "100.00 EA",
                                total_netvalue: "6,200.00 AED",
                                current_period_qty: "20.00 EA",
                                current_period_amount: "6,200.00 AED",
                                process_completion: "50%"
                            },
                            {
                                item_id: "ITM-003",
                                product_id: "PRD-1002",
                                quantity: "100.00 EA",
                                total_netvalue: "6,200.00 AED",
                                current_period_qty: "20.00 EA",
                                current_period_amount: "6,200.00 AED",
                                process_completion: "50%"
                            },
                            {
                                item_id: "ITM-004",
                                product_id: "PRD-1002",
                                quantity: "100.00 EA",
                                total_netvalue: "6,200.00 AED",
                                current_period_qty: "20.00 EA",
                                current_period_amount: "6,200.00 AED",
                                process_completion: "50%"
                            },
                            {
                                item_id: "ITM-005",
                                product_id: "PRD-1002",
                                quantity: "100.00 EA",
                                total_netvalue: "6,200.00 AED",
                                current_period_qty: "20.00 EA",
                                current_period_amount: "6,200.00 AED",
                                process_completion: "50%"
                            }
                        ],
                        current_period: [
                            {
                                item_id: "ITM-003",
                                product_id: "PRD-1003",
                                quantity: "80 EA",
                                total_netvalue: "8,000.00 AED",
                                current_period_qty: "15 EA",
                                current_period_amount: "1,500.00 AED",
                                process_completion: "60%"
                            },
                            {
                                item_id: "ITM-004",
                                product_id: "PRD-1003",
                                quantity: "80 EA",
                                total_netvalue: "8,000.00 AED",
                                current_period_qty: "15 EA",
                                current_period_amount: "1,500.00 AED",
                                process_completion: "60%"
                            },
                            {
                                item_id: "ITM-005",
                                product_id: "PRD-1003",
                                quantity: "80 EA",
                                total_netvalue: "8,000.00 AED",
                                current_period_qty: "15 EA",
                                current_period_amount: "1,500.00 AED",
                                process_completion: "60%"
                            },
                            {
                                item_id: "ITM-006",
                                product_id: "PRD-1003",
                                quantity: "80 EA",
                                total_netvalue: "8,000.00 AED",
                                current_period_qty: "15 EA",
                                current_period_amount: "1,500.00 AED",
                                process_completion: "60%"
                            },
                            {
                                item_id: "ITM-007",
                                product_id: "PRD-1003",
                                quantity: "80 EA",
                                total_netvalue: "8,000.00 AED",
                                current_period_qty: "15 EA",
                                current_period_amount: "1,500.00 AED",
                                process_completion: "60%"
                            }
                        ]
                    };


                    let oModel = new sap.ui.model.json.JSONModel(oData);
                    let getData = oModel.getData()
                    getData.application_no = this._item;
                    this.getView().setModel(oModel, "equipmentDemandDetailsMdl");
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
                getImageSource: function (status) {
                    switch (status) {
                        case "1":
                            return "./images/Approved_Green.png";
                        case "2":
                            return "./images/InApproval_Orange.png";
                        case "3":

                            return "./images/InRevision_Blue.png";
                        case "4":
                            return "./images/Rejected_Red.png";
                    }
                },
                formatter: {
                    getStatusText: function (status) {
                        switch (status) {
                            case "1": return "Approved";
                            case "2": return "In-Approval";
                            case "3": return "In-Revision";
                            case "4": return "Rejected";
                            default: return "Unknown";
                        }
                    },

                    getStatusState: function (status) {
                        switch (status) {
                            case "1": return "Success";      // Approved
                            case "2": return "Warning";      // In-Approval
                            case "3": return "Information";  // In-Revision
                            case "4": return "Error";        // Rejected
                            default: return "None";          // Default (no state)
                        }
                    },


                    getStatusIcon: function (status) {
                        return status === "1" ? "sap-icon://sys-enter-2" :
                            status === "4" ? "sap-icon://error" :
                                status === "3" ? "sap-icon://information" :
                                    "sap-icon://status-in-process";
                    }
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
                    let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleExitFullScreen: function () {
                    let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleClose: function () {
                    /* let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
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
