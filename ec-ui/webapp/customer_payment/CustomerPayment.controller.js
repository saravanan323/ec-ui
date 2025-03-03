sap.ui.define([
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/ecui/utils/AppConstants",
    "com/ecui/utils/Formatter",
    "sap/m/MessageBox",
    "com/ecui/utils/ErrorMessage",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/ui/core/IconPool",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/m/MessageStrip",
    'sap/ui/core/Fragment',
    "sap/m/p13n/Engine",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/p13n/FilterController",
    "sap/m/p13n/MetadataHelper",
    "sap/m/table/ColumnWidthController",
    "sap/ui/core/library",
    "sap/ui/model/Sorter",

], function (BaseController,
    JSONModel,
    AppConstants,
    Formatter,
    MessageBox,
    ErrorMessage, Filter, FilterOperator, Dialog, Button, library, List, StandardListItem, Text, IconPool, VBox, Input, MessageStrip, Fragment, Engine,
    SelectionController,
    SortController,
    GroupController,
    FilterController,
    MetadataHelper,
    ColumnWidthController,
    coreLibrary,
    Sorter,) {
    "use strict";

    return BaseController.extend("com.ecui.customer_payment.CustomerPayment", {

        formatter: Formatter,

        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("customer-payment").attachPatternMatched(this._onRouteMatched, this);
            this._tableId = this.byId("table_CustomerPayment");
            this.oFilterBar = this.byId("filter_system");
            this.getView().setModel(new JSONModel(), 'advancedFilterMdl');

            this.LocalDataFetch();
        },
        async _onRouteMatched(oEvent) {
            this.setMasterModel();	                //added this function 18:50
            // this.fetchMaster();

            let setDataModel = {
                status: [
                    { key: "1", text: "Approved" },
                    { key: "2", text: "In Approval" },
                    { key: "3", text: "Rejected" },
                    { key: "4", text: "In Revision" }

                ],


            };

            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            // this.onResetAdaptFilter(this.oFilterBar);
            this.setColulmnsIntoModel();
        },


        LocalDataFetch: function () {
            this.LocalFetchCustomerPayments();
            this.LocalFetchMaster();
            this.LocalFetchProjects();
            this.LocalFetchCustomers();
            this.LocalFetchCompany();
            this.LocalFetchWBSElements();
        },

        LocalFetchProjects: function () {

            let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/projects.json"));
            this.getView().setModel(response, "projectsMdl");

        },
        LocalFetchCustomers: function () {
            let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/customers.json"));
            this.getView().setModel(response, "customersMdl");

        },
        LocalFetchCustomerPayments: function () {

            let response = new JSONModel(sap.ui.require.toUrl("com/ecui/model/customerPayment.json"));

            this.getView().setModel(response, "customerPaymentMdl");

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

        LiveDataFetch: function () {

        },
        setColulmnsIntoModel: function () {
            let oSettingsModel = this.oOwnerComponent.getModel("settings");
            oSettingsModel.getData().columns = this.createColumnSystem();
            oSettingsModel.refresh(true);
        },
        statusFormatter(value) {
            let data = [
                { key: "1", text: "Approved" },
                { key: "2", text: "In Approval" },
                { key: "3", text: "Rejected" },
                { key: "4", text: "In Revision" }
            ]

            return data.find(e => e.key == value)?.text;
        },

        statusFormatterState: function (getValue) {
            let setValue = "None";
            switch (getValue) {
                case 1:
                    setValue = "Success";
                    break;
                case 2:
                    setValue = "Warning";

                    break;
                case 3:
                    setValue = "Error";
                    break;
                case 4:
                    setValue = "Information";
                    break;

                default:
                    setValue = "None";
                    break;


            }
            return setValue;

        },

        setMasterModel() {              //added to fetch the data 18:58
            let oData = {
                top: 100,
                skip: 0,
                project: null,
                projectDescription: null,
            };
            this.getView().setModel(new JSONModel(oData), "masterFilterMdl");
        },
        async fetchMaster() {
            try {
                this.showLoading(true);

                let oFilterMdl = this.getView().getModel("masterFilterMdl");
                let reqData = JSON.parse(JSON.stringify(oFilterMdl.getData()));

                let projectUrl = AppConstants.URL.project_all;
                // let wbsUrl = AppConstants.URL.wbs_all;
                let customerUrl = AppConstants.URL.customer;
                let wbsUrl = AppConstants.URL.wbs_all;
                let companyUrl = AppConstants.URL.company_all;

                // Fetch all data in parallel
                let [projectData, customerData, wbsData, companyData] = await Promise.all([
                    this.restMethodPost(projectUrl, reqData),
                    // this.restMethodPost(wbsUrl,reqData),
                    this.restMethodPost(customerUrl, reqData),
                    // this.restMethodGet(currencyUrl)
                    this.restMethodPost(wbsUrl, reqData),

                    this.restMethodGet(companyUrl),

                ]);

                // Combine all responses into a single object
                let masterData = {
                    projects: projectData || [],
                    // wbs: wbsData || [],
                    customers: customerData || [],
                    // currencies: currencyData || []
                    wbs: wbsData || [],

                    company: companyData || [],

                };

                // Set the combined model to the view
                this.getView().setModel(new JSONModel(masterData), "masterMdl");

                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        }
        ,


        handleResizablePopoverPress: function () {
            this.onOpenDialog("com.ecui.payment_applications.fragments.CreateApplication");

        },
        openUploadDialog: function () {
            this.onOpenDialog("com.ecui.payment_applications.fragments.CreateApplicationUpload");

        },

        handleDiscardPress: function () {
            //  this._pResizablePopover.close();
        },

        async onValueHelpRequestCompany(oEvent) {
            let oButton = oEvent.getSource(),
                oView = this.getView();
            // create dialog lazily
            this.oCompanyDialog ??= await this.loadFragment({
                name: "com.ecui.payment_applications.fragments.CompanyDialog"
            });

            this.oCompanyDialog.setTitle("Select Company");
            this.oCompanyDialog.open();
            // this.fetchMaster();
        },
        onDialogCompanyClose: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("id_Company");

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

                // Avoid unnecessary API calls if search is empty
                if (!sQuery) {
                    this.getView().getModel("masterMdl")?.setData({ projects: [] });
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

                // Get or create model
                let masterModel = this.getView().getModel("masterMdl");
                if (!masterModel) {
                    masterModel = new JSONModel();
                    this.getView().setModel(masterModel, "masterMdl");
                }

                masterModel.setData({ companyCode: companyData || [] });

            } catch (error) {
                console.error("Company Search Error:", error);
                this.errorHandling(error);
            } finally {
                this.showLoading(false);
            }
        },
        async onValueHelpRequestProject(oEvent) {
            let oButton = oEvent.getSource(),
                oView = this.getView();

            // create dialog lazily
            this.oProjectDialog ??= await this.loadFragment({
                name: "com.ecui.payment_applications.fragments.ProjectsDialogPayment",
            });

            this.oProjectDialog.open(); //justnow added
            // this.fetchMaster();
            this.LocalFetchMaster();
        },
        onDialogProjectClose: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem");

            // Get multiple input fields
            let oInput1 = this.byId("id_inputProject");
            let oInput2 = this.byId("inputProject");

            if (!oSelectedItem) {
                // Reset values if nothing is selected
                if (oInput1) oInput1.resetProperty("value");
                if (oInput2) oInput2.resetProperty("value");
                return;
            }

            // Set values for both inputs
            if (oInput1) oInput1.setValue(oSelectedItem.getTitle());
            if (oInput2) oInput2.setValue(oSelectedItem.getTitle());



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
            let masterModel = this.getView().getModel("masterMdl");

            // Restore original data when dialog is closed
            if (this._originalProjectData) {
                masterModel.setProperty("/projects", this._originalProjectData);
            }

            this.oProjectDialog.close();
        },


        async onValueHelpRequestCustomer(oEvent) {
            let oButton = oEvent.getSource(),
                oView = this.getView();

            // create dialog lazily
            this.oCustomerDialog ??= await this.loadFragment({
                name: "com.ecui.payment_applications.fragments.CustomersDialogPayment",
            });

            this.oCustomerDialog.open();
            //this.fetchMaster();
            this.LocalFetchMaster();
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
        onDialogClose: function () {
            if (this.oCustomerDialog) {
                this.oCustomerDialog.close();
            }

            // Ensure Customer data is refreshed on cancel
            //this.fetchMaster();
            this.LocalFetchMaster();
        },
        async onValueHelpRequestWBS(oEvent) {
            let oButton = oEvent.getSource(),
                oView = this.getView();

            // create dialog lazily
            this.oWBSDialog ??= await this.loadFragment({
                name: "com.ecui.projects.fragments.WBSElementDialog"
            });

            this.oWBSDialog.open();
            //   this.fetchMaster();
            this.LocalFetchMaster();

        },
        onDialogWBSClose: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("inputWBSElement");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            // Set the selected WBS value
            oInput.setValue(oSelectedItem.getTitle());



        },

        onWbsElementSearch(oEvent) {
            this.fetchWbsElementSearch(oEvent);
        },
        async fetchWbsElementSearch(oEvent) {
            try {
                this.showLoading(true);

                let sQuery = oEvent.getParameter("value")?.trim() || ""; // Trim whitespace

                // Avoid unnecessary API calls if search is empty
                if (!sQuery) {
                    this.getView().getModel("masterMdl")?.setData({ projects: [] });
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

                // Get or create model
                let masterModel = this.getView().getModel("masterMdl");
                if (!masterModel) {
                    masterModel = new JSONModel();
                    this.getView().setModel(masterModel, "masterMdl");
                }

                masterModel.setData({ wbs: wbsData || [] });

            } catch (error) {
                console.error("Project Search Error:", error);
                this.errorHandling(error);
            } finally {
                this.showLoading(false);
            }
        },
        onDialogClose: function () {
            if (this.oWbsElementDialog) {
                this.oWbsElementDialog.close();
            }

            // Ensure WbsElement data is refreshed on cancel
            // this.fetchMaster();
            this.LocalFetchMaster();
        },
        statusFormatterIcon: function (getValue) {
            let setValue = "";
            switch (getValue) {
                case 1:
                    setValue = "sap-icon://sys-enter-2";
                    break;
                case 2:
                    setValue = "sap-icon://alert";

                    break;
                case 3:
                    setValue = "sap-icon://error";
                    break;
                case 4:
                    setValue = "sap-icon://information";
                    break;

                default:
                    setValue = "";
                    break;


            }
            return setValue;

        },



        onListItemPress(oEvent) {
            let systemCtxt = oEvent.getSource().getSelectedItem().getBindingContext('customerPaymentMdl');
            let payment = systemCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            let oNextUIState;
            oSettingsModel.setProperty("/navigatedItem", payment.applicationNo);
            //this.oRouter.navTo("customer-payment-detail", { layout: "OneColumn", id: payment.applicationNo });

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(0);
                this.oRouter.navTo("customer-payment-detail", { layout: "MidColumnFullScreen", id: payment.applicationNo });
            }.bind(this));
        },

        // onPressMessage: function (oEvent) {
        //     let rowObj = oEvent?.oSource?.oPropagatedProperties?.oBindingContexts?.customerPaymentMdl?.getObject()|| '';
        //     this.onOpenDialog("com.ecui.payment_applications.Conversation");

        // 	// if (!this.oResponsivePaddingDialog) {
        // 	// 	this.oResponsivePaddingDialog = new Dialog({
        // 	// 		title: "Conversation  : "  + rowObj.applicationNo +" : "+ rowObj.projects,
        // 	// 		contentWidth: "760px",
        // 	// 		contentHeight: "450px",
        // 	// 		resizable: true,
        // 	// 		draggable: true,
        // 	// 		content: new ({

        // 	// 		}),
        // 	// 		beginButton: new Button({
        // 	// 			// type: ButtonType.Emphasized,
        // 	// 			text: "View More",
        // 	// 			press: function () {
        // 	// 				this.oResponsivePaddingDialog.close();
        // 	// 			}.bind(this)
        // 	// 		}),
        // 	// 		endButton: new Button({
        // 	// 			text: "Close",
        // 	// 			press: function () {
        // 	// 				this.oResponsivePaddingDialog.close();
        // 	// 			}.bind(this)
        // 	// 		})
        // 	// 	});

        // 	// 	// Enable responsive padding by adding the appropriate classes to the control
        // 	// 	this.oResponsivePaddingDialog.addStyleClass("sapUiResponsivePadding--content sapUiResponsivePadding--header sapUiResponsivePadding--footer sapUiResponsivePadding--subHeader");

        // 	// 	//to get access to the controller's model
        // 	// 	this.getView().addDependent(this.oResponsivePaddingDialog);
        // 	// }

        // 	// this.oResponsivePaddingDialog.open();

        //   },
        openChatHistoryDialog: function (oEvent) {
            // Chat history JSON data
            let aChatData = [
                {
                    "sender": "Sathis",
                    "message": "Hey Ziya, how’s the progress on our Construction project?",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "Hey Sathis! We’ve completed the initial design phase and are now finalizing the materials list.",
                    "type": "Success"
                },
                {
                    "sender": "Sathis",
                    "message": "Great! Have we considered sustainable materials for the build?",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "Yes, we’re looking into eco-friendly concrete and energy-efficient glass. Would you like a cost analysis on that?",
                    "type": "Success"
                },
                {
                    "sender": "Sathis",
                    "message": "That would be helpful. Can you also check if these materials are readily available?",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "Sure! I’ll coordinate with suppliers and update you by tomorrow.",
                    "type": "Success"
                },
                {
                    "sender": "Sathis",
                    "message": "Perfect. Also, what’s the status of the permits?",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "We submitted the applications last week. The approval process might take another two weeks.",
                    "type": "Success"
                },
                {
                    "sender": "Sathis",
                    "message": "Let’s follow up with the authorities in a few days to avoid delays.",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "Agreed. I’ll handle that and also share the updated project timeline with you later today.",
                    "type": "Success"
                },
                {
                    "sender": "Sathis",
                    "message": "Sounds good, Ziya. Let’s stay on track and ensure everything is aligned.",
                    "type": "Information"
                },
                {
                    "sender": "Ziya",
                    "message": "Absolutely! I’ll keep you posted.",
                    "type": "Success"
                }
            ];

            // Create a VBox to hold chat messages
            let oChatContainer = new sap.m.VBox().addStyleClass("sapUiTinyMargin");

            // Loop through JSON data and create message strips dynamically
            aChatData.forEach(function (oChat) {
                let oMessageStrip = new sap.m.MessageStrip({
                    text: oChat.sender + ": " + oChat.message,
                    type: oChat.type,
                    showCloseButton: false
                }).addStyleClass("sapUiTinyMarginTop");

                oChatContainer.addItem(oMessageStrip);
            });
            let rowObj = oEvent?.oSource?.oPropagatedProperties?.oBindingContexts?.customerPaymentMdl?.getObject() || '';

            // Create the Chat History Dialog
            let oDialog = new sap.m.Dialog({
                title: "Discussion on " + rowObj.applicationNo + " : " + rowObj.projects,
                contentWidth: "400px",
                contentHeight: "500px",
                verticalScrolling: true,
                resizable: false,
                content: [
                    oChatContainer
                ],

                footer: new sap.m.Toolbar({
                    content: [
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({
                            text: "Show More",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        new sap.m.Button({
                            text: "Close",
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ]
                })
            });

            oDialog.open();
        },
        onCreateApplication: function () {
            let oView = this.getView();
            let oModel = oView.getModel("advancedFilterMdl");

            // Get input fields
            let oCompany = oView.byId("id_Company");
            let oProject = oView.byId("inputProject");
            let oWBS = oView.byId("inputWBSElement");

            // Get values from input fields
            let sCompany = oCompany.getValue().trim();
            let sProject = oProject.getValue().trim();
            let sWBS = oWBS.getValue().trim();

            // Validate inputs
            if (!sCompany || !sProject || !sWBS) {
                sap.m.MessageToast.show("Please fill all the required fields.");
                return;
            }

            // Navigate to the next page
            this.getOwnerComponent().getRouter().navTo("create-customer-payment", { layout: "OneColumn" });

            // Refresh the model **after** navigation with a slight delay
            setTimeout(function () {
                if (oModel) {
                    oModel.setData({
                        companyCode: "",
                        projects: "",
                        wbs_element: ""
                    });
                    oModel.refresh(true); // Refresh the model
                }

            }, 500);
        },

        onCloseDialog: function () {
            let oModel = this.getView().getModel("advancedFilterMdl");

            // Reset data when closing the dialog
            oModel.setData({
                companyCode: "",
                projects: "",
                wbs_element: ""
            });

            this.byId("myPopover").close();
        },

        // formatter: {im
        //     iconFormatter: function (sIconKey) {
        //         let iconMap = {
        //             "discussion": "sap-icon://discussion",
        //             "milestone": "sap-icon://BusinessSuiteInAppSymbols/icon-milestone",
        //             // Add more mappings for images here
        //             "image1": "path/to/image1.jpg",
        //             "image2": "path/to/image2.jpg"
        //         };
        //         return iconMap[sIconKey] || "";  // Default to empty string if not found
        //     }
        // },
        onSearch: function (oEvent) {
            let oModel = this.getView().getModel('advancedFilterMdl');
            let oData = oModel.getData();

            console.log("Filter Data:", oData); // Debugging

            // Function to normalize PA values (remove spaces and ensure format consistency)
            let normalizePAValue = (value) => {
                if (!value) return null;
                return value.replace(/\s+/g, "").trim(); // Remove all spaces
            };

            // Function to convert "dd-MM-yyyy" to "yyyy-MM-dd" (matching backend filtering format)
            let convertDate = (dateStr) => {
                if (!dateStr || dateStr.length !== 10) {
                    return null; // Ignore invalid dates
                }
                const [day, month, year] = dateStr.split("-");
                return `${day}-${month}-${year}`;
            };

            const aFilter = [];

            for (let [key, value] of Object.entries(oData)) {
                if (value) {
                    if (Array.isArray(value)) {
                        // Multi-value filters (if applicable)
                        const multiFilters = value.map(e => new Filter(key, FilterOperator.EQ, e));
                        aFilter.push(new Filter({ filters: multiFilters, and: false }));
                    } else {
                        if (key.includes("due_Date") || key.includes("submitted_Date")) {
                            let formattedDate = convertDate(value);
                            if (formattedDate) {
                                aFilter.push(new Filter(key, FilterOperator.EQ, formattedDate));
                            }
                        }
                        // Normalize PA values to remove spaces before filtering
                        else if (key.includes("orginal_PA_Value") || key.includes("updated_PA_Value")) {
                            let normalizedValue = normalizePAValue(value);
                            if (normalizedValue) {
                                aFilter.push(new Filter(key, FilterOperator.EQ, normalizedValue));
                            }
                        } else {
                            aFilter.push(new Filter(key, FilterOperator.Contains, value));
                        }
                    }
                }
            }

            console.log("Applied Filters:", aFilter); // Debugging

            // Apply the filter to the table binding
            this.byId("table_CustomerPayment").getBinding("items").filter(aFilter, "Application");
        },

        onClear() {
            this.getView().setModel(new JSONModel(), 'advancedFilterMdl');
        },

        _registerForP13n: function () {
            const oTable = this._tableId;
            let oColumns = JSON.parse(JSON.stringify(this._columns())); // deep copy
            let oReMapCols = oColumns.map((e) => {
                return {
                    key: e.id,
                    label: e.label,
                    path: e.property,
                };
            });
            this.oMetadataHelper = new MetadataHelper(oReMapCols);

            Engine.getInstance().register(oTable, {
                helper: this.oMetadataHelper,
                controller: {
                    Columns: new SelectionController({
                        targetAggregation: "columns",
                        control: oTable,
                    }),
                    Sorter: new SortController({
                        control: oTable,
                    }),
                    Groups: new GroupController({
                        control: oTable,
                    }),
                    ColumnWidth: new ColumnWidthController({
                        control: oTable,
                    }),
                    Filter: new FilterController({
                        control: oTable,
                    }),
                },
            });

            Engine.getInstance().attachStateChange(
                this.handleStateChange.bind(this),
            );
        },
        _openPersoDialog: function (aPanels, oSource) {
            let oTable = this._tableId;

            Engine.getInstance().show(oTable, aPanels, {
                contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                source: oSource || oTable,
            });
        },
        _getKey: function (oControl) {
            return this.getView().getLocalId(oControl.getId());
        },

        handleStateChange: function (oEvt) {
            const oTable = this._tableId;
            const oState = oEvt.getParameter("state");

            if (!oState || !oState.Columns) {
                return;
            }

            // Update the columns based on selection
            this.updateColumns(oState);

            // Create Groups & Sorters
            const aGroups = this.createGroups(oState);
            const aSorter = this.createSorters(oState, aGroups);

            // Function to create cell templates
            const createCell = function (oColumnState, colPath) {
                switch (oColumnState.key) {
                    case "invoice_col":
                        return new sap.m.ObjectStatus({
                            text: "{= ${" + colPath + "} === 2 ? 'Approved' : 'Pending'}",
                            state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}",
                        });
                    default:
                        return new sap.m.Text({ text: "{" + colPath + "}" });
                }
            };

            // Create cell templates for each column
            const aCells = oState.Columns.map(
                function (oColumnState) {
                    const oProperty = this.oMetadataHelper.getProperty(
                        oColumnState.key,
                    );
                    if (!oProperty || !oProperty.path) {
                        console.warn("Invalid column key:", oColumnState.key);
                        return new sap.m.Text({ text: "" });
                    }

                    const colPath = "customerPaymentMdl>" + oProperty.path;
                    return createCell(oColumnState, colPath);
                }.bind(this),
            );

            // Rebind the table with the updated cell templates
            oTable.bindItems({
                templateShareable: false,
                path: "customerPaymentMdl>/",
                sorter: aSorter.concat(aGroups),
                template: new sap.m.ColumnListItem({
                    type: "Navigation",
                    cells: aCells,
                }),
            });
        },
        createColumnSystem: function () {
            return [
                {
                    label: 'Application No',
                    property: "applicationNo",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Orginal PA Amount',
                    property: "orginal_PA_Value",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Updated PA Amount',
                    property: "updated_PA_Value",
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
                    label: 'Project ',
                    property: "projects",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Customer ',
                    property: "customer",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Company ',
                    property: "company",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Due Date',
                    property: "due_Date",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Status',
                    property: "status",
                    width: "25",
                    visible: true
                },
                {
                    label: 'Manage',
                    property: "manage",
                    width: "25",
                    visible: true
                }

            ];
        },


        openPersoDialog: function (oEvt) {
            this._openPersoDialog(["Columns", "Sorter", "Groups"], oEvt.getSource());
        },

        _openPersoDialog: function (aPanels, oSource) {
            let _tableId = this.byId("table_CustomerPayment");

            Engine.getInstance().show(_tableId, aPanels, {
                contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                source: oSource || _tableId
            });
        },
        _getKey: function (oControl) {
            return this.getView().getLocalId(oControl.getId());
        },


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
    <tr><td style="padding: 5px; border: 1px solid black;">2. Variation in Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">3. Revised Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">4. Variations Orders Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">5. Revised Contract Value</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">6. Advance Payment ( ___% of Contract Value)</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">7. Work Done Todate (of Contract Value)</td><td style="padding: 5px; border: 1px solid black;">AED 117,210</td></tr>
    <tr><td style="padding: 5px; border: 1px solid black;">8. Work Done Todate (of Variations Value)</td><td style="padding: 5px; border: 1px solid black;">AED ______</td></tr>
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


        handleStateChange: function (oEvt) {
            const _tableId = this.byId("table_CustomerPayment");
            const oState = oEvt.getParameter("state");

            if (!oState || !oState.Columns) {
                return;
            }

            // Update the columns based on selection
            this.updateColumns(oState);

            // Create Groups & Sorters
            const aGroups = this.createGroups(oState);
            const aSorter = this.createSorters(oState, aGroups);

            // Function to create cell templates
            const createCell = function (oColumnState, colPath) {
                switch (oColumnState.key) {
                    case 'status_col':
                        return new sap.m.ObjectStatus({
                            text: "{= ${" + colPath + "} === 2 ? 'Approved' : 'Pending'}",
                            state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}"
                        });
                    default:
                        return new sap.m.Text({ text: "{" + colPath + "}" });
                }
            };

            // Create cell templates for each column
            const aCells = oState.Columns.map(function (oColumnState) {
                const oProperty = this.oMetadataHelper.getProperty(oColumnState.key);
                if (!oProperty || !oProperty.path) {
                    console.warn("Invalid column key:", oColumnState.key);
                    return new sap.m.Text({ text: "" });
                }

                const colPath = 'customerPaymentMdl>' + oProperty.path;
                return createCell(oColumnState, colPath);
            }.bind(this));

            // Rebind the table with the updated cell templates
            _tableId.bindItems({
                templateShareable: false,
                path: 'customerPaymentMdl>/',
                sorter: aSorter.concat(aGroups),
                template: new sap.m.ColumnListItem({
                    type: "Navigation",
                    cells: aCells
                })
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

            oState.Sorter.forEach(function (oSorter) {
                const oCol = this.byId(oSorter.key);
                if (oSorter.sorted !== false) {
                    oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
                }
            }.bind(this));

            return aSorter;
        },

        createGroups: function (oState) {
            const aGroupings = [];
            oState.Groups.forEach(function (oGroup) {
                aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
            }.bind(this));

            oState.Groups.forEach(function (oSorter) {
                const oCol = this.byId(oSorter.key);
                oCol.data("grouped", true);
            }.bind(this));

            return aGroupings;
        },

        updateColumns: function (oState) {
            const _tableId = this.byId("table_CustomerPayment");
            _tableId.getColumns().forEach(function (oColumn) {
                oColumn.setVisible(false);
                oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
                oColumn.setSortIndicator(coreLibrary.SortOrder.None);
                oColumn.data("grouped", false);

                // Set alignment if available
                const colMeta = this.oMetadataHelper.getProperty(this._getKey(oColumn));
                if (colMeta && colMeta.hAlign) {
                    oColumn.getHeader().setHAlign(colMeta.hAlign);
                }
            }.bind(this));

            oState.Columns.forEach(function (oProp, iIndex) {
                const oCol = this.byId(oProp.key);
                oCol.setVisible(true);
                _tableId.removeColumn(oCol);
                _tableId.insertColumn(oCol, iIndex);
            }.bind(this));
        },


        beforeOpenColumnMenu: function (oEvt) {
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
            const oTable = this._tableId;
            const sAffectedProperty = oSortItem.getKey();
            const sSortOrder = oSortItem.getSortOrder();

            //Apply the state programatically on sorting through the column menu
            //1) Retrieve the current personalization state
            Engine.getInstance()
                .retrieveState(oTable)
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

                    //3) Apply the modified personalization state to persist it in the letiantManagement
                    Engine.getInstance().applyState(oTable, oState);
                });
        },

        onGroup: function (oEvt) {
            const oGroupItem = oEvt.getParameter("item");
            const oTable = this._tableId;
            const sAffectedProperty = oGroupItem.getKey();

            //1) Retrieve the current personalization state
            Engine.getInstance()
                .retrieveState(oTable)
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

                    //3) Apply the modified personalization state to persist it in the letiantManagement
                    Engine.getInstance().applyState(oTable, oState);
                });
        },



    });
});
