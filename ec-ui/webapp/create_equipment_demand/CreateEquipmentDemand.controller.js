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
      "com.ecui.create_equipment_demand.CreateEquipmentDemand",
      {
        formatter: Formatter,
        onInit: function () {
          this.oOwnerComponent = this.getOwnerComponent();
          this.oRouter = this.oOwnerComponent.getRouter();
          this.oModel = this.oOwnerComponent.getModel();
          this.oRouter
            .getRoute("create-equipment-demand")
            .attachMatched(this._onRouteCreateMatched, this);
          this.oRouter
            .getRoute("equipment-demands")
            .attachMatched(this._onRouteMatched, this);
          this.oRouter
            .getRoute("edit-equipment-demand")
            .attachMatched(this._onRouteDetailMatched, this);
        },
        _onRouteMatched: function (oEvent) {
          //
        },
        _onRouteDetailMatched: function (oEvent) {
          //
          this._route = oEvent.getParameter("config").name;
          this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
          this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');

          this.errorPopoverParams();
          this._tablePropertyObject = this.byId("tablePropertyObject");
          this.getView().setModel(new JSONModel(), "demandMdl");
          this.getView().setModel(new JSONModel(), "selectionMdl");
          this.getView().setModel(new JSONModel(), "advancedFilterMdl");
          this.fetchEquipmentById(this._item);
        },
        _onRouteCreateMatched: function (oEvent) {
          this._route = oEvent.getParameter("config").name;
          this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
          this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');


          this.errorPopoverParams();
          this.genericTitle("Create Equipment Demand");
          this._tablePropertyObject = this.byId("tablePropertyObject");
          this.getView().setModel(new JSONModel(), "demandMdl");
          this.getView().setModel(new JSONModel(), "selectionMdl");
          this.getView().setModel(new JSONModel(), "advancedFilterMdl");
          this.setEmptyMdl();
        },
        errorPopoverParams: function (formId) {
          // let ids = {
          //   basic: "sf_cqd",
          //   attachment: "sf_attachment",
          //   property: "sf_PropHierarchy",
          // };
          this.formId = this.getView().byId("sf_cqd");
          this.pageId = this.getView().byId("page_cqd_id");
          this.popoverBtn = this.getView().byId("btn_cdq_error");

          //******Set Initially Empty Error Mdl******
          this.eMdl = this.getOwnerComponent().getModel("errors");
          ErrorMessage.removeValueState(this.formId, this.eMdl);
          this.eMdl.setData([]);
          this.errorData = [];
        },
        handleFullScreen: function () {
          var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
          this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
        },

        handleExitFullScreen: function () {
          var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
          this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
        },

        handleClose: function () {
          this.onNavBack();
        },
        setEmptyMdl: function (oEvent) {
          // let selectionMdl = this.getView().getModel("selectionMdl").getData();
          let emptyObj = {
            id: null,
            demand_id: null,
            demand_name: null,
            wbs_element_id: null,
            wbs_element_text: null,
            activity_type_id: null,
            activity_type_text: null,
            planned_effor: 0.0,
            cost_centre_id: null,
            cost_centre_text: null,
            date_alignment_id: null,
            demand_start_date: null,
            deman_end_date: null,
            demand_status: 1,
            demand_description: null,
            equipmentDemandAssignments: [
              {
                id: null,
                eq_demand_id: null,
                equipment_id: null,
                equipment_description: null,
                effort: 0.0
              }
            ],
            created_by: null,
            created_on: null,
            modified_by: null,
            modified_on: null,

            wbs_element_id_and_text: null,
            activity_type_id_and_text: null,
            cost_centre_id_and_text: null

          };
          this.getView().setModel(new JSONModel(emptyObj), "demandMdl");
          this.getView().getModel("selectionMdl").refresh(true);
        },
        onChangeDateAlignment: function (oEvent) {
          let demandMdl = this.getView().getModel("demandMdl").getData();
          if (demandMdl.date_alignment_id) {
            if (demandMdl.date_alignment_id == 2) {
              demandMdl.demand_start_date = null;
              demandMdl.deman_end_date = null;
            }
            else {
              demandMdl.demand_start_date = demandMdl.wbs_element_basic_start_date;
              demandMdl.deman_end_date = demandMdl.wbs_element_basic_end_date;
            }
          }
          else {
            demandMdl.demand_start_date = null;
            demandMdl.deman_end_date = null;
          }
        },

        fetchEquipmentById: async function (id) {
          try {
            this.showLoading(true);
            let path = AppConstants.URL.demands_by_id.replace("{id}", this._item);
            let response = await this.restMethodGet(path);
            let obj = {};
            if (response && response?.equipmentDemand) {
              response.equipmentDemand.wbs_element_id_and_text = stringCon(response?.equipmentDemand?.wbs_element_id, response?.equipmentDemand?.wbs_element_text);
              response.equipmentDemand.activity_type_id_and_text = stringCon(response?.equipmentDemand?.activity_type_id, response?.equipmentDemand?.activity_type_text);
              response.equipmentDemand.cost_centre_id_and_text = stringCon(response?.equipmentDemand?.cost_centre_id, response?.equipmentDemand?.cost_centre_text);

              response.equipmentDemand.demand_start_date = this.getDateWithFormat(response.equipmentDemand.demand_start_date);
              response.equipmentDemand.deman_end_date = this.getDateWithFormat(response.equipmentDemand.deman_end_date);
              function stringCon(id, name) {
                let id_with_name = null;
                if (id && name) {
                  id_with_name = id + " - " + name;
                }
                else if (id && !name) {
                  id_with_name = id;
                }
                else if (!id && name) {
                  id_with_name = name;
                }
                return id_with_name;
              }
              obj = response.equipmentDemand;
              obj.equipmentDemandAssignments = response.equipmentDemandAssignments ? response.equipmentDemandAssignments : [];
            }
            this.getView().setModel(new JSONModel(obj), "demandMdl");
            this.showLoading(false);
          } catch (error) {
            this.showLoading(false);
            this.errorHandling(error);
          }

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
        fetchEquipmentName: async function (oEvent) {
          try {
            let selectionMdl = this.getView().getModel("selectionMdl").getData();
            this.table_SelectEquipmentName.setBusy(true);
            let equipmentsPath = AppConstants.URL.equipments;
            let response = await this.restMethodGet(equipmentsPath);
            let data = response?.d?.results;
            if (data && Array.isArray(data)) {
              data.forEach(e => {
                if (!isNaN(e.TechnicalObject)) {
                  e.TechnicalObject = Math.abs(e.TechnicalObject);
                }
              });
            }
            selectionMdl.equipments = data;
            this.table_SelectEquipmentName.setBusy(false);
            this.getView().getModel("selectionMdl").refresh(true);
          } catch (error) {
            this.table_SelectEquipmentName.setBusy(false);
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
          let oModel = this.getView().getModel("demandMdl").getData(),
            selItems,
            selWBSElement;
          this.selWBS = this.getView().byId("table_SelectWBSElement");
          selItems = this.selWBS.getSelectedItems();
          if (selItems.length == 1) {
            selWBSElement = this.selWBS.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
            // oModel.wbs_element_id = selWBSElement?.WBSElementInternalID;
            oModel.wbs_element_id = selWBSElement?.WBSElementShortID;
            oModel.wbs_element_text = selWBSElement?.WBSDescription;
            oModel.wbs_element_basic_start_date = selWBSElement?.BasicStartDate;
            oModel.wbs_element_basic_end_date = selWBSElement?.BasicEndDate;
            oModel.wbs_element_id_and_text = selWBSElement?.WBSElementShortID + " - " + selWBSElement?.WBSDescription;
            this.getView().getModel("demandMdl").refresh(true);
            this.onChangeDateAlignment();
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
              filterArr.push(new sap.ui.model.Filter("WBSElementShortID", sap.ui.model.FilterOperator.EQ, value));
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
          let oModel = this.getView().getModel("demandMdl").getData(),
            selItems,
            selCostCenter;
          this.selCostCenter = this.getView().byId("table_SelectCostCenter");
          selItems = this.selCostCenter.getSelectedItems();
          if (selItems.length == 1) {
            selCostCenter = this.selCostCenter.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
            oModel.cost_centre_id = selCostCenter?.CostCenter;
            oModel.cost_centre_text = selCostCenter?.CostCenterName;
            oModel.cost_centre_description = selCostCenter?.CostCenterDescription;
            oModel.cost_centre_id_and_text = selCostCenter?.CostCenter + " - " + selCostCenter?.CostCenterName;
            this.getView().getModel("demandMdl").refresh(true);
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
          let oModel = this.getView().getModel("demandMdl").getData(),
            selItems,
            selActivityType;
          this.selActivityType = this.getView().byId("table_SelectActivityType");
          selItems = this.selActivityType.getSelectedItems();
          if (selItems.length == 1) {
            selActivityType = this.selActivityType.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
            oModel.activity_type_id = selActivityType?.CostCtrActivityType;
            oModel.activity_type_text = selActivityType?.CostCtrActivityTypeName;
            oModel.activity_type_description = selActivityType?.CostCtrActyTypeTxtSearchTerm;
            oModel.activity_type_id_and_text = selActivityType?.CostCtrActivityType + " - " + selActivityType?.CostCtrActivityTypeName;
            this.getView().getModel("demandMdl").refresh(true);
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
        //********** Equipment Name Fragment Start ******************/
        valueHelpDialogEquipmentName: function (oEvent) {
          let that = this;
          let oView = this.getView();
          if (!this.equipmentNameDialog) {
            this.equipmentNameDialog = new Promise(
              function (resolve, reject) {
                Fragment.load({
                  id: oView.getId(),
                  name: "com.ecui.create_equipment_demand.SelectEquipmentName", // Fragment name with namespace
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
          this.equipmentNameDialog.then(function (oDialog) {
            oView.addDependent(oDialog);
            let selectedIn = oEvent?.getSource()?.sId.split("-")?.pop();
            that.selectedIndex = selectedIn ? Number(selectedIn) : null;
            oDialog.open();
            that.table_SelectEquipmentName = oView.byId("table_SelectEquipmentName");
            that.table_SelectEquipmentName.removeSelections();
            that.fetchEquipmentName();
          });
        },

        valueHelpEquipmentNameClose: function (oEvent) {
          this.equipmentNameDialog.then(function (oDialog) {
            oDialog.close();
          });
          this.table_SelectEquipmentName.removeSelections();
          let oModel = this.getView().getModel("selectionMdl").getData();
          oModel.equipments = [];
          this.getView().getModel("selectionMdl").refresh(true);
        },
        selectedeEquipmentName: function (oEvent) {
          let that = this;
          let oModel = this.getView().getModel("demandMdl").getData(),
            selItems,
            selEquipmentName;
          this.selEquipmentName = this.getView().byId("table_SelectEquipmentName");
          selItems = this.selEquipmentName.getSelectedItems();
          if (selItems.length == 1) {
            selEquipmentName = this.selEquipmentName.getSelectedItems()?.[0]?.getBindingContext("selectionMdl")?.getObject();
            let selectedObj = that.selectedIndex > -1 ? oModel?.equipmentDemandAssignments?.[that.selectedIndex] : null;
            if (selectedObj) {
              let isExist = oModel.equipmentDemandAssignments.some(e => e.equipment_id == selEquipmentName?.TechnicalObject);
              if (!isExist) {
                selectedObj.equipment_id = selEquipmentName?.TechnicalObject;
                selectedObj.equipment_description = selEquipmentName?.TechnicalObjectDescription;
                this.valueHelpEquipmentNameClose();
              }
              else {
                MessageToast.show("This equipment is already exist. Please select different one!");
              }
            }
            this.getView().getModel("demandMdl").refresh(true);

          } else {
            MessageToast.show("Please select atleast one equipment!");
          }
        },
        advancedFilterEquipmentName: function () {
          let filterArr = [];
          let mdl = this.getView().getModel("advancedFilterMdl");
          let data = mdl.getData();
          this.table_SelectEquipmentName.removeSelections();
          for (let [key, value] of Object.entries(data)) {
            if (value) {
              value = value.trim();
              filterArr.push(new sap.ui.model.Filter("TechnicalObject", sap.ui.model.FilterOperator.EQ, value));
              filterArr.push(new sap.ui.model.Filter("TechnicalObjectDescription", sap.ui.model.FilterOperator.Contains, value));
            }

          }
          let binding = this.table_SelectEquipmentName.getBinding("items");
          // binding.filter(filters);
          if (filterArr.length > 0)
            binding.filter(new sap.ui.model.Filter({ filters: filterArr, and: false }));
          else
            binding.filter([]);
        },
        clearAllEquipmentNameFilters: function (oEvent) {
          this.getView().setModel(new JSONModel(), "advancedFilterMdl");
          this.getView().getModel("advancedFilterMdl").refresh(true);
          this.table_SelectEquipmentName.removeSelections();
          let binding = this.table_SelectEquipmentName.getBinding("items");
          binding.filter([]);
        },
        //********** Equipment Name Fragment End ******************/
        onPressConfirm: function (oEvent) {
          this.getOwnerComponent()
            .getHelper()
            .then(
              function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("equipment-utilization-details", {
                  layout: oNextUIState.layout,
                  id: 1,
                });
              }.bind(this)
            );
        },
        onPressCreate: function (oEvent) {
          let demandMdl = this.getView().getModel("demandMdl").getData();
          let obj = {
            id: null,
            eq_demand_id: null,
            equipment_id: null,
            equipment_description: null,
            effort: 0.0,
          };
          demandMdl.equipmentDemandAssignments.push(obj);
          this.getView().getModel("demandMdl").refresh(true);
        },
        onPressDelete: function (oEvent) {
          let selectedPaths =
            this._tablePropertyObject.getSelectedContextPaths();
          let demandMdl = this.getView().getModel("demandMdl").getData();
          if (selectedPaths && selectedPaths?.length > 0) {
            selectedPaths
              ?.sort()
              ?.reverse()
              ?.forEach((element) => {
                let selectedIndex = element.split("/").pop();
                demandMdl.equipmentDemandAssignments.splice(selectedIndex, 1);
              });
          } else {
            MessageToast.show("Please select atleast one row!");
          }
          this._tablePropertyObject.removeSelections();
          this.getView().getModel("demandMdl").refresh(true);
        },
        onPressSave: async function (oEvent) {
          let that = this;
          try {
            let demandMdl = that.getView().getModel("demandMdl").getData();
            // let check = this.leaveDetailsValidation();

            ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId); //Generic Error management model
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
              let request = {
                equipmentDemand: demandMdl
              }
              this.showLoading(true);
              let path = AppConstants.URL.demands_addEdit1;
              let response = await this.restMethodPost(path, request);
              let successMsg = demandMdl.id ? this.getResourceBundle("cob_updatedMsg") : that.getResourceBundle("cob_successMsg");
              if (response == 0) {
                MessageBox.information(successMsg, {
                  actions: [MessageBox.Action.CLOSE],
                  onClose: function (sAction) {
                      if (!demandMdl.id) {//Create
                        that.getView().setModel(new JSONModel(), "demandMdl");
                        that.getView().setModel(new JSONModel(), "selectionMdl");
                        that.getView().setModel(new JSONModel(), "advancedFilterMdl");
                        that.setEmptyMdl();
                      }
                      if (demandMdl.id) {//Update
                        that.getView().setModel(new JSONModel(), "demandMdl");
                        that.getView().setModel(new JSONModel(), "selectionMdl");
                        that.getView().setModel(new JSONModel(), "advancedFilterMdl");
                        that.fetchEquipmentById(that._item);
                      }
                      if (that._oDialog) {
                          that._oDialog.destroy();
                          that._oDialog = null;
                      }
                  }
              });
                that.getView().getModel("demandMdl").refresh();
              }
              this.showLoading(false);
            } else {
              this.errorHandling();
            }
          } catch (error) {
            that.showLoading(false);
            this.errorHandling(error);
          }
        }
      },
    );
  }
);
