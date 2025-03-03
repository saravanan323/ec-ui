sap.ui.define([
  "com/ecui/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
], function (Controller, JSONModel, MessageBox, MessageToast) {
  "use strict";

  return Controller.extend("com.ecui.payment_applications.CreatePaymentApplication", {

    onInit: function () {
      this.oOwnerComponent = this.getOwnerComponent();

      // Get Router and attach the correct route-matched event
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oRouter.getRoute("create-payment-application").attachPatternMatched(this._onRouteMatched, this);

      // Load initial data for the view model
      //   let oViewModel = new sap.ui.model.json.JSONModel({
      //     tableVisible: false
      // });
      // this.getView().setModel(oViewModel, "viewModel");
      const oData = {
        project: "",
        processingStatus: "",
        projectResponsible: "",
        customerName: "",
        contractValue: "",
        customerPoNo: "",
        letiationOrderValue: "",
        projectValue: "",
        customerAdvance: "",
        customerRetention: "",
        suppliersAdvance: "",
        suppliersRetention: "",
        paymentApplicationNo: "",
        startDate: "2025-01-06",
        paStart: "2025-02-10",
        dueDate: "2025-11-16",
        paEnd: "2025-12-16",
        purchase_order: [
          {
            purchaseOrder: "4500000738",
            vendor: "Domestic Supplier",
            status: "Sent",
            statusState: "Information",
            paValue: "3000.00",
            Currency: "AED",
            invoice: "3000.00",
            paidValue: "0.00",
            submittedDate: "2025-01-15",
            history: "Iteration : 1"
          },
          {
            purchaseOrder: "4500000737",
            vendor: "Global Construction",
            status: "Sent",
            paValue: "5000.00",
            statusState: "Information",
            Currency: "AED",
            invoice: "6000.00",
            paidValue: "0.00",
            submittedDate: "2025-01-16",
            history: "Iteration : 2"
          },
          {
            purchaseOrder: "4500000736",
            vendor: "international construction",
            status: "Sent",
            statusState: "Information",
            paValue: "77000.00",
            invoice: "9000.00",
            paidValue: "0.00",
            Currency: "AED",
            submittedDate: "2025-01-18",
            history: "Iteration : 2"
          }
        ],
        notes: [
          {
            note_type: "",
            language: "",
            creayted_by: " ",
            creayted_on: "",

          },

        ]
      };

      const oVModel = new JSONModel(oData);
      this.getView().setModel(oVModel, "paymentMdl");

    },
    _onRouteMatched: function (oEvent) {

      let setDataModel = {
        processingStatus: [
          { key: "1", text: "Released" },
          { key: "2", text: "Created" }

        ],
        projectResponsible: [
          { key: "1", text: "Bhupesh Akkineni" },
          { key: "2", text: "Mohamed Ziyaul Haqi" },


        ],
        project: [
          { key: "1", text: "EC Tower E E.03.001" },
          { key: "2", text: "Building Tower A E.23.003" },
          { key: "1", text: "EC Tower 1 E.00.001" },
          { key: "2", text: "Construction  Plan C.00.001" },


        ],
        status: [
          { key: "1", text: "Approved" },
          { key: "2", text: "Submitted" },


        ],
      };
      this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");


      let oModel = new JSONModel(
        [
          {
            "id": 101,
            "project": "EC Tower 1 E.00.001",
            "customer": "Blauer See Delikatessen",
            "project_manager": "Mohamed Ziyaul Haqi",
            "processing_status": "2",
            "project_type": "Customer Project",
            "planned_start": "11-01-2024",
            "planned_finish": "10-12-2025",
            "created_by": "Mohamed Ziyaul Haqi",
            "currency": "AED"
          },
          {
            "id": 102,
            "project": "Construction  Plan C.00.001",
            "customer": "Alfreds Futterkiste",
            "project_manager": "Bhupesh Akkineni",
            "processing_status": "1",
            "project_type": "Engineering Construction",
            "planned_start": "11-02-2024",
            "planned_finish": "10-02-2025",
            "created_by": "Mohamed Ziyaul Haqi",
            "currency": "AED"

          },
          {
            "id": 103,
            "project": "Building Tower A E.23.003",
            "customer": "Centro comercial Moctezuma",
            "project_manager": "Maria Anders",
            "processing_status": "1",
            "project_type": "Internal Project",
            "planned_start": "11-10-2024",
            "planned_finish": "10-10-2025",
            "created_by": "Mohamed Ziyaul Haqi",
            "currency": "AED"

          },
          {
            "id": 104,
            "project": "EC Tower E E.03.001",
            "customer": "Chop-suey Chinese",
            "project_manager": "Francisco Chang",
            "processing_status": "2",
            "project_type": "General Type",
            "planned_start": "11-05-2024",
            "planned_finish": "02-06-2025",
            "created_by": "Mohamed Ziyaul Haqi",
            "currency": "AED"

          }
        ]);

      this.getView().setModel(oModel, "projectsMdl");

      let dummyData = [
        { "key": 1, "text": "EC Tower 1 (E.01.001)" },
        { "key": 2, "text": "Super Structure (E.01.001.02)" },
        { "key": 3, "text": "Sub Structure (E.01.001.03)" },
        { "key": 4, "text": "Site Work (E.01.001.04)" },
        { "key": 5, "text": "Concrete Work (E.01.001.05)" },
        { "key": 6, "text": "Masonry Work (E.01.001.06)" },
        { "key": 7, "text": "Site Work (E.01.001.01)" },
        { "key": 8, "text": "Excavation (E.01.001.07)" },
        { "key": 9, "text": "Backfilling (E.01.001.08)" },
        { "key": 10, "text": "Piles (E.01.001.03.01)" },
        { "key": 11, "text": "Pile Caps (E.01.001.03.02)" },
        { "key": 12, "text": "Neck Columns (E.01.001.03.03)" },
        { "key": 13, "text": "Ground Beams (E.01.001.03.04)" }
      ]
      this.getView().setModel(new JSONModel(dummyData), "dummyMdl");

      let companyData = [
        { "key": 1, "text": "ITFZ_inflexion" },
        { "key": 2, "text": "UAE_inflexion" },
        { "key": 3, "text": "Oman_inflexion" },
        { "key": 4, "text": "LEBANON_inflexion" }

      ]
      this.getView().setModel(new JSONModel(companyData), "CompanyMdl");
    },

    onPressSave: function () {
      sap.m.MessageToast.show("Save button pressed");
    },

    onCancelPress: function () {
      this.oRouter.navTo("payment-applications", { layout: "OneColumn" });
    },
    handleFullScreen: function () {
      //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
      this.oRouter.navTo("create-payment-application", { layout: "MidColumnFullScreen" });
    },

    handleExitFullScreen: function () {
      //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.oRouter.navTo("create-payment-application", { layout: "TwoColumnsMidExpanded" });
    },
    onAddPurchaseOrder: function () {
      this.onOpenDialog("com.ecui.payment_applications.PurchaseOrder");

    },



    onSubmitPurchaseOrder: function () {
      try {
        let oModel = this.getView().getModel("paymentMdl");
        let data = oModel.getData();

        // Ensure 'purchase_order' is initialized
        if (!data.purchase_order) {
          data.purchase_order = [];
        }

        let selIndex = data.indexValue;

        if (selIndex !== undefined && selIndex !== null && data.purchase_order[selIndex]) {
          // Update existing entry
          data.purchase_order[selIndex].purchaseOrder = data.purchaseOrder;
          data.purchase_order[selIndex].vendor = data.vendor;
          data.purchase_order[selIndex].status = data.status;
          data.purchase_order[selIndex].paValue = data.paValue;
          data.purchase_order[selIndex].invoice = data.invoice;
          data.purchase_order[selIndex].paidValue = data.paidValue;
          data.purchase_order[selIndex].submittedDate = data.submittedDate;
          data.purchase_order[selIndex].history = data.history;
        } else {
          // Add new entry
          data.purchase_order.push({
            purchaseOrder: data.purchaseOrder,
            vendor: data.vendor,
            status: data.status,
            paValue: data.paValue,
            invoice: data.invoice,
            paidValue: data.paidValue,
            submittedDate: data.submittedDate,

            history: data.history,
          });
        }

        // Set updated data back to the model
        oModel.setProperty("/purchase_order", data.purchase_order);
        oModel.refresh(true);

        // Refresh the table binding
        let oTable = this.getView().byId("id_PurchaseOrders");
        if (oTable) {
          let oBinding = oTable.getBinding("items");
          if (oBinding) {
            oBinding.refresh();
          }
        }

        this.onCloseDialog();

      } catch (ex) {
        console.error("Error in submitting purchase order:", ex);
      }
    },


    handleClose: function () {
      this.oRouter.navTo("payment-applications", { layout: "OneColumn" });
    },

    onPurchaseOrderPress(oEvent) {
      // Get the selected list item
      let oItem = oEvent.getParameter("listItem");
      if (!oItem) {
        console.error("No item selected.");
        return;
      }

      // Get binding context from the selected item
      let oBindingContext = oItem.getBindingContext("paymentMdl");
      if (!oBindingContext) {
        console.error("Binding context is missing.");
        return;
      }

      // Extract the data from the binding context
      let oRowData = oBindingContext.getObject();
      if (!oRowData || !oRowData.purchaseOrder) {
        console.error("purchaseOrder is missing in the data.");
        return;
      }

      // Store the navigated item in the settings model
      let oSettingsModel = this.oOwnerComponent.getModel("settings");
      oSettingsModel.setProperty("/navigatedItem", oRowData.purchaseOrder);

      // Perform navigation with required parameters
      this.oRouter.navTo("payment-purchase-order-details", {
        layout: "MidColumnFullScreen",
        id: oRowData.purchaseOrder // Ensure 'payment' is passed properly
      });
    },
    //Addrow
    onAddRow: function () {
      let oTable = this.getView().byId("id_Notes");
      let oModel = this.getView().getModel("paymentMdl");

      // Check if the model exists
      if (oModel) {
        let aData = oModel.getProperty("/notes") || [];

        // Define a new empty row
        let oNewRow = {
          note_type: "",  // Should be an empty string instead of an empty array
          language: "",   // Should be an empty string instead of an empty array
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
      let oBindingContext = oSelectedItem.getBindingContext("paymentMdl");

      if (oBindingContext) {
        let oModel = this.getView().getModel("paymentMdl");
        let oData = oBindingContext.getObject();

        let sNoteType = oData.note_type; // Ensure `note_type` is correctly bound in the model
        let sDescription = oData.note_description || oDescriptions[sNoteType] || "";

        let oTextArea = this.getView().byId("id_NoteDescription");
        oTextArea.setValue(sDescription);
      }
    },
    // // Function to delete the selected row
    onPressDelete: function () {
      let oTable = this.getView().byId("id_Notes");
      let oModel = this.getView().getModel("paymentMdl");
      let aNotes = oModel.getProperty("/notes");
      let oSelectedItem = oTable.getSelectedItem();

      if (oSelectedItem) {
        let iIndex = oTable.indexOfItem(oSelectedItem);
        aNotes.splice(iIndex, 1);
        oModel.setProperty("/notes", aNotes);
        oTable.removeSelections();
      }
    },

  });
});