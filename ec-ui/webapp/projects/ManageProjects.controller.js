sap.ui.define(
	[
		"com/ecui/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/ecui/utils/AppConstants",
		"com/ecui/utils/Formatter",
		"com/ecui/utils/ErrorMessage",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/p13n/Engine",
		"sap/m/p13n/SelectionController",
		"sap/m/p13n/SortController",
		"sap/m/p13n/GroupController",
		"sap/m/p13n/FilterController",
		"sap/m/p13n/MetadataHelper",
		"sap/m/table/ColumnWidthController",
		"sap/ui/core/library",
		"sap/ui/model/Sorter",
	],
	function (
		BaseController,
		JSONModel,
		AppConstants,
		Formatter,
		ErrorMessage,
		Filter,
		FilterOperator,
		Engine,
		SelectionController,
		SortController,
		GroupController,
		FilterController,
		MetadataHelper,
		ColumnWidthController,
		coreLibrary,
		Sorter,
	) {
		"use strict";
		return BaseController.extend("com.ecui.projects.ManageProjects", {
			formatter: Formatter,
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oModel = this.oOwnerComponent.getModel();
				this.oRouter
					.getRoute("manage-projects")
					.attachMatched(this._onRouteMatched, this);

				[this._tableId, this.oFilterBar] = [
					this.byId("table_projects"),
					this.byId("filter_projects"),
				];
			},
			_onRouteMatched: function (oEvent) {
				this.errorPopoverParams();
				this.setColulmnsIntoModel();
				this.setModel();
				this._registerForP13n();

				this.LocalDataFetch();
				//this.LiveDataFetch();
			},

			LocalDataFetch: function () {
				this.LocalFetchProjects();
				this.LocalFetchMaster();
			},

			LiveDataFetch: function () {

				this.setMasterModel();
				this.fetchMaster();
				this.setFilterModel();

				// this._columns();

				this.fetchProjects();

			},
			errorPopoverParams: function () {
				this.eMdl = this.getOwnerComponent().getModel("errors");
				ErrorMessage.removeValueState(null, this.eMdl);

				this.eMdl.setData([]);
				this.errorData = [];
			},

			LocalFetchProjects: function () {

				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/projects.json"));

				this.getView().setModel(response, "projectsMdl");

			},
			LocalFetchMaster: function () {
				let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/master.json"));
				this.getView().setModel(response, "masterMdl");
			},
			setColulmnsIntoModel: function () {
				let oSettingsModel = this.oOwnerComponent.getModel("settings");
				// oSettingsModel.getData().columns = this._columns();
				oSettingsModel.refresh(true);
			},
			setModel() {
				let oData = {
					top: 100,
					skip: 0,
					project: null,
					projectDescription: null,
					projectCurrency: null,
					processingStatus: null,
					customer: null,
					ProjectStartDate: null,
					ProjectEndDate: null,

				};
				this.getView().setModel(new JSONModel(oData), "advancedFilterMdl");
			},
			setFilterModel() {
				let oData = {
					top: 10,
					skip: 0,
					project: null,
					projectDescription: null,
				};
				this.getView().setModel(new JSONModel(oData), "FilterMdl");
			},
			setMasterModel() {
				let oData = {
					top: 100,
					skip: 0,
					project: null,
					projectDescription: null,
				};
				this.getView().setModel(new JSONModel(oData), "masterFilterMdl");
			},
			onListItemPress: function (oEvent) {
				let oItem = oEvent.getParameter("listItem");
				let oBindingContext = oItem.getBindingContext("projectsMdl");
				let oModel = this.getView().getModel("projectsMdl");
				let rowObj = oBindingContext.getObject(),
					oNextUIState; // Need to dynamically with api
				let oSettingsModel = this.oOwnerComponent.getModel("settings");

				//Set Navigated Items
				oSettingsModel.setProperty(
					"/navigatedItem",
					oModel.getProperty("id", oBindingContext),
				);

				this.getOwnerComponent()
					.getHelper()
					.then(
						function (oHelper) {
							oNextUIState = oHelper.getNextUIState(0);
							this.oRouter.navTo("project-details", {
								layout: "MidColumnFullScreen",
								id: rowObj.projectInternalID,
							});
						}.bind(this),
					);
			},

			onPressNavCreate: function () {
				this.oRouter.navTo("create-project", {
					layout: "TwoColumnsMidExpanded",
				});
			},
			statusFormatter(statusCollection, value) {
				if (value && statusCollection) {
					return statusCollection.find((e) => e.key == value)?.text || null;
				}
			},
			stateFormatter(value) {
				switch (value) {
					case "1":
						return "Warning";
					case "2":
						return "Success";
					case "3":
						return "None";
					default:
						return "None";
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
			projectTypeText(value, collection) {
				if (value && collection) {
					return collection.find((e) => e.key == value)?.text || null;
				}
			},
			async onValueHelpRequestProject(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oProjectDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.ProjectsDialog",
				});

				this.oProjectDialog.open();
				//	this.fetchMaster();
			},
			onDialogProjectClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputProject");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},
			async onValueHelpRequestCustomer(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oCustomerDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.CustomersDialog",
				});

				this.oCustomerDialog.open();
				//	this.fetchMaster();
			},
			onDialogCustomerClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputCustomer");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},
			async onValueHelpRequestProjectManager(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oProjectManagerDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.ProjectManagersDialog",
				});

				this.oProjectManagerDialog.open();
				//	this.fetchMaster();
			},
			onDialogProjectManagerClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputProjectManager");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},
			async onValueHelpRequestWBS(oEvent) {
				let oButton = oEvent.getSource(),
					oView = this.getView();

				// create dialog lazily
				this.oWBSDialog ??= await this.loadFragment({
					name: "com.ecui.projects.fragments.WBSElementDialog",
				});

				this.oWBSDialog.open();
				//	this.fetchMaster();
			},
			onDialogWBSClose: function (oEvent) {
				let oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("inputWBSElement");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getTitle());
			},

			onPressCancel: function () {
				this.onNavBack();
			},
			onSearch() {
				//this.fetchProjects();
				//this.LocalFetchProjects();
			},
			onProjectFilter(oEvent) {
				let sQuery = oEvent.getParameter("query")?.trim() || null;

				let oFilterMdl = this.getView().getModel("FilterMdl");
				let oFilterData = oFilterMdl ? oFilterMdl.getData() : {};

				oFilterData.project = sQuery;
				oFilterData.projectDescription = sQuery;

				// Update the model
				if (!oFilterMdl) {
					this.getView().setModel(new JSONModel(oFilterData), "FilterMdl");
				} else {
					oFilterMdl.setData(oFilterData);
					oFilterMdl.refresh(true);
				}

				// Trigger project search
				//	this.fetchProjectFilter(oEvent);
			},
			async fetchProjectFilter(oEvent) {
				try {
					this.showLoading(true);

					let oFilterMdl = this.getView().getModel("FilterMdl");
					if (!oFilterMdl) {
						console.warn("Advanced Filter Model is missing.");
						this.showLoading(false);
						return;
					}

					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData())); // Clone model data safely
					let url = AppConstants.URL.project_search;

					let response = await this.restMethodPost(url, reqData);
					if (response) {
						let projectsModel = this.getView().getModel("projectsMdl");
						if (!projectsModel) {
							this.getView().setModel(new JSONModel(response), "projectsMdl");
						} else {
							projectsModel.setData(response);
						}
					}
				} catch (error) {
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onProjectSearch(oEvent) {
				//this.fetchProjectSearch(oEvent);
			},



			LocalFetchProjectSearch(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || "";

					let masterModel = this.getView().getModel("masterMdl");

					// Store original data if not already saved
					if (!this._originalProjectData) {
						this._originalProjectData = masterModel.getProperty("/projects") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/projects", this._originalProjectData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						project: sQuery,
						projectDescription: sQuery,
					};

					masterModel.setProperty("/projects", projectData || []);

				} catch (error) {
					console.error("Project Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},



			async fetchProjectSearch(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || "";

					let masterModel = this.getView().getModel("masterMdl");

					// Store original data if not already saved
					if (!this._originalProjectData) {
						this._originalProjectData = masterModel.getProperty("/projects") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/projects", this._originalProjectData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						project: sQuery,
						projectDescription: sQuery,
					};

					let url = AppConstants.URL.project_search;
					let projectData = await this.restMethodPost(url, reqData);

					masterModel.setProperty("/projects", projectData || []);

				} catch (error) {
					console.error("Project Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onDialogProjectcancel() {
				let masterModel = this.getView().getModel("masterMdl");

				// Restore original data when dialog is closed
				if (this._originalProjectData) {
					masterModel.setProperty("/projects", this._originalProjectData);
				}

				this.oProjectDialog.close();
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
						customerFullName: sQuery,
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


			onWbsElementSearch(oEvent) {
				this.fetchWbsElementSearch(oEvent);
			},

			async fetchWbsElementSearch(oEvent) {
				try {
					this.showLoading(true);

					let sQuery = oEvent.getParameter("value")?.trim() || "";

					let masterModel = this.getView().getModel("masterMdl");

					// Store original WBS data if not already saved
					if (!this._originalWBSData) {
						this._originalWBSData = masterModel.getProperty("/wbs") || [];
					}

					if (!sQuery) {
						// Restore original data when search is cleared
						masterModel.setProperty("/wbs", this._originalWBSData);
						return;
					}

					let reqData = {
						top: 100,
						skip: 0,
						project: sQuery,
						WBSDescription: sQuery,
					};

					let url = AppConstants.URL.wbs_search;
					let wbsData = await this.restMethodPost(url, reqData);

					masterModel.setProperty("/wbs", wbsData || []);

				} catch (error) {
					console.error("WBS Search Error:", error);
					this.errorHandling(error);
				} finally {
					this.showLoading(false);
				}
			},

			onDialogWBSCancel() {
				let masterModel = this.getView().getModel("masterMdl");

				// Restore original WBS data when dialog is closed
				if (this._originalWBSData) {
					masterModel.setProperty("/wbs", this._originalWBSData);
				}

				this.oWBSDlg.close(); // Assuming 'this.oWBSDlg' is the WBS dialog instance
			},


			async fetchProjects() {
				try {
					this.showLoading(false);

					let oFilterMdl = this.getView().getModel("advancedFilterMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData()));
					let url = AppConstants.URL.project_all;

					this.showLoading(true);
					let response = await this.restMethodPost(url, reqData);
					if (response) {
						// Set the model to your view
						this.getView().setModel(new JSONModel(response), "projectsMdl");
					}

					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},
			onDateChange: function (oEvent) {
				let oDate = oEvent.getSource().getDateValue(); // Get the Date object
				if (oDate) {
					let formattedDate = this.formatDate(oDate);
					this.getView().getModel("advancedFilterMdl").setProperty("/ProjectStartDate", formattedDate);
				}
			},
			formatDate: function (oDate) {
				let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd-MM-yyyy" });
				return oDateFormat.format(oDate);
			},

			openPersoDialog: function (oEvt) {
				this._openPersoDialog(
					["Columns", "Sorter", "Groups"],
					oEvt.getSource(),
				);
			},
			async fetchMaster() {
				try {
					this.showLoading(true);

					let oFilterMdl = this.getView().getModel("masterFilterMdl");
					let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData()));

					let projectUrl = AppConstants.URL.project_all;
					let wbsUrl = AppConstants.URL.wbs_all;
					let customerUrl = AppConstants.URL.customer;
					let currencyUrl = AppConstants.URL.currency;

					// Fetch all data in parallel
					let [projectData, wbsData, customerData, currencyData] =
						await Promise.all([
							this.restMethodPost(projectUrl, reqData),
							this.restMethodPost(wbsUrl, reqData),
							this.restMethodPost(customerUrl, reqData),
							this.restMethodGet(currencyUrl),
						]);

					// Combine all responses into a single object
					let masterData = {
						projects: projectData || [],
						wbs: wbsData || [],
						customers: customerData || [],
						currencies: currencyData || [],
					};

					// Set the combined model to the view
					let oModel = this.getView().setModel(new JSONModel(masterData), "masterMdl");
					oModel.refresh(true);
					oFilterMdl.refresh(true);
					this.showLoading(false);
				} catch (error) {
					this.showLoading(false);
					this.errorHandling(error);
				}
			},



			_registerForP13n: function () {
				const _tableId = this._tableId;
				// let oColumns = JSON.parse(JSON.stringify(this._columns())); // deep copy
				// let oReMapCols = oColumns.map((e) => {
				// 	return {
				// 		key: e.id,
				// 		label: e.label,
				// 		path: e.property,
				// 	};
				// });
				this.oMetadataHelper = new MetadataHelper([
					{ id: "project_col", label: "Project", path: "project", width: "25", visible: true },
					{ id: "project_type_col", label: "Project Type", path: "enterpriseProjectType", width: "25", visible: true },
					{ id: "planned_start_col", label: "Planned Start", path: "projectStartDate", width: "25", visible: true },
					{ id: "planned_finish_col", label: "Planned Finish", path: "projectEndDate", width: "25", visible: true },
					{ id: "currency_col", label: "Currency", path: "projectCurrency", width: "25", visible: true },
					{ id: "process_status_col", label: "Processing Status", path: "processingStatus", width: "25", visible: true }
				]);



				Engine.getInstance().register(_tableId, {
					helper: this.oMetadataHelper,
					controller: {
						Columns: new SelectionController({
							targetAggregation: "columns",
							control: _tableId,
						}),
						Sorter: new SortController({
							control: _tableId,
						}),
						Groups: new GroupController({
							control: _tableId,
						}),
						ColumnWidth: new ColumnWidthController({
							control: _tableId,
						}),
						Filter: new FilterController({
							control: _tableId,
						}),
					},
				});

				Engine.getInstance().attachStateChange(
					this.handleStateChange.bind(this),
				);
			},
			_openPersoDialog: function (aPanels, oSource) {
				let _tableId = this._tableId;

				Engine.getInstance().show(_tableId, aPanels, {
					contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
					contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
					source: oSource || _tableId,
				});
			},
			_getKey: function (oControl) {
				return this.getView().getLocalId(oControl.getId());
			},
			handleStateChange: function (oEvt) {
				const _tableId = this._tableId;
				const oState = oEvt.getParameter("state");

				if (!oState) {
					return;
				}

				//Update the columns per selection in the state
				this.updateColumns(oState);

				//Create Filters & Sorters

				const aGroups = this.createGroups(oState);
				const aSorter = this.createSorters(oState, aGroups);

				const aCells = oState.Columns.map(function (oColumnState) {
					switch (oColumnState.key) {
						case "process_status_col":
							return new sap.m.ObjectStatus({
								text: "{= ${" + colPath + "} === '00' ? 'Created' : 'Released'}",
								state: "{= ${" + colPath + "} === '00' ? 'Success' : 'Warning'}"
							});
						default:

					}
					return new Text({
						text: "{" + this.oMetadataHelper.getProperty(oColumnState.key).colPath + "}"
					});
				}.bind(this));

				//rebind the table with the updated cell template
				_tableId.bindItems({
					templateShareable: false,
					path: "projectsMdl>/",
					sorter: aSorter.concat(aGroups),
					template: new sap.m.ColumnListItem({
						type: "Navigation",
						cells: aCells,
					}),
				});

			},


			createSorters: function (oState, aExistingSorter) {
				const aSorter = aExistingSorter || [];
				oState.Sorter.forEach(function (oSorter) {
					const oExistingSorter = aSorter.find(function (oSort) {
						return oSort.sPath === this.oMetadataHelper.getProperty(oSorter.key).path;
					}.bind(this));

					if (oExistingSorter) {
						oExistingSorter.bDescending = !!oSorter.descending;
					} else {
						aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
					}
				}.bind(this));

				oState.Sorter.forEach(oSorter => {
					const oCol = this._tableId.getColumns().find(oColumn => oColumn.data("p13nKey") === oSorter.key);
					if (oCol && oSorter.sorted !== false) {
						oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
					}
				});

				return aSorter;
			},

			createGroups: function (oState) {
				const aGroupings = [];
				oState.Groups.forEach(function (oGroup) {
					aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
				}.bind(this));

				oState.Groups.forEach((oSorter) => {
					const oCol = this._tableId.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
					oCol.data("grouped", true);
				});

				return aGroupings;
			},

			updateColumns: function (oState) {
				const _tableId = this._tableId;

				_tableId.getColumns().forEach((oColumn) => {
					oColumn.setVisible(false);
					const columnKey = this._getKey(oColumn);
					if (oState.ColumnWidth[columnKey]) {
						oColumn.setWidth(oState.ColumnWidth[columnKey]);
					}
					oColumn.setSortIndicator(coreLibrary.SortOrder.None);
					oColumn.data("grouped", false);
				});

				oState.Columns.forEach((oProp) => {
					const oCol = _tableId.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);

					if (oCol) {
						oCol.setVisible(true);
					}
				});

				// Maintain sorting state
				const aSorters = this.createSorters(oState, _tableId.getBinding("items")?.aSorters || []);
				_tableId.getBinding("items").sort(aSorters);
			},



			beforeOpenColumnMenu(oEvt) {
				const oMenu = this.byId("menu");
				const oColumn = oEvt.getParameter("openBy");
				const oSortItem = oMenu.getQuickActions()[0].getItems()[0];
				const oGroupItem = oMenu.getQuickActions()[1].getItems()[0];

				oSortItem.setKey(this._getKey(oColumn));
				oSortItem.setLabel(oColumn.getHeader().getText());
				oSortItem.setSortOrder(oColumn.getSortIndicator());

				oGroupItem.setKey(this._getKey(oColumn));
				oGroupItem.setLabel(oColumn.getHeader().getText());
				oGroupItem.setGrouped(oColumn.data("grouped"));
			},
			onSort: function (oEvt) {
				const oSortItem = oEvt.getParameter("item");
				const _tableId = this._tableId;
				const sAffectedProperty = oSortItem.getKey();
				const sSortOrder = oSortItem.getSortOrder();

				//Apply the state programatically on sorting through the column menu
				//1) Retrieve the current personalization state
				Engine.getInstance()
					.retrieveState(_tableId)
					.then(function (oState) {
						//2) Modify the existing personalization state --> clear all sorters before
						oState.Sorter.forEach(function (oSorter) {
							oSorter.sorted = false;
						});

						if (sSortOrder !== coreLibrary.SortOrder.None) {
							oState.Sorter.push({
								key: sAffectedProperty,
								descending: sSortOrder === coreLibrary.SortOrder.Descending,
							});
						}

						//3) Apply the modified personalization state to persist it in the VariantManagement
						Engine.getInstance().applyState(_tableId, oState);
					});
			},

			onGroup: function (oEvt) {
				const oGroupItem = oEvt.getParameter("item");
				const _tableId = this._tableId;
				const sAffectedProperty = oGroupItem.getKey();

				//1) Retrieve the current personalization state
				Engine.getInstance()
					.retrieveState(_tableId)
					.then(function (oState) {
						//2) Modify the existing personalization state --> clear all groupings before
						oState.Groups.forEach(function (oSorter) {
							oSorter.grouped = false;
						});

						if (oGroupItem.getGrouped()) {
							oState.Groups.push({
								key: sAffectedProperty,
							});
						}

						//3) Apply the modified personalization state to persist it in the VariantManagement
						Engine.getInstance().applyState(_tableId, oState);
					});
			},

			onClear() {
				this.setModel();
			},
			onExit: function () {
				this.oRouter
					.getRoute("manage-projects")
					.detachPatternMatched(this._onRouteMatched, this);
			},
		});
	},
);
