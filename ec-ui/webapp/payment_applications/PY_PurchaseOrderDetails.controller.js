sap.ui.define(
	[
		"com/ecui/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/ecui/utils/AppConstants",
		"com/ecui/utils/Formatter",
		"sap/m/MessageBox",
		"com/ecui/utils/ErrorMessage",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		'sap/ui/model/Filter',
		"sap/ui/model/FilterOperator",
	],
	function (
		BaseController,
		JSONModel,
		Formatter,
		ErrorMessage
	) {
		"use strict";
		return BaseController.extend("com.ecui.payment_applications.PY_PurchaseOrderDetails", {
			formatter: Formatter,
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oModel = this.oOwnerComponent.getModel();
				//this.oRouter.getRoute("manage-projects").attachMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("payment-purchase-order-details").attachMatched(this._onRouteDetailMatched, this);

			},

			_onRouteDetailMatched(oEvent) {
				this._item = oEvent.getParameter("arguments").id;

				this._route = oEvent.getParameter("config").name;

				this.errorPopoverParams();

				let vData = {
					footer: false,
					editable: false
				}
				this.getView().setModel(new JSONModel(vData), "visible");
				this.setModel();
				this.LocalDataFetch();
			},


			LocalDataFetch: function () {
				this.LocalFetchPurchaseOrderDetails();
				this.LocalFetchMaster();
			},

			LiveDataFetch: function () {
				this.fetchPurchaseOrderById();
				this.fetchProjectDetailsById();
				this.setSalesOrderModel();
			},

			LocalFetchPurchaseOrderDetails: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/poDetail.json"));
				this.getView().setModel(response, "PurchaseOrderMdl");
			},

			LocalFetchMaster: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/master.json"));
				this.getView().setModel(response, "masterMdl");
			},
			errorPopoverParams: function () {
				this.eMdl = this.getOwnerComponent().getModel("errors");
				//ErrorMessage.removeValueState(null, this.eMdl);

				this.eMdl.setData([]);
				this.errorData = [];
			},
			setModel() {
				let oData = {
					"items": [
						{
							"Item": "10",
							"ItemCategory": "Standard",
							"Material": "Steel Rod",
							"MaterialGroup": "Construction",
							"Status": "Approved",
							"NetOrderValue": "5,000.00 AED",
							"OrderedQty": "100 EA",
							"ReceivedQty": "80 EA"
						},
						{
							"Item": "20",
							"ItemCategory": "Subcontracting",
							"Material": "Cement Bags",
							"MaterialGroup": "Building Materials",
							"Status": "Pending",
							"NetOrderValue": "2,800.00 AED",
							"OrderedQty": "50 EA",
							"ReceivedQty": "30 EA"
						},
						{
							"Item": "30",
							"ItemCategory": "Service",
							"Material": "Plumbing Work",
							"MaterialGroup": "Services",
							"Status": "Completed",
							"NetOrderValue": "1,200.00 AED",
							"OrderedQty": "10 EA",
							"ReceivedQty": "10 EA"
						},
						{
							"Item": "40",
							"ItemCategory": "Standard",
							"Material": "Wooden Planks",
							"MaterialGroup": "Furniture",
							"Status": "In Progress",
							"NetOrderValue": "3,600.00 AED",
							"OrderedQty": "75 EA",
							"ReceivedQty": "50 EA"
						},
						{
							"Item": "50",
							"ItemCategory": "Consumable",
							"Material": "Paint Cans",
							"MaterialGroup": "Finishing",
							"Status": "Shipped",
							"NetOrderValue": "950.00 AED",
							"OrderedQty": "20 EA",
							"ReceivedQty": "20 EA"
						}
					],
					sales_orders: [
						{
							"sales_order": "810",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2 PC",
									"confirmed_quantity": "2 PC",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00 AED"
								}
							]

						},
						{
							"sales_order": "809",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2 PC",
									"confirmed_quantity": "2 PC",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00 AED"
								}
							]
						},
						{
							"sales_order": "808",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						},
						{
							"sales_order": "807",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						},
						{
							"sales_order": "806",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						},
						{
							"sales_order": "805",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "4500000695",
							"overall_status": "In Process",
							"requested_delivery_date": "10.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "10.02.2025",
							"items": [
								{
									"item": 10,
									"product": "3 seater Fabric Sofa Grey Color (55)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"item_category": "Milestone-Bill.Plan (CBAO)",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						}
					]
				};


				// Create JSON Model and Assign Data
				let oPurchaseOrderMdl = new sap.ui.model.json.JSONModel(oData);

				// Set the model to the view
				this.getView().setModel(oPurchaseOrderMdl, "PurchaseOrderMdl");
			},
			onCustomerContractMappingButtonPress() {
				let oVisibleMdl = this.getView().getModel("visible");
				if (oVisibleMdl) {
					let oVisibleData = oVisibleMdl.getData();
					oVisibleData.footer = !oVisibleData.footer;
					oVisibleData.editable = !oVisibleData.editable;
					oVisibleMdl.refresh();
				}
			},

			async onValueHelpRequestSalesOrder(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();
				this.oSelSalesObject = oEvent.getSource().getBindingContext("PurchaseOrderMdl").getObject();

				// create dialog lazily
				this.oSalesOrderDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.SalesOrderListDialog"
				});

				this.oSalesOrderDialog.open();

			},
			onDialogSalesOrderClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem");
				let oModel = this.getView().getModel("PurchaseOrderMdl");
				//oInput = this.byId("inputSalesOrder");

				if (!oSelectedItem && !this.oSelSalesObject) {
					oInput.resetProperty("value");
					return;
				}
				this.oSelSalesObject.sales_order = oSelectedItem?.getTitle();
				oModel.refresh();
				//oInput.setValue(oSelectedItem.getTitle());
			},

			async onValueHelpRequestItems(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();
				this.oSelItemObject = oEvent.getSource().getBindingContext("PurchaseOrderMdl").getObject();

				// create dialog lazily
				this.oSalesItemDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.ItemsDialog"
				});

				this.oSalesItemDialog.open();

			},
			onDialogItemClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem");
				let oModel = this.getView().getModel("PurchaseOrderMdl");
				//oInput = this.byId("inputSalesOrder");

				if (!oSelectedItem && !this.oSelItemObject) {
					oInput.resetProperty("value");
					return;
				}
				this.oSelItemObject.sales_item = oSelectedItem?.getTitle();
				oModel.refresh();
				//oInput.setValue(oSelectedItem.getTitle());
			},
			onSaveButtonPress() {
				sap.m.MessageBox.success("Updated Successfully!")
				this.onCustomerContractMappingButtonPress();
			},

			onPressCancel: function () {
				this.onCustomerContractMappingButtonPress();
				this.setModel();
			},
			handleClose: function () {
				let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
				this.oRouter.navTo("create-payment-application", { layout: sNextLayout });
			},

			onExit: function () {
				this.oRouter.getRoute("create-payment-application").detachPatternMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("payment-applications").detachPatternMatched(this._onRouteCreateMatched, this);
			}
		}
		);
	},

);