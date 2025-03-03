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
		AppConstants,
		Formatter,
		MessageBox,
		ErrorMessage,
		Fragment,
		MessageToast,
		Filter,
		FilterOperator
	) {
		"use strict";
		return BaseController.extend("com.ecui.customer_payment.PY_SalesOrderDetails", {
			formatter: Formatter,
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oModel = this.oOwnerComponent.getModel();
				//this.oRouter.getRoute("manage-projects").attachMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("payment-sales-order-details").attachMatched(this._onRouteDetailMatched, this);

			},
			/* _onRouteMatched: function (oEvent) {
				this._route = oEvent.getParameter("config").name;
				this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
				this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');

				this.errorPopoverParams();
			}, */
			_onRouteDetailMatched(oEvent) {
				this._route = oEvent.getParameter("config").name;
				this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
				this._project = oEvent.getParameter("arguments").project || oEvent.getParameter("arguments").project || null;

				this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');
				// this.setModel();

				this.errorPopoverParams();
				this.LocalDataFetch();

			},


			LocalDataFetch: function () {
				this.LocalFetchProjects();
				this.LocalFetchMaster();
				this.LocalFetchCustomers();
				this.LocalFetchSalesOrderDetails();
			},
	
			LiveDataFetch: function () {
				this.fetchSalesOrderById();
				this.fetchSalesOrderDetails();
			},
	
			LocalFetchProjects: function () {
	
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/projects.json"));
				this.getView().setModel(response, "projectsMdl");
	
			},
			LocalFetchCustomers: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/customers.json"));
				this.getView().setModel(response, "customersMdl");
	
			},
	
			LocalFetchMaster: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/master.json"));
				this.getView().setModel(response, "masterdataMdl");
			},

			LocalFetchSalesOrderDetails: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/soDetail.json"));
				this.getView().setModel(response, "salesOrderMdl");

			},
			errorPopoverParams: function () {
				this.eMdl = this.getOwnerComponent().getModel("errors");
				ErrorMessage.removeValueState(null, this.eMdl);

				this.eMdl.setData([]);
				this.errorData = [];
			},
			emptyData() {
				return {
					route: this._route,
					item: this._item,
					sales_orders: [
						{
							"sales_order": "22",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "In Process",
							"requested_delivery_date": "12.02.2025",
							"net_value": "191.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "Cement Bags (EC002)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"taxAmount": "4,99,999.00",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]

						},
						{
							"sales_order": "809",
							"sold_to_party": "Domestic UAE Customer 1 (33100001)",
							"ship_to_party": "Domestic UAE Customer 1 (33100001)",
							"customer_reference": "33100001",
							"overall_status": "In Process",
							"requested_delivery_date": "12.02.2025",
							"net_value": "195.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "Cement Bags (EC002)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"taxAmount": "4,99,999.00",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						},
						{
							"sales_order": "808",
							"sold_to_party": "Domestic Customer 1(1000021) ",
							"customer_reference": "33100001",
							"overall_status": "In Process",
							"customer_contract_mapping_status": "Completed",
							"requested_delivery_date": "12.02.2025",
							"net_value": "192.00",
							"currency": "AED",
							"document_date": "12.02.2025",
							"items": [
								{
									"item": 10,
									"product": "Cement Bags (EC002)",
									"requested_quantity": "2",
									"uom": "PC",
									"confirmed_quantity": "2",
									"taxAmount": "4,99,999.00",
									"net_value": "1,200.00",
									"currency": "AED",
								}
							]
						}
					]
				}
			},
			setModel() {
				let oData = this.emptyData();
				let nData = this.emptyData().sales_orders.find(e => e.sales_order == this._item);
				let merge = { ...oData, ...nData };
				this.getView().setModel(new JSONModel(merge), "salesOrderMdl")
			},
			fetchSalesOrderById: async function () {
				try {
					this.showLoading(true);
					let Path = AppConstants.URL.sales_order_by_id.replace("{id}", this._item);
					let response = await this.restMethodGet(Path);
					let oModel = new JSONModel(response);
					this.getView().setModel(oModel, "salesOrderMdl");
					this.fetchSalesOrderDetails();
				} catch (ex) {
					this.errorHandling(ex);
				} finally {
					this.showLoading(false);
				}
			},
			fetchSalesOrderDetails: async function () {
				try {
					let reqData = { "WBSElement": "E.01.001" };
					this.showLoading(true);
					let Path = AppConstants.URL.sales_orders_all;
					let response = await this.restMethodPost(Path, reqData);
			
					// If the response is an array, take the first item
					let salesOrderData = Array.isArray(response) ? response[0] : response;
					
					let oModel = new JSONModel(salesOrderData);
					this.getView().setModel(oModel, "salesOrderDetailsMdl");
			
				} catch (ex) {
					this.errorHandling(ex);
				} finally {
					this.showLoading(false);
				}
			},
			async customerFormatter(id) {
				try {
					let url = AppConstants.URL.customer_by_id.replace("{id}", id);
					let response = await this.restMethodGet(url);
					return response?.customerName + " (" + response?.customer + ")" || null;
				} catch (error) {
					console.log(error);
				}
			},
			salesOrderStatusFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.text;
			},
			salesOrderStateFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.state_color;
			},
			onPressCancel: function () {
				var oNextUIState;

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("project-details", { layout: "TwoColumnsBeginExpanded", id: this._item, });
				}.bind(this));
				this.fetchSalesOrderById();
			},

			handleClose: function () {
			    this.oRouter.navTo("manage-projects", { layout: "OneColumn" });
			},
			// onExit: function () {
			//     this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
			//     this.oRouter.getRoute("create-project").detachPatternMatched(this._onRouteCreateMatched, this);
			// },

			handleFullScreen: function () {
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
				this.oRouter.navTo("payment-sales-order-details", { layout: sNextLayout, id: this._item, project: this._project });
			},

			handleExitFullScreen: function () {
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
				this.oRouter.navTo("payment-sales-order-details", { layout: sNextLayout, id: this._item, project: this._project });
			},

			// handleClose: function () {
			// 	var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			// 	this.oRouter.navTo("create-customer-payment", { layout: "MidColumnFullScreen", id: this._project, });
			// },
			handleClose: function () {
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
				this.oRouter.navTo("create-customer-payment", { layout: sNextLayout });
			},

			onExit: function () {
				this.oRouter.getRoute("customer-payment").detachPatternMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("create-customer-payment").detachPatternMatched(this._onRouteCreateMatched, this);
			}
		}
		);
	},

);