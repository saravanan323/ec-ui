sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.ecui.payment_applications.PaymentApplicationsDetails", {
        onInit: function (oEvent) {

            this.oOwnerComponent = this.getOwnerComponent();

            // Get Router and attach the correct route-matched event
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter.getRoute("payment-applications-detail").attachPatternMatched(this.onRouteMatched, this);
            this.oModel = this.oOwnerComponent.getModel();

            this.tableNote = this.getView().byId("tableNotes");
            this.pageId = this.getView().byId("pagePaymentApplicationDetails");


        },
        async onRouteMatched(oEvent) {
            let oTable = this.tableNote;

            let visibleData = {
                edit: false,
                view: true,
                current_period_edit: false,
                toggleCommentVisible: false,
                toggleAttachmentListVisible: false
            };
            this.getView().setModel(new JSONModel(visibleData), "visible");

            let oDModel = this.getView().getModel("equipmentDemandDetailsMdl");
            let aItems = oTable.getItems();


            // Check if there are items and select the first one
            if (aItems.length > 0) {
                oTable.setSelectedItem(aItems[0]);
            }


            let getID = oEvent.getParameter("arguments").id || '';

            this._item = getID;



            let oData = {
                application_no: "1",
                start_date: "2025-02-01",
                end_date: "2025-12-31",
                due_date: "2025-12-31",
                pa_start: "2025-02-01",
                pa_end: "2025-06-30",
                po_number: "PO-789456",
                supplier_id: "SUP-1001",
                supplier_name: "ABC Suppliers Ltd.",
                pa_status: this._item,
                revised_contract_value: "150,000.00",
                retention: "5.00",
                total_gross_amount: "140,000",
                total_retention: "3,000",
                total_net_amount: "137,000",
                previous: [
                    {
                        item_id: "ITM-001",
                        product_id: "PRD-1001",
                        quantity: "50.00",
                        total_netvalue: "5,000.00",
                        current_period_qty: "10.00",
                        current_period_amount: "1,000.00",
                        process_completion: "75%"
                    },
                    {
                        item_id: "ITM-002",
                        product_id: "PRD-1001",
                        quantity: "30.00",
                        total_netvalue: "6,000.00",
                        current_period_qty: "20.00",
                        current_period_amount: "6,000.00",
                        process_completion: "95%"
                    }
                ],
                current_to_date: [
                    {
                        item_id: "ITM-002",
                        product_id: "PRD-1002",
                        quantity: "100.00",
                        total_netvalue: "6,200.00",
                        current_period_qty: "20.00",
                        current_period_amount: "6,200.00",
                        process_completion: "50%"
                    },
                    {
                        item_id: "ITM-003",
                        product_id: "PRD-1002",
                        quantity: "200.00",
                        total_netvalue: "7,200.00",
                        current_period_qty: "26.00",
                        current_period_amount: "7,200.00",
                        process_completion: "70%"
                    }
                ],
                current_period: [
                    {
                        item_id: "ITM-003",
                        product_id: "PRD-1003",
                        quantity: "80",
                        total_netvalue: "8,000.00",
                        current_period_qty: "15",
                        current_period_amount: "1,500.00",
                        process_completion: "60%"
                    },
                    {
                        item_id: "ITM-004",
                        product_id: "PRD-1003",
                        quantity: "70",
                        total_netvalue: "9,000.00",
                        current_period_qty: "14",
                        current_period_amount: "14,500.00",
                        process_completion: "70%"
                    }
                ],
                total_previous: {
                    total_gross_amount: "7,000.00",
                    total_retention: "350.00",
                    total_net_amount: "6,650.00",
                },
                total_current_to_date: {
                    total_gross_amount: "13,400.00",
                    total_retention: "670.00",
                    total_net_amount: "12,730.00",
                },
                total_current_period: {
                    total_gross_amount: "16,000.00",
                    total_retention: "800.00",
                    total_net_amount: "15,200.00",
                },
                notes: [
                    { notes_type: "1", language: "1", created_by: "John Doe", created_on: "13.02.2025 11:13 AM" },
                    { notes_type: "2", language: "2", created_by: "John Doe", created_on: "13.02.2025 11:13 AM" }
                ],
                files: {
                    "items": [
                        {
                            "id": "23004569",
                            "fileName": "Invoice summary.doc",
                            "mediaType": "application/msword",
                            "imageUrl": "test-resources/sap/m/images/invoice_manager.png",
                            "url": "test-resources/sap/m/UploadSetwithTableSampleFiles/Business Plan Agenda.doc",
                            "revision": "01",
                            "status": "Completed",
                            "fileSize": 200,
                            "lastModifiedBy": "Jane Burns",
                            "lastmodified": "10/03/21, 10:03:00 PM",
                            "documentType": "Invoice",
                            "previewable": true
                        },
                        {
                            "id": "23004589",
                            "fileName": "Business Plan Topics.xls",
                            "mediaType": "application/vnd.ms-excel",
                            "url": "test-resources/sap/m/UploadSetwithTableSampleFiles/Business Plan Topics.xls",
                            "revision": "00",
                            "status": "Completed",
                            "fileSize": 2400,
                            "lastModifiedBy": "Jane Burns",
                            "lastmodified": "10/03/21, 10:03:00 PM",
                            "documentType": "Invoice",
                            "previewable": true
                        }
                    ]
                }
            };


            let oModel = new sap.ui.model.json.JSONModel(oData);
            let getData = oModel.getData()
            getData.application_no = this._item;
            this.getView().setModel(oModel, "equipmentDemandDetailsMdl");

            this.statusBasedEdit();

            let oPage = this.pageId
            let opsCurrentPeriod = this.byId("opsCurrentPeriod");
            oPage.setSelectedSection(opsCurrentPeriod);
            oPage.fireSectionChange();

        },
        // errorPopoverParams: function () {
        // 	//******Set Initially Empty Error Mdl******
        // 	this.eMdl = this.getOwnerComponent().getModel('errors');
        // 	ErrorMessage.removeValueState([this.formId], this.eMdl);
        // 	this.eMdl.setData([]);
        // },
        // Tab Selection Handler
        onTabSelect: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedKey");

            switch (oSelectedItem) {
                case "previous":
                    this._setTableData("previous");
                    break;
                case "currentToDate":
                    this._setTableData("currentToDate");
                    break;
                case "currentPeriod":
                    this._setTableData("currentPeriod");
                    break;
            }
        },
        onProgressChange: function (oEvent) {
            let input = oEvent.getSource();
            let value = parseFloat(input.getValue());

            if (value > 100) {
                input.setValue(100);
            } else if (value < 0) {
                input.setValue(0);
            }
        },
        onPressEdit() {
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let vData = vModel.getData();
                vData.edit = !vData.edit;
                vData.view = !vData.view;
                vModel.refresh();
            }
        },
        statusBasedEdit() {
            let vModel = this.getView().getModel("visible");
            let eOModel = this.getView().getModel("equipmentDemandDetailsMdl");
            if (vModel && eOModel) {
                let vData = vModel.getData();
                let eOData = eOModel.getData();
                if (eOData.pa_status != '1') {
                    vData.current_period_edit = true;
                } else {
                    vData.current_period_edit = false;
                }
                vModel.refresh();
            }
        },
        onOplSectionChange(oEvent) {
            let oBtnEdit = this.getView().byId("btnEdit");
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("visible");
            let oData = oModel.getData();
            let currentPeriodMatch = oSource.getSelectedSection().includes('opsCurrentPeriod');
            let previousMatch = oSource.getSelectedSection().includes('opsPrevious');
            if (currentPeriodMatch & oData.current_period_edit) {
                oBtnEdit.setVisible(false);
                oSource.setShowFooter(true);
            } else if (previousMatch) {
                oBtnEdit.setVisible(false);
                oSource.setShowFooter(false);
            } else {
                oBtnEdit.setVisible(true);
                oSource.setShowFooter(false);
            }

            if (oModel) {
                oData.toggleCommentVisible = false;
                oData.toggleAttachmentListVisible = false;
                oModel.refresh();
            }
        },
        onCommentPress() {
            let oModel = this.getView().getModel("visible");
            if (oModel) {
                let oData = oModel.getData();
                oData.toggleCommentVisible = !oData.toggleCommentVisible;
                oModel.refresh();
            }
        },
        onAttachmentListPress() {
            let oModel = this.getView().getModel("visible");
            if (oModel) {
                let oData = oModel.getData();
                oData.toggleAttachmentListVisible = !oData.toggleAttachmentListVisible;
                oModel.refresh();
            }
        },
        // Function to set data based on selected tab
        _setTableData: function (sDataKey) {
            let oModel = this.getView().getModel();
            oModel.setProperty("/selectedData", oModel.getProperty("/" + sDataKey));
        },
        handleFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("payment-applications-detail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("payment-applications-detail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose: function () {
            this.oRouter.navTo("payment-applications", { layout: "OneColumn" });
        },

        // onPressEdit() {
        // 	this.errorPopoverParams();
        // 	let vModel = this.getView().getModel("visible");
        // 	if (vModel) {
        // 		let vData = vModel.getData();
        // 		vData.edit = !vData.edit;
        // 		vData.view = !vData.view;
        // 		vModel.refresh();
        // 	}
        // },
        //Addrow
        onPressAddRow: function () {
            let oTable = this.tableNote;
            let oModel = this.getView().getModel("equipmentDemandDetailsMdl");

            // Check if the model is defined and the path exists
            if (oModel) {
                let aData = oModel.getProperty("/notes");

                // Initialize the path if it does not exist
                if (!aData) {
                    aData = [];
                }

                // Define a new empty row
                let oNewRow = {
                    notes_type: "",
                    language: "",
                    created_by: "",
                    created_on: ""
                };

                // Add the new row to the data array
                aData.push(oNewRow);

                // Set the updated data back to the model
                oModel.setProperty("/notes", aData);

                // Refresh the table binding
                oTable.getBinding("items").refresh();
            }
        },
        onNoteSelectionChange: function (oEvent) {
            let oDescriptions = {
                "1": "Enter additional external comments here.",
                "2": "Approval note details go here.",
                "3": "Provide the body text content.",
                "4": "Detailed description of the project.",
                "5": "Describe the error symptoms observed.",
                "6": "Add internal comments that are not visible externally.",
                "7": "Purchasing-related notes and remarks.",
                "8": "Specify the reason for the action.",
                "9": "Explain the rejection reason in detail.",
                "10": "Include any sales-related notes.",
                "11": "Describe the work in progress."
            };

            let oSelectedItem = oEvent.getParameter("listItem");
            let oBindingContext = oSelectedItem.getBindingContext("equipmentDemandDetailsMdl");

            if (oBindingContext) {
                let oModel = this.getView().getModel("equipmentDemandDetailsMdl");
                let oData = oBindingContext.getObject();

                let sNoteType = oData.notes_type; // Ensure `notes_type` is correctly bound in the model
                let sDescription = oData.note_description || oDescriptions[sNoteType] || "";

                let oTextArea = this.getView().byId("id_NoteDescription");
                oTextArea.setValue(sDescription);
            }
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


        // Function to delete the selected row
        onPressDelete: function () {
            let oTable = this.tableNote;
            let oModel = this.getView().getModel("equipmentDemandDetailsMdl");
            let aNotes = oModel.getProperty("/notes");
            let oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                let iIndex = oTable.indexOfItem(oSelectedItem);
                aNotes.splice(iIndex, 1);
                oModel.setProperty("/notes", aNotes);
                oTable.removeSelections();
            }
        }
    });
});