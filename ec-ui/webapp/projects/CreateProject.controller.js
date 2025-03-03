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
        MessageToast, Filter, FilterOperator
    ) {
        "use strict";
        return BaseController.extend("com.ecui.projects.CreateProject", {
            formatter: Formatter,
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oModel = this.oOwnerComponent.getModel();
                this.oRouter.getRoute("manage-projects").attachMatched(this._onRouteMatched, this);
                this.oRouter.getRoute("create-project").attachMatched(this._onRouteCreateMatched, this);


                let oModel = new JSONModel(
                    [
                        {
                            "projects": "Construction  Plan C.00.001",
                            "customer": "Project With Revenue",
                            "project_manager": "Bhupesh Akkineni",
                            "processing_status": "1",
                            "planned_start": "11-02-2024",
                            "planned_finish": "10-02-2025",
                            "project_currency": 1

                        }

                    ]);

                this.getView().setModel(oModel, "projectsMdl");

            },
            _onRouteMatched: function (oEvent) {
                this._route = oEvent.getParameter("config").name;
                this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');

                this.errorPopoverParams();
            },
            _onRouteCreateMatched(oEvent) {
                this._route = oEvent.getParameter("config").name;
                this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');

                this.errorPopoverParams();
            },
            statusFormatter(value) {
                let data = [{ key: "1", text: "Released" },
                { key: "2", text: "Created" }
                ]

                return data.find(e => e.key == value)?.text;
            },
            currencyFormatter(value) {
                let data = [{ key: "1", text: " United Arab Emirates Dirham(AED)" },
                { key: "2", text: "Indian Rupees (Rs)" }
                ]

                return data.find(e => e.key == value)?.text;
            },

            errorPopoverParams: function () {
                this.eMdl = this.getOwnerComponent().getModel("errors");
                ErrorMessage.removeValueState(null, this.eMdl);

                this.eMdl.setData([]);
                this.errorData = [];
            },

            onPressCancel: function () {
                this.oRouter.navTo("manage-projects", { layout: "OneColumn" });
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
                this.oRouter.navTo("create-project", { layout: sNextLayout });
            },

            handleExitFullScreen: function () {
                let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                this.oRouter.navTo("create-project", { layout: sNextLayout });
            },

            handleClose: function () {
                let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                this.oRouter.navTo("manage-projects", { layout: sNextLayout });
            },

            onExit: function () {
                this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
                this.oRouter.getRoute("create-project").detachPatternMatched(this._onRouteCreateMatched, this);
            }
        }
        );
    },

);