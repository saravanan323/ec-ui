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
  ],
  function (
    BaseController,
    JSONModel,
    AppConstants,
    Formatter,
    MessageBox,
    ErrorMessage,
    Fragment,
    MessageToast
  ) {
    "use strict";
    return BaseController.extend(
      "com.ecui.equipment_demands.EquipmentDemands",
      {
        formatter: Formatter,
        onInit: function () {
          this.oOwnerComponent = this.getOwnerComponent();
          this.oRouter = this.oOwnerComponent.getRouter();
          this.oModel = this.oOwnerComponent.getModel();
          this.oRouter
            .getRoute("equipment-demands")
            .attachMatched(this._onRouteMatched, this);
          this.oRouter
            .getRoute("edit-equipment-demand")
            .attachMatched(this._onRouteDetailMatched, this);
          this._tableId = this.byId("table_equipment_demand");
        },
        _onRouteMatched: function (oEvent) {
          this.onRouteFunctionalities(oEvent);

        },
        _onRouteDetailMatched: function (oEvent) {
          this.onRouteFunctionalities(oEvent);
        },
        getDemands: async function () {
          try {
            let selectionMdl = this.getView().getModel("equipmentDemandsMdl").getData();
            //this.table_SelectActivityType.setBusy(true);
            let demands_path = AppConstants.URL.demands_all;
            let response = await this.restMethodGet(demands_path);
            //let data = response?.d?.results;
            selectionMdl.utilization = response;
            // this.table_SelectActivityType.setBusy(false);
            this.getView().getModel("equipmentDemandsMdl").refresh(true);
          } catch (error) {
            //this.table_SelectActivityType.setBusy(false);
            this.errorHandling(ex);
          }
        },
        onRouteFunctionalities: function (oEvent) {
          this.errorPopoverParams();
          this.getView().setModel(new JSONModel(), "equipmentDemandsMdl");
          let advancedFilterObj = {
            demand_name: null,
            wbs_element_id: null,
            activity_id: null,
            cost_centre_id: null,
            demand_status: null,

            wbs_element_id_and_text: null,
            activity_type_id_and_text: null,
            cost_centre_id_and_text: null,
          }
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
          // this.formId = this.getView().byId(ids[formId]);
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
          var oItem = oEvent.getSource();
          var oBindingContext = oItem.getBindingContext("equipmentDemandsMdl");
          var oModel = this.getView().getModel("equipmentDemandsMdl");
          var rowObj = oBindingContext.getObject(),
            oNextUIState;
          var oSettingsModel = this.oOwnerComponent.getModel("settings");

          //Set Navigated Items
          oSettingsModel.setProperty(
            "/navigatedItem",
            oModel.getProperty("id", oBindingContext)
          );

          this.getOwnerComponent()
            .getHelper()
            .then(
              function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("edit-equipment-demand", {
                  layout: oNextUIState.layout,
                  id: rowObj.id,
                });
              }.bind(this)
            );
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
                
                // if (!isNaN(e.WBSElementInternalID)) {
                //   e.WBSElementInternalID = Math.abs(e.WBSElementInternalID);
                // }

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

        valueHelpActivityTypeClose: function (oEvent) {
          this.activityTypeDialog.then(function (oDialog) {
            oDialog.close();
          });
          this.table_SelectActivityType.removeSelections();
          let oModel = this.getView().getModel("selectionMdl").getData();
          oModel.activityType = [];
          this.getView().getModel("selectionMdl").refresh(true);
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
        //********** Activity Type Fragment End *******************/
        onSearch: async function (oEvent) {
          let that = this;
          try {
            let advancedSearchMdl = that.getView().getModel("advancedSearchMdl").getData();
            let selectionMdl = this.getView().getModel("equipmentDemandsMdl").getData();
            this.showLoading(true);
            let path = AppConstants.URL.demands_search;
            let response = await this.restMethodPost(path, advancedSearchMdl);
            selectionMdl.utilization = response;
            this.getView().getModel("equipmentDemandsMdl").refresh(true);
            this.showLoading(false);
          } catch (error) {
            that.showLoading(false);
            this.errorHandling(error);
          }
        },
        clearSearchFilter: function () {
          let advancedFilterObj = {
            demand_name: null,
            wbs_element_id: null,
            activity_id: null,
            cost_centre_id: null,
            demand_status: null,

            wbs_element_id_and_text: null,
            activity_type_id_and_text: null,
            cost_centre_id_and_text: null,
          }
          this.getView().setModel(new JSONModel(advancedFilterObj), "advancedSearchMdl");
          this.getView().getModel("advancedSearchMdl").refresh(true);
          this.onSearch();
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
      }
    );
  }
);
