sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.ecui.customer_payment.CustomerPaymentDetails", {
        onInit: function (oEvent) {

            this.oOwnerComponent = this.getOwnerComponent();

            // Get Router and attach the correct route-matched event
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter.getRoute("customer-payment-detail").attachPatternMatched(this.onRouteMatched, this);
            this.oModel = this.oOwnerComponent.getModel();

            this.tableNote = this.getView().byId("tableNotes");
            this.pageId = this.getView().byId("pagePaymentApplicationDetails");


        },
        async onRouteMatched(oEvent) {
            var oTable = this.tableNote;

            let visibleData = {
                edit: false,
                view: true,
                current_period_edit: false,
                toggleCommentVisible: false,
                toggleAttachmentListVisible: false
            };
            this.getView().setModel(new JSONModel(visibleData), "visible");

            var oDModel = this.getView().getModel("equipmentDemandDetailsMdl");
            var aItems = oTable.getItems();

            // Check if there are items and select the first one
            if (aItems.length > 0) {
                oTable.setSelectedItem(aItems[0]);
            }


            let getID = oEvent.getParameter("arguments").id || '';
            this._item = getID;
            // if (getID === '1') {
            //     this._item = true;
            // }
            // else {
            //     this._item = false;
            // }

            // Create a JSON Model with data
            //     var oModel = new JSONModel({
            //         applicationNo: "1",
            //         startDate: "02-01-2025",
            //         dueDate: "02-01-2025",
            //         paStart: "02-01-2025",
            //         paEnd: "02-01-2025",
            //         supplier: "1000023 Domestic Supplier 2",
            //         retention: "5.00",
            //         status: "Released",
            //         contractValue: "55,700.00",
            //         previous: [
            //             { item: "001", product: "Product A", quantity: "30.00 M3", totalNetValue: "5,000.00", currentPeriodQuantity: "1.00", progressCompletion: "80%" },
            //             { item: "002", product: "Product B", quantity: "5.00  M3", totalNetValue: "2,500.00", currentPeriodQuantity: "2.00", progressCompletion: "60%" },
            //             { item: "003", product: "Product c", quantity: "45.00  M3", totalNetValue: "4,780.00", currentPeriodQuantity: "2.00", progressCompletion: "60%" }
            //         ],
            //         currentToDate: [
            //             { item: "10", product: "Excavation (EC001)", quantity: "450.00 M3", totalNetValue: "11,250.00", currentPeriodQuantity: "10.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "20", product: "Backfilling (EC002)", quantity: "377.00 M3", totalNetValue: "23,562.50", currentPeriodQuantity: "20.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "30", product: "Pile Caps (EC003)", quantity: "30.00 M3", totalNetValue: "37,500.00", currentPeriodQuantity: "30.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "40", product: "Neck Columns (EC004)", quantity: "5.00 M3", totalNetValue: "78,10.00", currentPeriodQuantity: "40.00", currentPeriodAmount: "5000", progressCompletion: "10%" }
            //         ],
            //         currentPeriod: [
            //             { item: "50", product: "Site Preparation (SP001)", quantity: "450.00 M3", totalNetValue: "11,250.00", currentPeriodQuantity: "50.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "60", product: "Foundation Work (FW002)", quantity: "377.00 M3", totalNetValue: "23,562.50", currentPeriodQuantity: "60.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "70", product: "Steel Reinforcement (SR003)", quantity: "30.00 M3", totalNetValue: "37,500.00", currentPeriodQuantity: "70.00", currentPeriodAmount: "5000", progressCompletion: "10%" },
            //             { item: "80", product: "Concrete Pouring (CP004)", quantity: "5.00 M3", totalNetValue: "78,10.00", currentPeriodQuantity: "80.00", currentPeriodAmount: "5000", progressCompletion: "10%" }
            //         ]
            //     },
            //     {
            //         applicationNo: "2",
            //         startDate: "03-01-2025",
            //         dueDate: "03-01-2025",
            //         paStart: "03-01-2025",
            //         paEnd: "03-01-2025",
            //         supplier: "1000024 International Supplier 1",
            //         retention: "6.00",
            //         status: "Pending",
            //         contractValue: "65,800.00",
            //         previous: [
            //             { item: "003", product: "Product C", quantity: "40 M3", totalNetValue: "6000.00", currentPeriodQuantity: "3", progressCompletion: "70%" },
            //             { item: "004", product: "Product D", quantity: "10 M3", totalNetValue: "3500.00", currentPeriodQuantity: "4", progressCompletion: "50%" }
            //         ],
            //         currentToDate: [
            //             { item: "11", product: "Excavation (EC101)", quantity: "400 M3", totalNetValue: "11000.00", currentPeriodQuantity: "11", currentPeriodAmount: "4800", progressCompletion: "15%" },
            //             { item: "21", product: "Backfilling (EC102)", quantity: "370 M3", totalNetValue: "22000.00", currentPeriodQuantity: "21", currentPeriodAmount: "4500", progressCompletion: "12%" }
            //         ],
            //         currentPeriod: [
            //             { item: "51", product: "Site Preparation (SP101)", quantity: "400 M3", totalNetValue: "11000.00", currentPeriodQuantity: "51", currentPeriodAmount: "4800", progressCompletion: "15%" },
            //             { item: "61", product: "Foundation Work (FW102)", quantity: "370 M3", totalNetValue: "22000.00", currentPeriodQuantity: "61", currentPeriodAmount: "4500", progressCompletion: "12%" }
            //         ]
            //     },
            //     {
            //         applicationNo: "3",
            //         startDate: "04-01-2025",
            //         dueDate: "04-01-2025",
            //         paStart: "04-01-2025",
            //         paEnd: "04-01-2025",
            //         supplier: "1000025 Domestic Supplier 3",
            //         retention: "4.50",
            //         status: "Approved",
            //         contractValue: "72,400.00",
            //         previous: [
            //             { item: "005", product: "Product E", quantity: "35 M3", totalNetValue: "5500.00", currentPeriodQuantity: "5", progressCompletion: "85%" },
            //             { item: "006", product: "Product F", quantity: "7 M3", totalNetValue: "3200.00", currentPeriodQuantity: "6", progressCompletion: "65%" }
            //         ],
            //         currentToDate: [
            //             { item: "12", product: "Excavation (EC201)", quantity: "460 M3", totalNetValue: "11500.00", currentPeriodQuantity: "12", currentPeriodAmount: "5100", progressCompletion: "20%" },
            //             { item: "22", product: "Backfilling (EC202)", quantity: "380 M3", totalNetValue: "22500.00", currentPeriodQuantity: "22", currentPeriodAmount: "4800", progressCompletion: "18%" }
            //         ],
            //         currentPeriod: [
            //             { item: "52", product: "Site Preparation (SP201)", quantity: "460 M3", totalNetValue: "11500.00", currentPeriodQuantity: "52", currentPeriodAmount: "5100", progressCompletion: "20%" },
            //             { item: "62", product: "Foundation Work (FW202)", quantity: "380 M3", totalNetValue: "22500.00", currentPeriodQuantity: "62", currentPeriodAmount: "4800", progressCompletion: "18%" }
            //         ]
            //     },
            //     {
            //         applicationNo: "4",
            //         startDate: "05-01-2025",
            //         dueDate: "05-01-2025",
            //         paStart: "05-01-2025",
            //         paEnd: "05-01-2025",
            //         supplier: "1000026 International Supplier 2",
            //         retention: "5.50",
            //         status: "Draft",
            //         contractValue: "78,900.00",
            //         previous: [
            //             { item: "007", product: "Product G", quantity: "50 M3", totalNetValue: "7000.00", currentPeriodQuantity: "7", progressCompletion: "90%" },
            //             { item: "008", product: "Product H", quantity: "9 M3", totalNetValue: "4000.00", currentPeriodQuantity: "8", progressCompletion: "75%" }
            //         ],
            //         currentToDate: [
            //             { item: "13", product: "Excavation (EC301)", quantity: "470 M3", totalNetValue: "12000.00", currentPeriodQuantity: "13", currentPeriodAmount: "5300", progressCompletion: "25%" },
            //             { item: "23", product: "Backfilling (EC302)", quantity: "390 M3", totalNetValue: "23000.00", currentPeriodQuantity: "23", currentPeriodAmount: "5000", progressCompletion: "22%" }
            //         ],
            //         currentPeriod: [
            //             { item: "53", product: "Site Preparation (SP301)", quantity: "470 M3", totalNetValue: "12000.00", currentPeriodQuantity: "53", currentPeriodAmount: "5300", progressCompletion: "25%" },
            //             { item: "63", product: "Foundation Work (FW302)", quantity: "390 M3", totalNetValue: "23000.00", currentPeriodQuantity: "63", currentPeriodAmount: "5000", progressCompletion: "22%" }
            //         ]
            //     });
            //     // oModel.getData().
            //     oModel.getData().applicationNo = this._item;
            //     this.getView().setModel(oModel);
            //     this._setTableData("previous"); // Default to 'Current to Date' tab
            // //     this.errorPopoverParams();
            // //    // Set visibility model
            // //    let visibleData = {
            // //     edit: false,
            // //     view: true
            // // };
            // // this.getView().setModel(new JSONModel(visibleData), "visible");
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
                pa_status: this._item ,
                // pa_status: this._item ? "Released" : "Not Released",
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


            var oModel = new sap.ui.model.json.JSONModel(oData);
            var getData = oModel.getData()
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
            var oSelectedItem = oEvent.getParameter("selectedKey");

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
                if (eOData.pa_status != 'Released') {
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
        getImageSource: function (status) {
            switch (status) {
                case "1":
                    return "./images/Approved_Green.png";
                case "2":
                    return "./images/InApproval_Orange.png";
                    case "3":
                       
                        return "./images/Rejected_Red.png";
                    case "4":
                        return "./images/InRevision_Blue.png";
            }
        },
        formatter: {
            getStatusText: function (status) {
                switch (status) {
                    case "1": return "Approved";
                    case "2": return "In-Approval";
                    case "3": return "Rejected";
                    case "4": return "In-Revision";
                    default: return "Unknown";
                }
            },
        
            getStatusState: function (status) {
                switch (status) {
                    case "1": return "Success";      // Approved
                    case "2": return "Warning";      // In-Approval
                    case "3": return "Error";  // Rejected
                    case "4": return "Information";     // In-Revision   
                    default: return "None";          // Default (no state)
                }
            },
            
        
            getStatusIcon: function (status) {
                return status === "1" ? "sap-icon://sys-enter-2" : 
                       status === "4" ? "sap-icon://information" : 
                       status === "3" ? "sap-icon://error" : 
                       "sap-icon://status-in-process";
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
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedData", oModel.getProperty("/" + sDataKey));
        },
        handleFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("customer-payment-detail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("customer-payment-detail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose: function () {
            this.oRouter.navTo("customer-payment", { layout: "OneColumn" });
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
            var oTable = this.tableNote;
            var oModel = this.getView().getModel("equipmentDemandDetailsMdl");

            // Check if the model is defined and the path exists
            if (oModel) {
                var aData = oModel.getProperty("/notes");

                // Initialize the path if it does not exist
                if (!aData) {
                    aData = [];
                }

                // Define a new empty row
                var oNewRow = {
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
            var oDescriptions = {
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

            var oSelectedItem = oEvent.getParameter("listItem");
            var oBindingContext = oSelectedItem.getBindingContext("equipmentDemandDetailsMdl");

            if (oBindingContext) {
                var oModel = this.getView().getModel("equipmentDemandDetailsMdl");
                var oData = oBindingContext.getObject();

                var sNoteType = oData.notes_type; // Ensure `notes_type` is correctly bound in the model
                var sDescription = oData.note_description || oDescriptions[sNoteType] || "";

                var oTextArea = this.getView().byId("id_NoteDescription");
                oTextArea.setValue(sDescription);
            }
        },
        // Function to delete the selected row
        onPressDelete: function () {
            var oTable = this.tableNote;
            var oModel = this.getView().getModel("equipmentDemandDetailsMdl");
            var aNotes = oModel.getProperty("/notes");
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var iIndex = oTable.indexOfItem(oSelectedItem);
                aNotes.splice(iIndex, 1);
                oModel.setProperty("/notes", aNotes);
                oTable.removeSelections();
            }
        }
    });
});