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
		"sap/ui/model/Filter",
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
		FilterOperator,
	) {
		"use strict";
		return BaseController.extend("com.ecui.projects.ProjectDetails", {
			formatter: Formatter,
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oModel = this.oOwnerComponent.getModel();
				this.oRouter
					.getRoute("manage-projects")
					.attachMatched(this._onRouteMatched, this);
				this.oRouter
					.getRoute("project-details")
					.attachMatched(this._onRouteDetailMatched, this);
			},
			_onRouteMatched: function (oEvent) {
				//
			},
			_onRouteDetailMatched(oEvent) {
				this._route = oEvent.getParameter("config").name;
				this._item =
					oEvent.getParameter("arguments").id ||
					oEvent.getParameter("arguments").id ||
					null;
				this.getView().setModel(
					new JSONModel({ route: this._route, item: this._item }),
					"navigationMdl",
				);

				this.errorPopoverParams();

				this.LocalDataFetch();

			},

			LocalDataFetch: function () {
				this.LocalFetchProjects();
				this.LocalFetchMaster();
			},

			LiveDataFetch: function () {

				this.fetchProjectDetailsById();
				this.setMasterModel();
				this.setModel();
				this.setModelPurchaseOrders();
				this.fetchMaster();

			},

			LocalFetchProjects: function () {

				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/project.json"));

				this.getView().setModel(response, "projectMdl");

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
			setModel() {
				let oData = {
					top: 10,
					skip: 0,
					salesOrder: null,
					soldToParty: null,
					soldToPartyName: null,
					purchaseOrderByCustomer: null,
					overallSDProcessStatus: null,
					customer_contract_mapping_status: null,
					totalNetAmount: null,
					tableSalesOrderBusy: false
				};
				this.getView().setModel(new JSONModel(oData), "advancedFilterSalesOrderMdl");
			},
			async fetchProjectDetailsById() {
				try {
					let url = AppConstants.URL.project_by_id.replace("{id}", this._item);
					this.showLoading(true);
					let response = await this.restMethodGet(url);

					if (response) {
						// Set project details model
						this.getView().setModel(new JSONModel(response), "projectMdl");

						// Get the existing filter model
						let oFilterModel = this.getView().getModel("advancedFilterSalesOrderMdl");
						let oPurchaseOrderFilterModel = this.getView().getModel("advancedFilterPurchaseOrderMdl");

						if (oFilterModel) {
							let oData = oFilterModel.getData();

							// Update WBSElement with response.project
							oData.WBSElement = response.project;

							// Refresh the model with updated data
							oFilterModel.setData(oData);
						}
						if (oPurchaseOrderFilterModel) {
							let oPurchaseData = oPurchaseOrderFilterModel.getData();
							oPurchaseData.WBSElementExternalID = response.project; // Bind project to Purchase Order model
							oPurchaseOrderFilterModel.setData(oPurchaseData);
						}


					}

					this.fetchSalesOrdersByProject();
					this.fetchPurchaseOrdersByProject();
					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},



			async fetchSalesOrdersByProject() {
				try {
					let oFilterMdl = this.getView().getModel("advancedFilterSalesOrderMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData())); // Ensure valid filter data


					let oModel = this.getView().getModel("projectMdl");


					let oData = oModel.getData();
					oData.tableSalesOrderBusy = true;
					this.showLoading(true);

					let url = AppConstants.URL.sales_orders_all;
					let response = await this.restMethodPost(url, reqData);
					this.showLoading(true);
					if (response) {
						oData.salesOrders = response || [];
						oData.tableSalesOrderBusy = false;

						// Fetch customer details asynchronously
						for (let e of oData.salesOrders) {
							let oCustomer = await this.fetchCustomerById(e.soldToParty);
							if (oCustomer) {
								e.soldToPartyName = `${oCustomer.customerName} (${oCustomer.customer})`;
							}
						}

						// Update the model with filtered results
						oModel.setData(oData);
						oModel.refresh();
					}

					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},

			setModelPurchaseOrders() {
				let oData = {
					top: 10,
					skip: 0,
					purchaseOrder: null,
					supplierName: null,
					companyName: null,
					WBSElementExternalID: this._item,
					purchasingProcessingStatus: null,
					net_order_value: null,
					customer_contract_mapping_status: null,
					tablePurchaseOrderBusy: false
				};
				this.getView().setModel(new JSONModel(oData), "advancedFilterPurchaseOrderMdl");
			},
			async fetchPurchaseOrdersByProject() {
				try {
					let oFilterMdl = this.getView().getModel("advancedFilterPurchaseOrderMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData())); // Ensure valid filter data


					let oModel = this.getView().getModel("projectMdl");

					let oData = oModel.getData();
					oData.tablePurchaseOrderBusy = true;
					this.showLoading(true);

					let url = AppConstants.URL.purchase_orders_fetch;
					let response = await this.restMethodPost(url, reqData);
					this.showLoading(true);
					if (response) {
						oData.purchaseOrders = response || [];
						oData.tablePurchaseOrderBusy = false;

						// Fetch supplier and company details asynchronously
						for (let e of oData.purchaseOrders) {
							let oSupplier = await this.fetchSupplierById(e.supplier);
							let oCompany = await this.fetchCompanyById(e.companyCode);

							if (oSupplier) {
								e.supplierName = `${oSupplier.supplierName} (${oSupplier.supplier})`;
							}
							if (oCompany) {
								e.companyName = `${oCompany.companyCodeName} (${oCompany.companyCode})`;
							}
						}

						// Update the model with filtered results
						oModel.setData(oData);
						oModel.refresh();
					}

					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},

			async fetchSupplierById(id) {
				try {
					let url = AppConstants.URL.supplier_by_id.replace("{id}", id);
					let response = await this.restMethodGet(url);
					return response || null;
				} catch (error) {
					console.log(error);
				}
			},
			async fetchCustomerById(id) {
				try {
					let url = AppConstants.URL.customer_by_id.replace("{id}", id);
					let response = await this.restMethodGet(url);
					return response || null;
				} catch (error) {
					console.log(error);
				}
			},
			async fetchCompanyById(id) {
				try {
					let url = AppConstants.URL.company_by_id.replace("{id}", id);
					let response = await this.restMethodGet(url);
					return response || null;
				} catch (error) {
					console.log(error);
				}
			},
			processingStatus: function (getValue) {
				let setValue = "None";
				switch (getValue) {
					case "00":
						setValue = "Success";
						break;
					case "10":
						setValue = "Warning";
						break;
					case "41":
						setValue = "Error";
						break;
					case "12":
						setValue = "Information";
						break;
					default:
						setValue = "None";
						break;
				}
				return setValue;
			},
			processingStatusText: function (sStatus) {
				const statusMap = {
					"00": "Created",
					"05": "In Contract Preparation",
					"10": "Released",
					"11": "Released (Processing has begun)",
					"12": "Partially Released",
					"20": "Locked",
					"21": "Locked (Released First)",
					"40": "Completed",
					"41": "Canceled",
					"42": "Closed",
					"60": "Single-Step Role Staffing",
					"70": "Staffing in Process",
					"80": "Flagged for Archiving",
				};
				return statusMap[sStatus] || "Unknown Status";
			},
			salesOrderStatusFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.text;
			},
			salesOrderStateFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.state_color;
			},
			purchaseOrderStatusFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.text;
			},
			purchaseOrderStateFormatter(value, statusColl) {
				if (value && statusColl && statusColl.length > 0)
					return statusColl.find((e) => e.key == value)?.state_color;
			},
			onSalesOrderPress(oEvent) {
				let oItem = oEvent.getParameter("listItem");
				let oBindingContext = oItem.getBindingContext("projectMdl");
				let oModel = this.getView().getModel("projectMdl");
				let oRowData = oBindingContext.getObject(),
					oNextUIState; // Need to dynamically with api
				let oSettingsModel = this.oOwnerComponent.getModel("settings");

				//Set Navigated Items
				//oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("id", oBindingContext));

				this.getOwnerComponent()
					.getHelper()
					.then(
						function (oHelper) {
							oNextUIState = oHelper.getNextUIState(0);
							this.oRouter.navTo("project-sales-order-details", {
								layout: "MidColumnFullScreen",
								id: oRowData.SalesOrder,
								project: this._item,
							});
						}.bind(this),
					);
			},
			onPurchaseOrderPress(oEvent) {
				let oItem = oEvent.getParameter("listItem");
				let oBindingContext = oItem.getBindingContext("projectMdl");
				let oModel = this.getView().getModel("projectMdl");
				let oRowData = oBindingContext.getObject(),
					oNextUIState; // Need to dynamically with api
				let oSettingsModel = this.oOwnerComponent.getModel("settings");

				oRowData.customer_contract_mapping = true;

				//Set Navigated Items
				//oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("id", oBindingContext));

				this.getOwnerComponent()
					.getHelper()
					.then(
						function (oHelper) {
							oNextUIState = oHelper.getNextUIState(0);
							this.oRouter.navTo("project-purchase-order-details", {
								layout: "MidColumnFullScreen",
								id: oRowData.PurchaseOrder,
								project: this._item,
							});
						}.bind(this),
					);
				oModel.refresh();
			},

			async onValueHelpRequestCustomer(oEvent) {
				let oInput = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oCustomerDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.CustomersDialog",
				});
				this.oCustomerDialog.setTitle("Select Sold-to Party");
				this.oCustomerDialog.open();

			},


			async onValueHelpRequestCustomerReference(oEvent) {
				let oInput = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oCustomerDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.CustomersDialog",
				});
				this.oCustomerDialog.setTitle("Select Customer Reference");
				this.oCustomerDialog.open();

			},
			onDialogCustomerClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInputSTParty = this.byId("inputSTParty"),
					oInputCustomer = this.byId("inputCustomer");

				if (!oSelectedItem) {
					oInputSTParty.resetProperty("value");
					oInputCustomer.resetProperty("value");
					return;
				}

				let selectedValue = oSelectedItem.getTitle();
				oInputSTParty.setValue(selectedValue);
				oInputCustomer.setValue(selectedValue);
			},
			onCustomerSearch(oEvent) {
				this.fetchCustomerSearch(oEvent);
			},

			async fetchCustomerSearch(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || "";

					let masterModel = this.getView().getModel("masterMdl");

					// Store original customer data if not already saved
					if (!this._originalCustomerData) {
						this._originalCustomerData = masterModel.getProperty("/customers") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/customers", this._originalCustomerData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						customer: sQuery,
						customerFullName: sQuery
					};

					let url = AppConstants.URL.customer_search;
					let customerData = await this.restMethodPost(url, reqData);

					masterModel.setProperty("/customers", customerData || []);

				} catch (error) {
					console.error("Customer Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onDialogCustomercancel() {
				let masterModel = this.getView().getModel("masterMdl");

				// Restore original customer data when dialog is closed
				if (this._originalCustomerData) {
					masterModel.setProperty("/customers", this._originalCustomerData);
				}

				this.oCustomerDialog.close();
			},

			async onValueHelpRequestSupplier(oEvent) {
				let oInput = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oSupplierDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.SupplierDialog",
				});
				this.oSupplierDialog.setTitle("Select Supplier");
				this.oSupplierDialog.open();

			},
			onCustomerSearchSupplier(oEvent) {
				this.fetchCustomerSearchSupplier(oEvent);
			},

			async fetchCustomerSearchSupplier(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || ""; // Trim whitespace
					let masterModel = this.getView().getModel("masterMdl");

					// Store original data if not already saved
					if (!this._originalSupplierData) {
						this._originalSupplierData = masterModel.getProperty("/supplier") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/supplier", this._originalSupplierData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						supplier: sQuery,
						supplierFullName: sQuery
					};

					let url = AppConstants.URL.supplier_all;
					let supplierData = await this.restMethodPost(url, reqData);

					if (supplierData) {
						masterModel.setProperty("/supplier", supplierData);
					}

				} catch (error) {
					console.error("Supplier Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onDialogSuppliercancel() {
				let masterModel = this.getView().getModel("masterMdl");

				// Restore original supplier data when dialog is closed
				if (this._originalSupplierData) {
					masterModel.setProperty("/supplier", this._originalSupplierData);
				}

				this.oSupplierDialog.close();
			},

			onDialogSupplierClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputPOCustomer");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},

			async onValueHelpRequestCompany(oEvent) {
				let oInput = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oCompanyDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.CompanyDialog",
				});
				this.oCompanyDialog.setTitle("Select Company");
				this.oCompanyDialog.open();
			},
			onDialogCompanyClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputPOCompany");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},
			onCompanySearch: async function (oEvent) {
				this.fetchCustomerSearchCompany(oEvent);
			},

			async fetchCustomerSearchCompany(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || ""; // Trim whitespace
					let masterModel = this.getView().getModel("masterMdl");

					// Store original data if not already saved
					if (!this._originalCompanyData) {
						this._originalCompanyData = masterModel.getProperty("/companyCode") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/companyCode", this._originalCompanyData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						companyCode: sQuery,
						companyCodeName: sQuery
					};

					let url = AppConstants.URL.company_all;
					let companyData = await this.restMethodPost(url, reqData);

					if (companyData) {
						masterModel.setProperty("/companyCode", companyData);
					}

				} catch (error) {
					console.error("Company Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onDialogCompanycancel() {
				let masterModel = this.getView().getModel("masterMdl");

				// Restore original company data when dialog is closed
				if (this._originalCompanyData) {
					masterModel.setProperty("/companyCode", this._originalCompanyData);
				}

				this.oCustomerDialog.close();
			},


			onPressCancel: function () {
				this.oRouter.navTo("manage-projects", { layout: "OneColumn" });
			},

			handleFullScreen: function () {
				let sNextLayout = this.oModel.getProperty(
					"/actionButtonsInfo/midColumn/fullScreen",
				);
				this.oRouter.navTo("project-details", {
					layout: sNextLayout,
					id: this._item,
				});
			},

			handleExitFullScreen: function () {
				let sNextLayout = this.oModel.getProperty(
					"/actionButtonsInfo/midColumn/exitFullScreen",
				);
				this.oRouter.navTo("project-details", {
					layout: sNextLayout,
					id: this._item,
				});
			},

			// master filter ************
			setMasterModel() {
				let oData = {
					top: 100,
					skip: 0,

				};
				this.getView().setModel(new JSONModel(oData), "advancedFilterMdl");
			},
			async fetchMaster() {
				try {
					this.showLoading(true);

					let oFilterMdl = this.getView().getModel("advancedFilterMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData()));

					let supplierUrl = AppConstants.URL.supplier_all;
					let companyUrl = AppConstants.URL.company_all;
					let customerUrl = AppConstants.URL.customer;
					let currencyUrl = AppConstants.URL.currency;

					// Fetch all data in parallel
					let [supplierData, companyData, customerData, currencyData] = await Promise.all([
						this.restMethodPost(supplierUrl, reqData),
						this.restMethodGet(companyUrl),
						this.restMethodPost(customerUrl, reqData),
						this.restMethodGet(currencyUrl)
					]);

					// Combine all responses into a single object
					let masterData = {
						supplier: supplierData || [],
						company: companyData || [],
						customers: customerData || [],
						currencies: currencyData || []
					};

					// Set the combined model to the view
					this.getView().setModel(new JSONModel(masterData), "masterMdl");

					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},


			handleClose: function () {
				let sNextLayout = this.oModel.getProperty(
					"/actionButtonsInfo/midColumn/closeColumn",
				);
				this.oRouter.navTo("manage-projects", { layout: sNextLayout });
			},

			onExit: function () {
				this.oRouter
					.getRoute("manage-projects")
					.detachPatternMatched(this._onRouteMatched, this);
				this.oRouter
					.getRoute("project-details")
					.detachPatternMatched(this._onRouteDetailMatched, this);
			},
			onSearch() {
				//this.fetchSalesOrdersByProject();

			},
			onClear() {
				this.setModel();

			},
			onClearPurchasingOrder() {

				this.setModelPurchaseOrders();
			},
			onSearchPurchasingOrders() {
				//this.fetchPurchaseOrdersByProject();
			},
			onSalesOrdersFilter(oEvent) {
				let sQuery = oEvent.getParameter("query")?.trim() || null;

				let oFilterMdl = this.getView().getModel("advancedFilterSalesOrderMdl");
				let oFilterData = oFilterMdl ? oFilterMdl.getData() : {};

				oFilterData.soldToParty = sQuery;
				oFilterData.soldToPartyName = sQuery;


				// Update the model
				if (!oFilterMdl) {
					this.getView().setModel(new JSONModel(oFilterData), "advancedFilterSalesOrderMdl");
				} else {
					oFilterMdl.setData(oFilterData);
				}

				// Trigger project search
				//this.fetchSalesOrdersByProject(oEvent);
			},
			onPurchasingOrdersFilter(oEvent) {
				let sQuery = oEvent.getParameter("query")?.trim() || null;

				let oFilterMdl = this.getView().getModel("advancedFilterPurchaseOrderMdl");
				let oFilterData = oFilterMdl ? oFilterMdl.getData() : {};

				oFilterData.supplier = sQuery;
				oFilterData.supplierName = sQuery;


				// Update the model
				if (!oFilterMdl) {
					this.getView().setModel(new JSONModel(oFilterData), "advancedFilterPurchaseOrderMdl");
				} else {
					oFilterMdl.setData(oFilterData);
				}

				// Trigger project search
				//this.fetchPurchaseOrdersByProject(oEvent);
			},
		});
	},
);
