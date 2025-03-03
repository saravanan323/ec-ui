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
		return BaseController.extend(
			"com.ecui.projects.PR_PurchaseOrderDetails",
			{
				formatter: Formatter,
				onInit: function () {
					this.oOwnerComponent = this.getOwnerComponent();
					this.oRouter = this.oOwnerComponent.getRouter();
					this.oModel = this.oOwnerComponent.getModel();
					this.oRouter
						.getRoute("manage-projects")
						.attachMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("project-purchase-order-details")
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
					this._project =
						oEvent.getParameter("arguments").project ||
						oEvent.getParameter("arguments").project ||
						null;
					this.getView().setModel(
						new JSONModel({ route: this._route, item: this._item }),
						"navigationMdl",
					);

					this.errorPopoverParams();

					let vData = {
						footer: false,
						editable: false,
					};
					this.getView().setModel(new JSONModel(vData), "visible");


					this.LocalDataFetch();
					// this.setModel();
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

				async fetchProjectDetailsById() {
					try {
						let url = AppConstants.URL.project_by_id.replace("{id}", this._project);
						this.showLoading(true);
						let response = await this.restMethodGet(url);
						this.getView().setModel(new JSONModel(response), "projectMdl");
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

						this.showLoading(false);

						// Ensure response is an array before binding
						if (!Array.isArray(response)) {
							response = []; // Default to empty array
						}

						this.getView().setModel(new JSONModel({ sales_orders: response }), "salesOrderMdl");

					} catch (error) {
						this.showLoading(false);
						this.errorHandling(error);
					}
				},

				errorPopoverParams: function () {
					this.eMdl = this.getOwnerComponent().getModel("errors");
					ErrorMessage.removeValueState(null, this.eMdl);

					this.eMdl.setData([]);
					this.errorData = [];
				},

				fetchPurchaseOrderById: async function () {
					try {
						this.showLoading(true);
						let path = AppConstants.URL.purchase_order_by_id.replace(
							"{id}",
							this._item,
						);
						let response = await this.restMethodGet(path);

						if (response) {
							let oSupplier = await this.fetchSupplierById(response.supplier);
							let oCompany = await this.fetchCompanyById(response.companyCode);
							let oPurchaseOrg = await this.fetchCompanyById(
								response.purchasingOrganization,
							);
							response.purchaseOrderDate = response.purchaseOrderDate
								? response.purchaseOrderDate.split("-").reverse().join("-")
								: null;
							if (oSupplier) {
								response.supplierName =
									oSupplier.supplierName + " (" + oSupplier.supplier + ")";
							}
							if (oCompany) {
								response.companyName =
									oCompany.companyCodeName + " (" + oCompany.companyCode + ")";
							}
							if (oPurchaseOrg) {
								response.purchasingOrgName =
									oPurchaseOrg.companyCodeName +
									" (" +
									oPurchaseOrg.companyCode +
									")";
							}
						}

						this.getView().setModel(
							new JSONModel(response),
							"PurchaseOrderMdl",
						);
						this.totalCalculation();
						/* await this.fetchCompany();
						await this.fetchSupplier();
						await this.totalCalculation(); */
						this.showLoading(false);
					} catch (error) {
						this.showLoading(false);
						this.errorHandling(error);
					}
				},
				async fetchSupplierById(id) {
					if (!id) {
						return null;
					}
					try {
						let url = AppConstants.URL.supplier_by_id.replace("{id}", id);
						let response = await this.restMethodGet(url);
						return response || null;
					} catch (error) {
						console.log(error);
					}
				},
				async fetchCompanyById(id) {
					if (!id) {
						return null;
					}
					try {
						let url = AppConstants.URL.company_by_id.replace("{id}", id);
						let response = await this.restMethodGet(url);
						return response || null;
					} catch (error) {
						console.log(error);
					}
				},
				docTypeFormatter(value, collection) {
					if (value && collection && collection.length > 0)
						return collection.find((e) => e.key == value)?.text;
				},
				totalCalculation: function () {
					let oModel = this.getView().getModel("PurchaseOrderMdl");
					let oData = oModel.getData();

					if (oData.items && Array.isArray(oData.items)) {
						let totalAmount = oData.items.reduce((sum, item) => {
							let quantity = parseFloat(item.orderQuantity) || 0;
							let price = parseFloat(item.netPriceAmount) || 0;
							return sum + quantity * price;
						}, 0);

						// Update the total amount in documentCurrency field
						oData.totalAmount = totalAmount.toFixed(2); // Keeping 2 decimal places
						oModel.setData(oData);
					}
				},
				purchaseOrderstatusFormatter(value) {
					let data = [
						{
							key: "02",
							text: "In Approval",
						},
						{
							key: "03",
							text: "Not Yet Sent",
						},
						{
							key: "04",
							text: "Sent",
						},
						{
							key: "05",
							text: "Follow-On Documents",
						},
						{
							key: "09",
							text: "Expired",
						},
						{
							key: "10",
							text: "Deleted",
						},
						{
							key: "37",
							text: "Output Error",
						},
						{
							key: "38",
							text: "Rejected",
						},
						{
							key: "40",
							text: "Not Yet Relevant",
						},
					];

					return data.find((e) => e.key == value)?.text;
				},

				purchaseOrderstatusState: function (getValue) {
					let setValue = "None";
					switch (getValue) {
						case "02":
							setValue = "Success";
							break;
						case "03":
							setValue = "Information";

							break;
						case "04":
							setValue = "Success";
							break;
						case "05":
							setValue = "Information";
							break;
						case "09":
							setValue = "Warning";
							break;
						case "10":
							setValue = "Warning";

							break;
						case "37":
							setValue = "Error";
							break;
						case "38":
							setValue = "Error";
							break;
						case "40":
							setValue = "Information";
							break;

						default:
							setValue = "None";
							break;
					}
					return setValue;
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
					try {
						let oButton = oEvent.getSource(),
							oView = this.getView();

						// Ensure _project exists before making the request
						if (!this._project) {
							console.warn("Project ID is not set.");
							return;
						}

						// Fetch project details by ID
						await this.fetchProjectDetailsById();

						// Fetch sales orders by project
						await this.fetchSalesOrdersByProject();

						// Create and open dialog lazily
						this.oSalesOrderDialog ??= await this.loadFragment({
							name: "com.ecui.projects.fragments.SalesOrderListDialog",
						});
						this.sPath = oEvent.getSource().getBindingContext("PurchaseOrderMdl").getPath();
						this.oSalesOrderDialog.open();
					} catch (error) {
						console.error("Error in onValueHelpRequestSalesOrder:", error);
					}
				},

				onDialogSalesOrderClose: function (oEvent) {
					let oSelectedItem = oEvent.getParameter("selectedItem");
					let oModel = this.getView().getModel("salesOrderMdl");
					let oInput = this.byId("inputSalesOrder"); // Input where salesOrder is displayed

					if (!oSelectedItem) {
						if (oInput) {
							oInput.resetProperty("value"); // Reset input if nothing is selected
						}
						this.oSelSalesObject = null;
						return;
					}

					let oBindingContext = oSelectedItem.getBindingContext("salesOrderMdl");

					if (!oBindingContext) {
						console.error("No binding context found for the selected item.");
						return;
					}

					//	let sPath = oBindingContext.getPath();
					let oSalesOrderMdl = this.getView().getModel("salesOrderMdl");
					let getPOModel = this.getView().getModel("PurchaseOrderMdl");

					if (!oSalesOrderMdl) {
						console.error("Model 'PurchaseOrderMdl' not found.");
						return;
					}

					//let oPurchaseOrder = getPOModel.getProperty(this.sPath + "/purchaseOrderByCustomer");
					let oSalesOrder = oSelectedItem.getTitle(); // Get salesOrder title

					this.oSelSalesObject = oSalesOrder; // Store salesOrder internally

					// Display selected salesOrder in the input field
					if (oInput) {
						oInput.setValue(oSalesOrder);
					}

					// Update the model so that the table reflects the change
					getPOModel.setProperty(this.sPath + "/purchaseOrderByCustomer", oSalesOrder);
					getPOModel.refresh(true);
					this.sPath = null;
					this.fetchSalesOrderById(oSalesOrder);
				}
				,
				async onValueHelpRequestItems(oEvent) {
					let oButton = oEvent.getSource(),
						oView = this.getView();
					this.oSelItemObject = oEvent
						.getSource()
						.getBindingContext("PurchaseOrderMdl")
						.getObject();

					// create dialog lazily
					this.oSalesItemDialog ??= await this.loadFragment({
						name: "com.ecui.projects.fragments.ItemsDialog",
					});

					this.oSalesItemDialog.open();
				},
				fetchSalesOrderById: async function (id) {
					try {
						this.showLoading(true);
						let Path = AppConstants.URL.sales_order_by_id.replace("{id}", id);
						let response = await this.restMethodGet(Path);
						let oModel = new JSONModel(response);
						let getItems = this.getView().setModel(oModel, "salesOrderItemsMdl");
						//	this.fetchSalesOrderDetails();
					} catch (ex) {
						this.errorHandling(ex);
					} finally {
						this.showLoading(false);
					}
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
					sap.m.MessageBox.success("Updated Successfully!");
					this.onCustomerContractMappingButtonPress();
				},

				onPressCancel: function () {
					this.onCustomerContractMappingButtonPress();
					this.setModel();
					/* let oNextUIState;

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("project-details", { layout: "TwoColumnsBeginExpanded", id: this._item, });
				}.bind(this)); */
				},

				// handleClose: function () {
				//     this.oRouter.navTo("manage-projects", { layout: "OneColumn" });
				// },
				// onExit: function () {
				//     this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
				//     this.oRouter.getRoute("create-project").detachPatternMatched(this._onRouteCreateMatched, this);
				// },

				handleFullScreen: function () {
					let sNextLayout = this.oModel.getProperty(
						"/actionButtonsInfo/midColumn/fullScreen",
					);
					this.oRouter.navTo("project-purchase-order-details", {
						layout: sNextLayout,
						id: this._item,
						project: this._project,
					});
				},

				handleExitFullScreen: function () {
					let sNextLayout = this.oModel.getProperty(
						"/actionButtonsInfo/midColumn/exitFullScreen",
					);
					this.oRouter.navTo("project-purchase-order-details", {
						layout: sNextLayout,
						id: this._item,
						project: this._project,
					});
				},

				handleClose: function () {
					let sNextLayout = this.oModel.getProperty(
						"/actionButtonsInfo/midColumn/closeColumn",
					);
					this.oRouter.navTo("project-details", {
						layout: "MidColumnFullScreen",
						id: this._project,
					});
				},

				onExit: function () {
					this.oRouter
						.getRoute("manage-projects")
						.detachPatternMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("create-project")
						.detachPatternMatched(this._onRouteCreateMatched, this);
				},
			},
		);
	},
);
