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
		return BaseController.extend("com.ecui.projects.PR_SalesOrderDetails", {
			formatter: Formatter,
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oModel = this.oOwnerComponent.getModel();
				//this.oRouter.getRoute("manage-projects").attachMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("project-sales-order-details").attachMatched(this._onRouteDetailMatched, this);


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
				this.LocalFetchSalesOrderDetails();
				this.LocalFetchMaster();
			},

			LiveDataFetch: function () {

				this.setSalesOrderModel();
				this.fetchSalesOrderById();
				this.fetchSalesOrderDetails();
				this.setSalesOrderModel();

			},

			LocalFetchSalesOrderDetails: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/soDetail.json"));
				this.getView().setModel(response, "salesOrderDetailsMdl");
			},

			LocalFetchMaster: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/master.json"));
				this.getView().setModel(response, "masterMdl");
			},

			errorPopoverParams: function () {
				this.eMdl = this.getOwnerComponent().getModel("errors");
				ErrorMessage.removeValueState(null, this.eMdl);

				this.eMdl.setData([]);
				this.errorData = [];
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
			async setSalesOrderModel() {
				try {
					let url = AppConstants.URL.project_by_id.replace("{id}", this._project);
					this.showLoading(true);

					// Fetch project data
					let response = await this.restMethodGet(url);
					let oProjectModel = new JSONModel(response);
					this.getView().setModel(oProjectModel, "projectMdl");

					// Ensure model exists before accessing properties
					let oModel = this.getView().getModel("projectMdl");
					if (!oModel) {
						console.error("Model 'projectMdl' is not found!");
						return; // Stop execution if the model is missing
					}

					// Get project property safely
					let sProject = oModel.getProperty("/project") || null; // Avoid undefined values

					// Define advanced filter model
					let oData = {
						top: 10,
						skip: 0,
						salesOrder: null,
						soldToParty: null,
						WBSElement: sProject,  // Store project value correctly
						soldToPartyName: null,
						purchaseOrderByCustomer: null,
						overallSDProcessStatus: null,
						customer_contract_mapping_status: null,
						totalNetAmount: null,
						tableSalesOrderBusy: false
					};

					// Set advanced filter model
					this.getView().setModel(new JSONModel(oData), "advancedFilterSalesOrderMdl");

				} catch (error) {
					console.error("Error in setSalesOrderModel:", error);
				} finally {
					this.showLoading(false); // Ensure loading indicator is hidden
				}
			},
			async fetchSalesOrderDetails() {
				try {
					let oFilterMdl = this.getView().getModel("advancedFilterSalesOrderMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData())); // Ensure valid filter data

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
				let oNextUIState;

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("project-details", { layout: "TwoColumnsBeginExpanded", id: this._item, });
				}.bind(this));
				this.fetchSalesOrderById();
			},

			// handleClose: function () {
			//     this.oRouter.navTo("manage-projects", { layout: "OneColumn" });
			// },
			// onExit: function () {
			//     this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
			//     this.oRouter.getRoute("create-project").detachPatternMatched(this._onRouteCreateMatched, this);
			// },

			handleFullScreen: function () {
				let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
				this.oRouter.navTo("project-sales-order-details", { layout: sNextLayout, id: this._item, project: this._project });
			},

			handleExitFullScreen: function () {
				let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
				this.oRouter.navTo("project-sales-order-details", { layout: sNextLayout, id: this._item, project: this._project });
			},

			handleClose: function () {
				let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
				this.oRouter.navTo("project-details", { layout: "MidColumnFullScreen", id: this._project, });
			},

			onExit: function () {
				this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
				this.oRouter.getRoute("create-project").detachPatternMatched(this._onRouteCreateMatched, this);
			}
		}
		);
	},

);