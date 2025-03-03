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
        "sap/ui/model/FilterOperator"
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
        return BaseController.extend(
            "com.ecui.payment_certifcate.PaymentCertifcate",
            {
                formatter: Formatter,
                onInit: function () {
                    this.oOwnerComponent = this.getOwnerComponent();
                    this.oRouter = this.oOwnerComponent.getRouter();
                    this.oModel = this.oOwnerComponent.getModel();
                    this.oRouter
                        .getRoute("manage-payment-certifcate")
                        .attachMatched(this._onRouteMatched, this);
                    this.oRouter
                        .getRoute("payment-certifcate-details")
                        .attachMatched(this._onRouteDetailMatched, this);
                    this._tableId = this.byId("table_equipment_demand");
                },
                _onRouteMatched: function (oEvent) {
                    this.onRouteFunctionalities(oEvent);
                    // this.setColulmnsIntoModel();
                    let setDataModel = {
                        status: [
                            { key: "1", text: "Approved" },
                            { key: "2", text: "In Approval" },
                            { key: "3", text: "Rejected" },
                            { key: "4", text: "In Revision" }

                        ],


                    };
                    let companyModel = new sap.ui.model.json.JSONModel({
                        CompanyCollection: [
                            { company_id: "100001", company: "inflexion-Dubai" },
                            { company_id: "100002", company: "inflexion-India" },
                            { company_id: "200001", company: "inflexion-Oman" },
                            { company_id: "200002", company: "inflexion-Egypt" }
                        ]
                    });
                    this.getView().setModel(companyModel, "companyModel");

                    let projectModel = new sap.ui.model.json.JSONModel({
                        ProjectCollection: [
                            { project_id: "104", project: "EC Tower E E.03.001" },
                            { project_id: "103", project: "EC Tower 1 E.00.001" },
                            { project_id: "102", project: "Construction Plan C.00.001" },
                            { project_id: "101", project: "Building Tower A E.23.003" }
                        ]
                    });
                    this.getView().setModel(projectModel, "projectModel");


                    this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
                    this.LocalDataFetch();

                },
                _onRouteDetailMatched: function (oEvent) {
                    this.onRouteFunctionalities(oEvent);
                },



                LocalDataFetch: function () {
                    this.LocalFetchProjects();
                    this.LocalFetchMaster();
                    this.LocalFetchCustomers();
                    this.LocalFetchCompany();
                    this.LocalFetchWBSElements();
                },

                LiveDataFetch: function () {


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


                LocalFetchCompany: function () {
                    let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/companies.json"));
                    this.getView().setModel(response, "companiesMdl");
                },

                LocalFetchWBSElements: function () {
                    let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/wbselement.json"));
                    this.getView().setModel(response, "wbsElementMdl");
                },

                setMasterModel() {
                    let oData = {
                        top: 100,
                        skip: 0,
                        companyCode: null,
                        companyCodeName: null,
                        project: null,
                        projectDescription: null
                    };
                    this.getView().setModel(new JSONModel(oData), "masterFilterMdl");
                },
                async onValueHelpRequestWBS(oEvent) {
                    let oButton = oEvent.getSource(),
                        oView = this.getView();

                    // create dialog lazily
                    this.oWBSDialog ??= await this.loadFragment({
                        name: "com.ecui.projects.fragments.WBSElementDialog"
                    });

                    this.oWBSDialog.open();
                    // this.fetchMaster();

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
                            WBSDescription: sQuery
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

                setColulmnsIntoModel: function () {
                    let oSettingsModel = this.oOwnerComponent.getModel("settings");
                    oSettingsModel.getData().columns = this.createColumnSystem();
                    oSettingsModel.refresh(true);
                },
                createColumnSystem: function () {
                    return [
                        {
                            label: 'Application No',
                            property: "application_no",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Orginal PA Value',
                            property: "origional_pa_value",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Project',
                            property: "project",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Company',
                            property: "company",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Updated PA Value',
                            property: "updated_value",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Invoice',
                            property: "invoice",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Invoice Value',
                            property: "invoice_value",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Due Date',
                            property: "due_date",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Submitted Date',
                            property: "submitted_date",
                            width: "25",
                            visible: true
                        },
                        {
                            label: 'Status',
                            property: "status",
                            width: "25",
                            visible: true
                        }

                    ];
                },

                //     let oView = this.getView();
                //     this.inputId = oEvent.getSource().getId();

                //     // create value help dialog
                //     if (!this._pValueHelpDialog) {
                //         this._pValueHelpDialog = Fragment.load({
                //             id: oView.getId(),
                //             name: "com.ecui.view.fragment.Project",
                //             controller: this
                //         }).then(function (pValueHelpDialog) {
                //             oView.addDependent(pValueHelpDialog);
                //             return pValueHelpDialog;
                //         });
                //     }

                //     this._pValueHelpDialog.then(function (pValueHelpDialog) {
                //         // open value help dialog
                //         pValueHelpDialog.open();
                //     });
                // },
                getDemands: function () {

                    let selectionMdl = this.getView().getModel("equipmentDemandsMdl").getData();

                    let oData = {
                        applications: [
                            {
                                application_no: "1",
                                status: 1,
                                origional_pa_value: { amount: 80000.00, currency: "AED" },
                                updated_value: { amount: 75000.00, currency: "AED" },
                                invoice: "1000067",
                                project_id: "101",
                                project: "Construction Plan C.00.001",
                                company_id: "100001",
                                company: "Inflexion tech",
                                invoice_value: { amount: 8300.00, currency: "AED" },
                                due_date: "10-03-2025",
                                submitted_date: "15-02-2025"
                            }
                        ]
                    };

                    selectionMdl.utilization = oData.applications;

                    this.getView().getModel("equipmentDemandsMdl").refresh(true);
                    this.LocalDataFetch();

                },
                onRouteFunctionalities: function (oEvent) {
                    this.errorPopoverParams();
                    this.getView().setModel(new JSONModel(), "equipmentDemandsMdl");
                    let advancedFilterObj = {
                        application_no: null,
                        company: null,
                        project: null,
                        project_name: null,
                        wbs_element: null
                    }
                    this.setMasterModel();
                    // this.fetchMaster();
                    this.getView().setModel(new JSONModel(advancedFilterObj), "advancedSearchMdl");
                    this.getView().setModel(new JSONModel(), "advancedFilterMdl");
                    this.getView().setModel(new JSONModel(), "selectionMdl");
                    this._route = oEvent.getParameter("config").name;
                    this.genericTitle("Equipment Demands");
                    this.getDemands();
                    this.disableItemNavigated(this._tableId);
                },
                errorPopoverParams: function (formId) {
                    let ids = {
                        basic: "sf_basicDetails",
                        attachment: "sf_attachment",
                        property: "sf_PropHierarchy",
                    };

                    this.pageId = this.getView().byId("page_equipmentDemand");
                    this.popoverBtn = this.getView().byId("btnErr_equpmentDemand");

                    //******Set Initially Empty Error Mdl******
                    this.eMdl = this.getOwnerComponent().getModel("errors");
                    ErrorMessage.removeValueState(null, this.eMdl);

                    this.eMdl.setData([]);
                    this.errorData = [];
                },
                onPressNavCreateEqupment: function (oEvent) {
                    this.oRouter.navTo("create-equipment-demand", {
                        layout: "MidColumnFullScreen"
                    });
                },
                onPressCancel: function () {
                    this.onNavBack();
                },
                onListItemPress: function (oEvent) {
                    let systemCtxt = oEvent.getSource().getBindingContext("equipmentDemandsMdl").getObject();
                    let oSettingsModel = this.oOwnerComponent.getModel('settings');
                    oSettingsModel.setProperty("/navigatedItem", systemCtxt.application_no);
                    this.oRouter.navTo("payment-certifcate-details", { layout: "OneColumn", id: systemCtxt.application_no });
                },

                fetchWBSElements: async function (oEvent) {
                    try {
                        let that = this;
                        let selectionMdl = this.getView().getModel("selectionMdl").getData();
                        this.table_SelectWBSElement.setBusy(true);
                        let wbsPath = AppConstants.URL.wbs;
                        let response = await this.restMethodGet(wbsPath);
                        let data = response?.d?.results;
                        if (data && Array.isArray(data)) {
                            data.forEach(e => {
                                e.BasicStartDate = that.getUtcDate(e.BasicStartDate);
                                e.BasicEndDate = that.getUtcDate(e.BasicEndDate);
                            });
                        }
                        selectionMdl.wbsElement = data;
                        this.table_SelectWBSElement.setBusy(false);
                        this.getView().getModel("selectionMdl").refresh(true);
                    } catch (error) {
                        this.table_SelectWBSElement.setBusy(false);
                        this.errorHandling(ex);
                    }
                },
                fetchCostCenter: async function (oEvent) {
                    try {
                        let that = this;
                        let selectionMdl = this.getView().getModel("selectionMdl").getData();
                        this.table_SelectCostCenter.setBusy(true);
                        let cost_centrePath = AppConstants.URL.cost_centre;
                        let response = await this.restMethodGet(cost_centrePath);
                        let data = response?.d?.results;
                        if (data && Array.isArray(data)) {
                            data.forEach(e => {
                                e.ValidityStartDate = that.getUtcDate(e.ValidityStartDate);
                                e.ValidityEndDate = that.getUtcDate(e.ValidityEndDate);
                                if (!isNaN(e.CostCenter)) {
                                    e.CostCenter = Math.abs(e.CostCenter);
                                }
                            });
                        }
                        selectionMdl.costCenter = data;
                        this.table_SelectCostCenter.setBusy(false);
                        this.getView().getModel("selectionMdl").refresh(true);
                    } catch (error) {
                        this.table_SelectCostCenter.setBusy(false);
                        this.errorHandling(ex);
                    }
                },
                fetchActivityType: async function (oEvent) {
                    try {
                        let that = this;
                        let selectionMdl = this.getView().getModel("selectionMdl").getData();
                        this.table_SelectActivityType.setBusy(true);
                        let activity_typesPath = AppConstants.URL.activity_types;
                        let response = await this.restMethodGet(activity_typesPath);
                        let data = response?.d?.results;
                        if (data && Array.isArray(data)) {
                            data.forEach(e => {
                                e.ValidityStartDate = that.getUtcDate(e.ValidityStartDate);
                                e.ValidityEndDate = that.getUtcDate(e.ValidityEndDate);
                                if (!isNaN(e.CostCtrActivityType)) {
                                    e.CostCtrActivityType = Math.abs(e.CostCtrActivityType);
                                }
                            });
                        }
                        selectionMdl.activityType = data;
                        this.table_SelectActivityType.setBusy(false);
                        this.getView().getModel("selectionMdl").refresh(true);
                    } catch (error) {
                        this.table_SelectActivityType.setBusy(false);
                        this.errorHandling(ex);
                    }
                },
                //********** WBS Element Fragment Start ******************/
                valueHelpDialogWBSElement: function (oEvent) {
                    let that = this;
                    let oView = this.getView();
                    if (!this.wbsElementDialog) {
                        this.wbsElementDialog = new Promise(
                            function (resolve, reject) {
                                Fragment.load({
                                    id: oView.getId(),
                                    name: "com.ecui.create_equipment_demand.SelectWBSElement", // Fragment name with namespace
                                    controller: this, // Main view's controller context
                                })
                                    .then(
                                        function (oDialog) {
                                            resolve(oDialog);
                                        }.bind(this)
                                    )
                                    .catch(function (oError) {
                                        reject(oError);
                                    });
                            }.bind(this)
                        );
                    }
                    this.wbsElementDialog.then(function (oDialog) {
                        oView.addDependent(oDialog);
                        // let selectedIn = oEvent?.getSource()?.sId.split("-")?.pop();
                        // that.selectedIndex = selectedIn ? Number(selectedIn) : null;
                        oDialog.open();
                        that.table_SelectWBSElement = oView.byId("table_SelectWBSElement");
                        that.table_SelectWBSElement.removeSelections();
                        that.fetchWBSElements();
                    });
                },

                valueHelpWBSElementClose: function (oEvent) {
                    this.wbsElementDialog.then(function (oDialog) {
                        oDialog.close();
                    });
                    this.table_SelectWBSElement.removeSelections();
                    let oModel = this.getView().getModel("selectionMdl").getData();
                    oModel.wbsElement = [];
                    this.getView().getModel("selectionMdl").refresh(true);
                },
                selectedWBSElement: function (oEvent) {
                    let that = this;
                    let oModel = this.getView().getModel("advancedSearchMdl").getData(),
                        selItems,
                        selWBSElement;
                    this.selWBS = this.getView().byId("table_SelectWBSElement");
                    selItems = this.selWBS.getSelectedItems();
                    if (selItems.length == 1) {
                        selWBSElement = this.selWBS.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
                        // oModel.wbs_element_id = selWBSElement?.WBSElementInternalID;
                        oModel.wbs_element_id = selWBSElement?.WBSElementShortID;
                        oModel.wbs_element_id_and_text = selWBSElement?.WBSElementShortID + " - " + selWBSElement?.WBSDescription;
                        this.getView().getModel("advancedSearchMdl").refresh(true);
                        this.valueHelpWBSElementClose();
                    } else {
                        MessageToast.show("Please select atleast one row!");
                    }
                },
                advancedFilterWBSElement: function () {
                    let filterArr = [];
                    let mdl = this.getView().getModel("advancedFilterMdl");
                    let data = mdl.getData();
                    this.table_SelectWBSElement.removeSelections();
                    for (let [key, value] of Object.entries(data)) {
                        if (value != "") {
                            value = value.trim();
                            filterArr.push(new sap.ui.model.Filter("WBSElementShortID", sap.ui.model.FilterOperator.Contains, value));
                            filterArr.push(new sap.ui.model.Filter("WBSDescription", sap.ui.model.FilterOperator.Contains, value));
                            filterArr.push(new sap.ui.model.Filter("BasicStartDate", sap.ui.model.FilterOperator.EQ, value));
                            filterArr.push(new sap.ui.model.Filter("BasicEndDate", sap.ui.model.FilterOperator.EQ, value));
                        }
                    }
                    let binding = this.table_SelectWBSElement.getBinding("items");
                    // binding.filter(filters);
                    if (filterArr.length > 0)
                        binding.filter(new sap.ui.model.Filter({ filters: filterArr, and: false }));
                    else
                        binding.filter([]);
                },
                clearAllWBSElementFilters: function (oEvent) {
                    this.table_SelectWBSElement.removeSelections();
                    this.getView().setModel(new JSONModel(), "advancedFilterMdl");
                    this.getView().getModel("advancedFilterMdl").refresh(true);
                    let binding = this.table_SelectWBSElement.getBinding("items");
                    binding.filter([]);
                },
                //**********  WBS Element Fragment End ******************/
                //********** Cost Center Fragment Start ******************/
                valueHelpDialogCostCenter: function (oEvent) {
                    let that = this;
                    let oView = this.getView();
                    if (!this.costCenterDialog) {
                        this.costCenterDialog = new Promise(
                            function (resolve, reject) {
                                Fragment.load({
                                    id: oView.getId(),
                                    name: "com.ecui.create_equipment_demand.SelectCostCenter", // Fragment name with namespace
                                    controller: this, // Main view's controller context
                                })
                                    .then(
                                        function (oDialog) {
                                            resolve(oDialog);
                                        }.bind(this)
                                    )
                                    .catch(function (oError) {
                                        reject(oError);
                                    });
                            }.bind(this)
                        );
                    }
                    this.costCenterDialog.then(function (oDialog) {
                        oView.addDependent(oDialog);
                        let selectedIn = oEvent?.getSource()?.sId.split("-")?.pop();
                        that.selectedIndex = selectedIn ? Number(selectedIn) : null;
                        oDialog.open();
                        that.table_SelectCostCenter = oView.byId("table_SelectCostCenter");
                        that.table_SelectCostCenter.removeSelections();
                        that.fetchCostCenter();
                    });
                },

                valueHelpCostCenterClose: function (oEvent) {
                    this.costCenterDialog.then(function (oDialog) {
                        oDialog.close();
                    });
                    this.table_SelectCostCenter.removeSelections();
                    let oModel = this.getView().getModel("selectionMdl").getData();
                    oModel.costCenter = [];
                    this.getView().getModel("selectionMdl").refresh(true);
                },
                selectedCostCenter: function (oEvent) {
                    let that = this;
                    let oModel = this.getView().getModel("advancedSearchMdl").getData(),
                        selItems,
                        selCostCenter;
                    this.selCostCenter = this.getView().byId("table_SelectCostCenter");
                    selItems = this.selCostCenter.getSelectedItems();
                    if (selItems.length == 1) {
                        selCostCenter = this.selCostCenter.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
                        oModel.cost_centre_id = selCostCenter?.CostCenter;
                        oModel.cost_centre_id_and_text = selCostCenter?.CostCenter + " - " + selCostCenter?.CostCenterName;
                        this.getView().getModel("advancedSearchMdl").refresh(true);
                        this.valueHelpCostCenterClose();
                    } else {
                        MessageToast.show("Please select atleast one row!");
                    }
                },
                advancedFilterCostCenter: function () {
                    let filterArr = [];
                    let mdl = this.getView().getModel("advancedFilterMdl");
                    let data = mdl.getData();
                    this.table_SelectCostCenter.removeSelections();
                    for (let [key, value] of Object.entries(data)) {
                        if (value != "") {
                            value = value.trim();
                            filterArr.push(new sap.ui.model.Filter("CostCenter", sap.ui.model.FilterOperator.EQ, value));
                            filterArr.push(new sap.ui.model.Filter("CostCenterName", sap.ui.model.FilterOperator.Contains, value));
                            filterArr.push(new sap.ui.model.Filter("ValidityStartDate", sap.ui.model.FilterOperator.EQ, value));
                            filterArr.push(new sap.ui.model.Filter("ValidityEndDate", sap.ui.model.FilterOperator.EQ, value));
                        }
                    }
                    let binding = this.table_SelectCostCenter.getBinding("items");
                    // binding.filter(filters);
                    if (filterArr.length > 0)
                        binding.filter(new sap.ui.model.Filter({ filters: filterArr, and: false }));
                    else
                        binding.filter([]);
                },
                clearAllCostCenterFilters: function (oEvent) {
                    this.getView().setModel(new JSONModel(), "advancedFilterMdl");
                    this.getView().getModel("advancedFilterMdl").refresh(true);
                    this.table_SelectCostCenter.removeSelections();
                    let binding = this.table_SelectCostCenter.getBinding("items");
                    binding.filter([]);
                },
                //********** Cost Center Fragment End ******************/
                //********** Activity Type Fragment Start *******************/
                valueHelpDialogActivityType: function (oEvent) {
                    let that = this;
                    let oView = this.getView();
                    if (!this.activityTypeDialog) {
                        this.activityTypeDialog = new Promise(
                            function (resolve, reject) {
                                Fragment.load({
                                    id: oView.getId(),
                                    name: "com.ecui.create_equipment_demand.SelectActivityType", // Fragment name with namespace
                                    controller: this, // Main view's controller context
                                })
                                    .then(
                                        function (oDialog) {
                                            resolve(oDialog);
                                        }.bind(this)
                                    )
                                    .catch(function (oError) {
                                        reject(oError);
                                    });
                            }.bind(this)
                        );
                    }
                    this.activityTypeDialog.then(function (oDialog) {
                        oView.addDependent(oDialog);
                        // let selectedIn = oEvent?.getSource()?.sId.split("-")?.pop();
                        // that.selectedIndex = selectedIn ? Number(selectedIn) : null;
                        oDialog.open();
                        that.table_SelectActivityType = oView.byId("table_SelectActivityType");
                        that.table_SelectActivityType.removeSelections();
                        that.fetchActivityType();
                    });
                },


                onDialogCompanyClose: function (oEvent) {
                    let oSelectedItem = oEvent.getParameter("selectedItem"),
                        oInput = this.byId("inputCompany");

                    if (!oSelectedItem) {
                        oInput.resetProperty("value");
                        return;
                    }

                    oInput.setValue(oSelectedItem.getTitle());
                },

                valueHelpActivityTypeClose: function (oEvent) {
                    this.activityTypeDialog.then(function (oDialog) {
                        oDialog.close();
                    });
                    this.table_SelectActivityType.removeSelections();
                    let oModel = this.getView().getModel("selectionMdl").getData();
                    oModel.activityType = [];
                    this.getView().getModel("selectionMdl").refresh(true);
                },
                async onValueHelpRequestProject(oEvent) {


                    // create dialog lazily
                    this.oProjectDialog ??= await this.loadFragment({
                        name: "com.ecui.projects.fragments.ProjectsDialog",
                    });

                    this.oProjectDialog.open();
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
                onProjectSearch(oEvent) {
                    this.fetchProjectSearch(oEvent);
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
                            projectDescription: sQuery
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
                    // let masterModel = this.getView().getModel("masterMdl");

                    // // Restore original data when dialog is closed
                    // if (this._originalProjectData) {
                    //     masterModel.setProperty("/projects", this._originalProjectData);
                    // }

                    this.oProjectDialog.close();
                },

                selectedActivityType: function (oEvent) {
                    let that = this;
                    let oModel = this.getView().getModel("advancedSearchMdl").getData(),
                        selItems,
                        selActivityType;
                    this.selActivityType = this.getView().byId("table_SelectActivityType");
                    selItems = this.selActivityType.getSelectedItems();
                    if (selItems.length == 1) {
                        selActivityType = this.selActivityType.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
                        oModel.activity_id = selActivityType?.CostCtrActivityType;
                        oModel.activity_type_id_and_text = selActivityType?.CostCtrActivityType + " - " + selActivityType?.CostCtrActivityTypeName;
                        this.getView().getModel("advancedSearchMdl").refresh(true);
                        this.valueHelpActivityTypeClose();
                    } else {
                        MessageToast.show("Please select atleast one row!");
                    }
                },
                advancedFilterActivityType: function () {
                    let filterArr = [];
                    let mdl = this.getView().getModel("advancedFilterMdl");
                    let data = mdl.getData();
                    this.table_SelectActivityType.removeSelections();
                    for (let [key, value] of Object.entries(data)) {
                        if (value != "") {
                            value = value.trim();
                            filterArr.push(new sap.ui.model.Filter("CostCtrActivityType", sap.ui.model.FilterOperator.EQ, value));
                            filterArr.push(new sap.ui.model.Filter("CostCtrActivityTypeName", sap.ui.model.FilterOperator.Contains, value));
                            filterArr.push(new sap.ui.model.Filter("ValidityStartDate", sap.ui.model.FilterOperator.EQ, value));
                            filterArr.push(new sap.ui.model.Filter("ValidityEndDate", sap.ui.model.FilterOperator.EQ, value));
                        }
                    }
                    let binding = this.table_SelectActivityType.getBinding("items");
                    // binding.filter(filters);
                    if (filterArr.length > 0)
                        binding.filter(new sap.ui.model.Filter({ filters: filterArr, and: false }));
                    else
                        binding.filter([]);
                },
                clearAllActivityTypeFilters: function (oEvent) {
                    this.getView().setModel(new JSONModel(), "advancedFilterMdl");
                    this.getView().getModel("advancedFilterMdl").refresh(true);
                    this.table_SelectActivityType.removeSelections();
                    let binding = this.table_SelectActivityType.getBinding("items");
                    binding.filter([]);
                },

                onSearch: function (oEvent) {
                    let oModel = this.getView().getModel('advancedSearchMdl');
                    let oData = oModel.getData();

                    // Function to convert "dd-MM-yyyy" to "yyyy-MM-dd" (matching backend filtering format)
                    let convertDate = (dateStr) => {
                        if (!dateStr || dateStr.length !== 10) {
                            return null; // Ignore invalid dates
                        }
                        const [day, month, year] = dateStr.split("-");
                        return `${day}-${month}-${year}`; // Convert to "yyyy-MM-dd"
                    };

                    const aFilter = [];

                    for (let [key, value] of Object.entries(oData)) {
                        if (value) {
                            if (Array.isArray(value)) {
                                // Multi-value filters (if applicable)
                                const multiFilters = value.map(e => new Filter(key, FilterOperator.EQ, e));
                                aFilter.push(new Filter({ filters: multiFilters, and: false }));
                            } else {
                                // Convert date fields before filtering
                                if (key.includes("due_date") || key.includes("submitted_date")) {
                                    let formattedDate = convertDate(value);
                                    if (formattedDate) {
                                        aFilter.push(new Filter(key, FilterOperator.EQ, formattedDate)); // Exact match for dates
                                    }
                                } else {
                                    // General filter for non-date fields
                                    aFilter.push(new Filter(key, FilterOperator.Contains, value));
                                }
                            }
                        }
                    }

                    // Apply the filter to the table binding
                    this.byId("table_equipment_demand").getBinding("items").filter(aFilter, "Application");
                },
                clearSearchFilter: function () {
                    let advancedFilterObj = {
                        application_no: null,
                        company: null,
                        project: null,
                        due_date: null,
                        submitted_date: null,
                        project_name: null,
                        wbs_element: null,
                        status: null,


                    }
                    this.getView().setModel(new JSONModel(advancedFilterObj), "advancedSearchMdl");
                    this.getView().getModel("advancedSearchMdl").refresh(true);
                    this.onSearch();
                },

                _handleValueHelpSearch: function (evt) {
                    let sValue = evt.getParameter("value");
                    let oFilter = new Filter(
                        "Name",
                        FilterOperator.Contains, sValue
                    );
                    evt.getSource().getBinding("items").filter([oFilter]);
                },

                _handleValueHelpClose: function (evt) {
                    let oSelectedItem = evt.getParameter("selectedItem");
                    if (oSelectedItem) {
                        let productInput = this.byId(this.inputId);
                        productInput.setValue(oSelectedItem.getTitle());
                    }
                    evt.getSource().getBinding("items").filter([]);
                },

                onPressChangeStatus: async function (oEvent) {
                    try {
                        let that = this;
                        let selEquipmentDemands;
                        this.selEquipmentDemands = this.getView().byId("table_equipment_demand");
                        let equipmentDemandsMdl = this.getView().getModel("equipmentDemandsMdl").getData();
                        let selItems = this.selEquipmentDemands.getSelectedItems();
                        this.getModel("errors").setData([]);
                        if (selItems.length > 0) {
                            that.showLoading(true);
                            selEquipmentDemands = this.selEquipmentDemands.getSelectedItems()?.map((e) => e.getBindingContext("equipmentDemandsMdl")?.getObject()?.id);
                            if (selEquipmentDemands && Array.isArray(selEquipmentDemands) && selEquipmentDemands.length > 0) {
                                let status;
                                if (oEvent?.getSource()?.getText() == "Release") {
                                    status = 2;
                                }
                                else if (oEvent?.getSource()?.getText() == "Close") {
                                    status = 3;
                                }
                                if (status) {
                                    let path = AppConstants.URL.demands_update_status.replace("{status}", status);
                                    let response = await this.restMethodPost(path, selEquipmentDemands);
                                    equipmentDemandsMdl?.utilization?.forEach(ele => {
                                        let eq = selEquipmentDemands.filter(e => e == ele.id);
                                        if (eq && Array.isArray(eq) && eq.length == 1) {
                                            ele.demand_status = status;
                                        }
                                    })
                                    this.getView().getModel("equipmentDemandsMdl").refresh();
                                }
                            }
                        } else {
                            MessageToast.show("Please select atleast one row!");
                        }
                        that.showLoading(false);
                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }

                },

                async handleValueHelp(oEvent) {
                    let oButton = oEvent.getSource(),
                        oView = this.getView();

                    // create dialog lazily
                    this.oProjectDialog ??= await this.loadFragment({
                        name: "com.ecui.payment_certifcate.Company"
                    });

                    this.oProjectDialog.open();
                    // this.fetchMaster();

                },
                _handleValueHelpClose: function (oEvent) {
                    let oSelectedItem = oEvent.getParameter("selectedItem"),
                        oInput = this.byId("inputProject");

                    if (!oSelectedItem) {
                        oInput.resetProperty("value");
                        return;
                    }

                    oInput.setValue(oSelectedItem.getTitle());
                    // this.fetchMaster();
                },


                handleValueHelp: function (oEvent) {
                    let oView = this.getView();
                    this.inputId = oEvent.getSource().getId();

                    // create value help dialog
                    if (!this._cValueHelpDialog) {
                        this._cValueHelpDialog = Fragment.load({
                            id: oView.getId(),
                            name: "com.ecui.payment_certifcate.Company",
                            controller: this
                        }).then(function (oValueHelpDialog) {
                            oView.addDependent(oValueHelpDialog);
                            return oValueHelpDialog;
                        });
                    }

                    this._cValueHelpDialog.then(function (oValueHelpDialog) {
                        // open value help dialog
                        oValueHelpDialog.open();
                    });
                },
                onDialogClose: function () {
                    if (this.oCompanyDialog) {
                        this.oCompanyDialog.close();
                    }

                    // Ensure project data is refreshed on cancel
                    // this.fetchMaster();
                },

                //--- Project Fragment------//

                handleValueHelpProject: function (oEvent) {
                    let oView = this.getView();
                    this.inputId = oEvent.getSource().getId();

                    // create value help dialog
                    if (!this._pValueHelpDialog) {
                        this._pValueHelpDialog = Fragment.load({
                            id: oView.getId(),
                            name: "com.ecui.payment_certifcate.Project",
                            controller: this
                        }).then(function (pValueHelpDialog) {
                            oView.addDependent(pValueHelpDialog);
                            return pValueHelpDialog;
                        });
                    }

                    this._pValueHelpDialog.then(function (pValueHelpDialog) {
                        // open value help dialog
                        pValueHelpDialog.open();
                    });
                },


                // Function to open the Payment Certificate in a new window

                onCertificatePress: function () {
                    // Create HTML content for the certificate
                    let paymentCertificateHTML = `
                        <div class="container" style="max-width: 700px; margin: 0 auto; border: 1px solid black; padding: 20px; font-family: Arial, sans-serif; background-color: white;">
   
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <img src="./images/logo.png" alt="Company Logo" style="width: 100px; height: auto;">
            <div style="text-align: center; flex-grow: 1;">
                <h2 style="margin: 0;">Inflexion Infotech Consultancy LLC</h2>
                <h3 style="margin: 0;">Operations Department</h3>
                <h2 style="text-decoration: underline;">PAYMENT CERTIFICATE</h2>
            </div>
        </div>
 
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid black;">
            <tr>
                <td style="border: 1px solid black; padding: 5px;"><strong>Project No.:</strong> 00000124</td>
                <td style="border: 1px solid black; padding: 5px;"><strong>Payment Cert. No.:</strong> 450000378</td>
                <td style="border: 1px solid black; padding: 5px;"><strong>Dated:</strong> 30-Jan-25</td>
                <td style="border: 1px solid black; padding: 5px;"><strong>Currency:</strong> AED</td>
            </tr>
        </table>
 
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <td style="padding: 5px;"><strong>Project Title:</strong> <u>EC Tower 1  Engineering Construction (EC)</u></td>
            </tr>
            <tr>
                <td style="padding: 5px;"><strong>Consultant:</strong> <u>Inflexion Infotech Consultancy LLC</u></td>
            </tr>
            <tr>
                <td style="padding: 5px;"><strong>Project Duration:</strong> <strong>From Date:</strong> <u>01-Jan-25</u> <strong>Upto Date:</strong> <u>12-Jan-25</u></td>
            </tr>
        </table>
 
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <td style="padding: 5px;"><strong>Contract Ref. No.:</strong> __________</td>
                <td style="padding: 5px;"><strong>Contractor Name:</strong> <u>Mr Satish Anand</u></td>
            </tr>
            <tr>
                <td style="padding: 5px;"><strong>Contract Title:</strong> <u>Site</u></td>
                <td style="padding: 5px;"><strong>Sub-Contractor Bill No.:</strong> <u>1</u></td>
            </tr>
            <tr>
                <td style="padding: 5px;"><strong>Sub-Contractor Bill Date:</strong> <u>30-Jan-25</u></td>
                <td style="padding: 5px;"><strong>For Progress Dur.:</strong> <strong>From:</strong> <u>01-Jan-25</u> <strong>Upto:</strong> <u>15-Jan-25</u></td>
            </tr>
        </table>
 
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid black;">
            <tr><td style="padding: 5px; border: 1px solid black;">1. Original Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">2. letiation in Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">3. Revised Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">4. letiations Orders Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">5. Revised Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">6. Advance Payment ( ___% of Contract Value)</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">7. Work Done Todate (of Contract Value)</td><td style="padding: 5px; border: 1px solid black;">AED 117,210</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">8. Work Done Todate (of letiations Value)</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;"><strong>A. Sub-Total of Work Done (of Revised Contract Value)</strong></td><td style="padding: 5px; border: 1px solid black;"><strong>AED 117,210</strong></td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">9. Retention on Work Done</td><td style="padding: 5px; border: 1px solid black;">AED 11,721</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">10. Advance Payment Recovery</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">11. Other Deductions</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr><td style="padding: 5px; border: 1px solid black;">12. Total Previous Payment</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
            <tr style="background-color: black; color: white;">
                <td style="padding: 5px; border: 1px solid black;"><strong>13. Total Due this Payment</strong></td>
                <td style="padding: 5px; border: 1px solid black;"><strong>AED 105,489</strong></td>
            </tr>
        </table>
 
        <p><strong>Amount in Words AED:</strong> <i>One Hundred Five Thousand Four Hundred Eighty Nine Only</i></p>
 
        <table style="width: 100%; margin-top: 20px; text-align: center;">
            <tr>
                <td>_________________<br>Project Manager</td>
                <td>_________________<br>Operations Manager</td>
                <td>_________________<br>General Manager</td>
            </tr>
        </table>
   
</div>
                    `;

                    // Create a new Dialog
                    if (!this._paymentDialog) {
                        this._paymentDialog = new sap.m.Dialog({
                            title: "Payment Certificate",
                            contentWidth: "850px",
                            contentHeight: "600px",
                            content: [
                                new sap.ui.core.HTML({
                                    content: `<div>${paymentCertificateHTML}</div>`
                                })
                            ],
                            buttons: [
                                new sap.m.Button({
                                    text: "Print",
                                    icon: "sap-icon://print",
                                    press: function () {
                                        let printWindow = window.open("", "_blank");
                                        printWindow.document.write("<html><head><title>Print Certificate</title></head><body>");
                                        printWindow.document.write(paymentCertificateHTML);
                                        printWindow.document.write("</body></html>");
                                        printWindow.document.close();
                                        setTimeout(() => {
                                            printWindow.print();
                                        }, 500);
                                    }
                                }),
                                new sap.m.Button({
                                    text: "Close",
                                    press: function () {
                                        this._paymentDialog.close();
                                    }.bind(this)
                                })
                            ]
                        });
                    } else {
                        this._paymentDialog.getContent()[0].setContent(paymentCertificateHTML);
                    }

                    // Open the Dialog
                    this._paymentDialog.open();
                },



                //---End Project Fragment----//

                //-----Start Invoice Fragment---//
                handleValueHelpInvoice: function (oEvent) {
                    let oView = this.getView();
                    this.inputId = oEvent.getSource().getId();

                    // create value help dialog
                    if (!this._iValueHelpDialog) {
                        this._iValueHelpDialog = Fragment.load({
                            id: oView.getId(),
                            name: "com.ecui.payment_certifcate.Invoice",
                            controller: this
                        }).then(function (iValueHelpDialog) {
                            oView.addDependent(iValueHelpDialog);
                            return iValueHelpDialog;
                        });
                    }

                    this._iValueHelpDialog.then(function (iValueHelpDialog) {
                        // open value help dialog
                        iValueHelpDialog.open();
                    });
                },

                //---End Invoice Fragment----//

            }
        );
    }
);
