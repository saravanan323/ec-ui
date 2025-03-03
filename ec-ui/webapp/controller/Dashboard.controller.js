sap.ui.define(
  [
    "com/ecui/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "sap/f/library",
    "com/ecui/utils/AppConstants",
  ],
  function (
    BaseController,
    JSONModel,
    DateFormat,
    MessageToast,
    library,
    Core,
    fioriLibrary, AppConstants
  ) {
    "use strict";
    var that = this;
    return BaseController.extend("com.ecui.controller.Dashboard", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("dashboard").attachMatched(this._onRouteMatched, this);

        this.oModel = this.getOwnerComponent().getModel();
        this.dashboardData();
      },
      getDemandsCount: async function () {
        try {
          this.getView().setModel(new JSONModel({}), "demandCountMdl")
          let selectionMdl = this.getView().getModel("demandCountMdl").getData();
          //this.table_SelectActivityType.setBusy(true);
          let demands_path = AppConstants.URL.demands_count;
          let response = await this.restMethodGet(demands_path);
          //let data = response?.d?.results;
          this.getView().getModel("demandCountMdl").setData(response);
          // this.table_SelectActivityType.setBusy(false);
          this.getView().getModel("demandCountMdl").refresh(true);
        } catch (error) {
          //this.table_SelectActivityType.setBusy(false);
          this.errorHandling(ex);
        }
      },
      _onRouteMatched: function () {
        this.userSettingsData();
        this._registerIds();
        this.setTitle("Home");
      },
      /* onPressTile: function (oEvent) {
        var route = oEvent
          .getSource()
          .getCustomData()
          .find((e) => e.getProperty("key") == "route")
          .getValue();
        var key = oEvent
          .getSource()
          .getCustomData()
          .find((e) => e.getProperty("key") == "key")
          .getValue();
        this.getRouter().navTo(route);
        if (key) {
          this.sideNavigation(key);
        }
      }, */
      _registerIds: function () {
        this.navContainer = this.byId("pageContainer");
        this.appGridList = this.byId("appGridList");

        let iconTabMdl = this.getView().getModel("iconTabNavigation");
        if (iconTabMdl && iconTabMdl?.getData()?.selectedKey) {
          let oKey = iconTabMdl?.getData()?.selectedKey;
          this.navContainer.to(this.getView().createId(oKey));
        } else {
          this.iconTabNavigation();
          this.navContainer.to(this.getView().createId("my_home"));
        }

        this.appCardBackgroundColorReg();
      },
      appCardBackgroundColorReg: function () {
        let items = this.appGridList.getItems();
        if (items.length > 0) {
          for (let i = 0; 6 >= i; i++) {
            if (items[i]) {
              items[i]
                .getContent()[0]
                .addStyleClass("appCardBackground_" + (parseInt(i) + 1));
            }
          }
        }
      },
      onAfterRendering: function (oEvent) {
        let appGridlist = this.appGridList;
      },
      onAppItemPress: function (oEvent) {
        let iconTabMdl = this.getView().getModel("iconTabNavigation");
        let selObj = oEvent
          .getSource()
          .getBindingContext("dashboardData")
          ?.getObject();
        let oKey = selObj?.key;
        let oTitle = selObj?.title;
        iconTabMdl.getData().selectedKey = oKey;
        this.navContainer.to(this.getView().createId(oKey));
        this.genericTitle(oTitle);
        iconTabMdl.refresh(true);
      },
      onTabSelect: function (oEvent) {
        //Icon Tab Bar Navigation
        let oItem = oEvent.getParameter("item");
        this.navContainer.to(this.getView().createId(oItem.getKey()));
        this.genericTitle(oItem.getText());
      },
      onPressTile: function (oEvent) {
        let oNavContext = oEvent.getSource().getBindingContext("dashboardData");
        let oNavObj = oNavContext?.getObject();
        //let getPath = oNavContext?.getPath();
        let oNavKey = oNavObj?.route;
        if (oNavKey) {
          let createLayout = oNavKey.includes('create') ? 'MidColumnFullScreen' : 'TwoColumnsMidExpanded';
          this.getRouter().navTo(oNavKey, {
            layout: createLayout
          });
          this.genericTitle(oNavObj.title);
        }
        this.oModel.refresh(true);
      },
      //Dashboard Icon Navigatin Model
      iconTabNavigation: function () {
        let data = {
          selectedKey: "my_home",
          navigation: [
            {
              title: "My Home",
              key: "my_home",
            },
            {
              title: "Equipments",
              key: "equipments",
            },
            {
              title: "PayFlow",
              key: "ecPayflow",
            },
            {
              title: " Project Utilites",
              key: "ecTools",
            },
          ],
        };
        this.getView().setModel(new JSONModel(data), "iconTabNavigation");
      },
      ///Side Naviagtion model
      sideNavigation: function (key) {
        var oData = {
          navigation: [
            {
              title: "Root Menu",
              icon: "sap-icon://person-placeholder",
              key: "1",
              visible: true,
              items: [
                {
                  title: "Parent 1",
                  icon: "sap-icon://product",
                  key: "mockScreenMaster",
                  class: "bussinessIcon",
                  items: [
                    {
                      title: "Child 1",
                      key: "",
                    },
                  ],
                },
                {
                  title: "Parent 2",
                  icon: "sap-icon://product",
                  key: "manageImports",
                  items: [
                    {
                      title: "Child 1",
                      key: "",
                    },
                  ],
                },
              ],
            },
          ],
        };
        let filter = oData.navigation.find((e) => e.key == key)?.items;
        oData.navigation = filter;
        oData.selectedSectionKey = key;
        var oModel = this.getOwnerComponent().getModel("sideNavigation");
        let merge = {
          ...oModel.getData(),
          ...oData,
        };
        this.getOwnerComponent().setModel(
          new JSONModel(merge),
          "sideNavigation"
        );
        oModel.refresh();
      },
      dashboardData: async function () {
        // await this.getDemandsCount();
        //  let countData = this.getView().getModel("demandCountMdl").getData();
        let data = {
          /* toDos: [
              {
                  title: "Lease Contract Approval: F-101",
                  ref: "30000000000003564856",
                  created_by: "John Doe",
                  created_on: "Property: Shoba Apartments",
                  status: "Error",
                  priority: "High Priority",
              },
              {
                  title: "Swimming Pool - Regular Maintenance",
                  ref: "30000000000003564856",
                  created_by: "All",
                  created_on: "Property: Shoba Apartments",
                  status: "Success",
                  priority: "Low Priority",
              },
              {
                  title: "Contract Renewal Request: F-122",
                  ref: "30000000000003564856",
                  created_by: "John Doe",
                  created_on: "Property: Shoba Apartments",
                  status: "Warning",
                  priority: "Medium Priority",
              },
          ], */
          applications: [
            {
              title: "Equipments",
              sub_title: "",
              icon: "sap-icon://BusinessSuiteInAppSymbols/icon-equipment",
              key: "equipments",
            },
            {
              title: "PayFlow",
              sub_title: "",
              icon: "sap-icon://monitor-payments",
              key: "ecPayflow",
            },
            {
              title: "Project Utilites",
              sub_title: "",
              icon: "sap-icon://BusinessSuiteInAppSymbols/icon-table-chart-customization",
              key: "ecTools",
            },
          ],
          activities: {
            favourite: [
              {
                title: "Create Equipment Demand",
                icon: "sap-icon://add-equipment",
                key: "create_equipment_demand",
                route: "create-equipment-demand",
              },
              {
                title: "Confirm Equipment Utilization",
                icon: "sap-icon://SAP-icons-TNT/verify-api",
                key: "confirm_equipment_utilization",
                route: "confirm-equipment-utilization",
              },
            ],
          },
          equipments: [
            {
              title: "Equipment Demands",
              sub_title: "",
              icon: "sap-icon://BusinessSuiteInAppSymbols/icon-demand-unit",
              key: "equipment_demands",
              number: 0,// countData.OPEN + countData.RELEASE + countData.CLOSE,
              footer: "",
              route: "equipment-demands",
            },
            {
              title: "Create Equipment Demand",
              sub_title: "",
              icon: "sap-icon://add-equipment",
              key: "create_equipment_demand",
              //number: 16,
              footer: "",
              route: "create-equipment-demand",
            },
            {
              title: "Confirm Equipment Utilization",
              sub_title: "",
              icon: "sap-icon://BusinessSuiteInAppSymbols/icon-utilization",
              key: "confirm_equipment_utilization",
              number: 0,// countData.RELEASE,
              footer: "",
              route: "confirm-equipment-utilization",
            },
          ],
          ecPayflow: [
            {
              title: "Projects",
              sub_title: "Contract Mapping",
              icon: "sap-icon://capital-projects",
              key: "projects",
              number: 3,// countData.OPEN + countData.RELEASE + countData.CLOSE,
              footer: "",
              route: "manage-projects",
            },
            {
              title: "Procurment Payment",
              sub_title: "Application",
              icon: "sap-icon://collections-insight",
              key: "manage_payment_applications",
              number: 4,
              footer: "",
              route: "payment-applications",
            },
            {
              title: "Customer Payment",
              sub_title: "Application",
              icon: "sap-icon://collections-insight",
              key: "manage_customer_payment",
              number: 4,
              footer: "",
              route: "customer-payment",
            },
            {
              title: "Payment Certificates",
              sub_title: "",
              icon: "sap-icon://batch-payments",
              key: "manage_payment_certificates",
              number: 1,// countData.RELEASE,
              footer: "",
              route: "manage-payment-certifcate",
            },
          ],
          ecTools: [
            {
              title: "BOQ",
              sub_title: "Bill of Quantities",
              icon: "sap-icon://upload",
              key: "boq_upload",
              number: 4,// countData.OPEN + countData.RELEASE + countData.CLOSE,
              footer: "Bulk Upload",
              route: "manage-boq",
            },

          ],
        };
        this.getView().setModel(new JSONModel(data), "dashboardData");
      },
      ///Side Naviagtion model
      sideNavigation: function (key) {
        var oData = {
          navigation: [
            {
              title: "Liner Agent",
              icon: "sap-icon://person-placeholder",
              key: "1",
              visible: true,
              items: [
                {
                  title: "Voyages",
                  icon: "sap-icon://BusinessSuiteInAppSymbols/icon-vessel",
                  key: "voyagesMaster",
                  class: "bussinessIcon",
                  items: [
                    {
                      title: "Manage Voyages",
                      key: "voyagesMaster",
                    },
                    {
                      title: "New Voyage",
                      key: "voyagesDetailCreate/{layout}",
                    },
                    {
                      title: "Upload Manifest",
                      key: "uploadManifest",
                    },
                  ],
                },
                {
                  title: "Imports",
                  icon: "sap-icon://BusinessSuiteInAppSymbols/icon-target",
                  key: "manageImports",
                  items: [
                    {
                      title: "Manage Imports",
                      key: "manageImports",
                    },
                    {
                      title: "New Import Request",
                      key: "importsDetailCreate/{layout}",
                    },
                  ],
                },
                {
                  title: "Exports",
                  icon: "sap-icon://BusinessSuiteInAppSymbols/icon-source",
                  key: "",
                  items: [
                    {
                      title: "Manage Exports",
                      key: "manageExports",
                    },
                    {
                      title: "New Export Request",
                      key: "exportsDetailCreate/{layout}",
                    },
                  ],
                },
                {
                  title: "Trans-shipment",
                  icon: "sap-icon://BusinessSuiteInAppSymbols/icon-data-access",
                  key: "",
                  items: [
                    {
                      title: "Manage Trans-shipment",
                      key: "",
                    },
                    {
                      title: "New Trans-shipment",
                      key: "",
                    },
                  ],
                },
                {
                  title: "Operations",
                  icon: "sap-icon://enablement",
                  key: "",
                  items: [
                    {
                      title: "Container Movement",
                      key: "",
                    },
                    {
                      title: "Empty Containers",
                      key: "",
                    },
                  ],
                },
                {
                  title: "Reports",
                  icon: "sap-icon://manager-insight",
                  key: "",
                  items: [
                    {
                      title: "Sailing Report",
                      key: "",
                    },
                    {
                      title: "Terminal Departure Report",
                      key: "",
                    },
                  ],
                },
              ],
            },
            {
              title: "Clearing & Forwarding",
              icon: "sap-icon://media-forward",
              visible: true,
              key: "2",
              items: [
                {
                  title: "Jobs",
                  icon: "sap-icon://request",
                  key: "",
                },
                {
                  title: "Payments",
                  icon: "sap-icon://money-bills",
                  key: "",
                },
                {
                  title: "Reports",
                  icon: "sap-icon://manager-insight",
                  key: "",
                },
              ],
            },
            {
              title: "Other Services",
              icon: "sap-icon://e-care",
              visible: true,
              key: "3",
              items: [
                {
                  title: "Husbandry Service",
                  icon: "sap-icon://technical-object",
                  key: "",
                },
                {
                  title: "Transportation",
                  icon: "sap-icon://shipping-status",
                  key: "",
                },
                {
                  title: "Reports",
                  icon: "sap-icon://manager-insight",
                  key: "",
                },
              ],
            },
            {
              title: "Finance",
              icon: "sap-icon://lead",
              visible: true,
              key: "4",
              items: [
                {
                  title: "Reports",
                  icon: "sap-icon://manager-insight",
                  key: "",
                },
              ],
            },
            {
              title: "App Config",
              icon: "sap-icon://key-user-settings",
              visible: true,
              key: "5",
              items: [
                {
                  title: "Application Config",
                  icon: "sap-icon://action-settings",
                  visible: true,
                  items: [
                    {
                      title: "Connections",
                      key: "",
                    },
                  ],
                },
                {
                  title: "Manage Users",
                  icon: "sap-icon://user-settings",
                  visible: true,
                  items: [
                    {
                      title: "Users",
                      key: "",
                    },
                    {
                      title: "Roles",
                      key: "",
                    },
                    {
                      title: "Permissions",
                      key: "",
                    },
                  ],
                },
                {
                  title: "Master Data",
                  icon: "sap-icon://course-program",
                  visible: true,
                  items: [
                    {
                      title: "Shipping Line",
                      key: "shippingLineMaster",
                      icon: "sap-icon://crossed-line-chart",
                    },
                    {
                      title: "Port Code",
                      key: "portCodeMaster",
                      icon: "sap-icon://key",
                    },
                    {
                      title: "Call Sign",
                      key: "callsignMaster",
                      icon: "sap-icon://call",
                    },
                    {
                      title: "IMO",
                      key: "IMOMaster",
                      icon: "sap-icon://building",
                    },
                    {
                      title: "Postal Code",
                      key: "postalCode",
                      icon: "sap-icon://letter",
                    },
                    /*  {
                                         "title": "Customer / Shipper",
                                         "key": "customerShipperMaster",
                                         "icon": "sap-icon://customer"
                                     }, */
                    {
                      title: "Business Party",
                      key: "BusinessParty",
                      icon: "sap-icon://customer",
                    },
                    /* {
                                        "title": "Voyage",
                                        "key": "voyageMaster",
                                        "icon": "sap-icon://flight"
                                    }, */
                    {
                      title: "Vessel",
                      key: "vesselMaster",
                      icon: "sap-icon://inventory",
                    },
                    {
                      title: "Container Type",
                      key: "containertype",
                      icon: "sap-icon://cargo-train",
                    },
                    {
                      title: "Cargo Type",
                      key: "cargoType",
                      icon: "sap-icon://cargo-train",
                    },
                    {
                      title: "HS Code",
                      key: "hsCode",
                      icon: "sap-icon://number-sign",
                    },
                    {
                      title: "Customs Package Code",
                      key: "customsPackageCode",
                      icon: "sap-icon://product",
                    },
                  ],
                },
              ],
            },
          ],
          /* "fixedNavigation": [
                    {
                        "title": "Validations",
                        "icon": "sap-icon://settings",
                        "expanded": false,
                        "key": "ValidationTest"
                    }
                ] */
        };
        let homeNav = {
          title: "Dashboard",
          icon: "sap-icon://bbyd-dashboard",
          visible: true,
          key: "dashboard",
          items: [],
        };
        let filter = oData.navigation.find((e) => e.key == key).items;
        //filter.unshift(homeNav)
        oData.navigation = filter;
        oData.selectedSectionKey = key;
        var oModel = this.getOwnerComponent().getModel("sideNavigation");
        let merge = { ...oModel.getData(), ...oData };
        this.getOwnerComponent().setModel(
          new JSONModel(merge),
          "sideNavigation"
        );
        oModel.refresh();
      },
    });
  }
);
