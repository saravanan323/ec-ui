sap.ui.define(
    [
      "com/ecui/controller/BaseController",
      "sap/ui/model/json/JSONModel",
      "com/ecui/utils/AppConstants",
      "com/ecui/utils/Formatter",
      "com/ecui/utils/ErrorMessage",
      'sap/ui/model/Filter',
      "sap/ui/model/FilterOperator",
      'sap/m/p13n/Engine',
      'sap/m/p13n/SelectionController',
      'sap/m/p13n/SortController',
      'sap/m/p13n/GroupController',
      'sap/m/p13n/FilterController',
      'sap/m/p13n/MetadataHelper',
      'sap/m/table/ColumnWidthController',
      'sap/ui/core/library',
      'sap/ui/model/Sorter',
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
      Sorter
    ) {
      "use strict";
      return BaseController.extend("com.ecui.boq.ManageBoq", {
        formatter: Formatter,
        onInit: function () {
          this.oOwnerComponent = this.getOwnerComponent();
          this.oRouter = this.oOwnerComponent.getRouter();
          this.oModel = this.oOwnerComponent.getModel();
          this.oRouter.getRoute("manage-boq").attachMatched(this._onRouteMatched, this);
  
          [this._tableId, this.oFilterBar] = [this.byId("table_projects"), this.byId("filter_projects")];
  
          this.getView().setModel(new JSONModel(), 'advancedFilterMdl');
          let oModel = new JSONModel(
            [
              {
                "id": 101,
                "project": "EC Tower 1 E.00.001",
                "customer": "Blauer See Delikatessen",
                "project_manager": "Mohamed Ziyaul Haqi",
                "processing_status": "2",
                "project_type":" General Type",
                "planned_start": "11-01-2024",
                "planned_finish": "10-12-2025",
                "created_by": "Mohamed Ziyaul Haqi",
                "currency": "AED"
              },
              {
                "id": 102,
                "project": "Construction  Plan C.00.001",
                "customer": "Alfreds Futterkiste",
                "project_manager": "Bhupesh Akkineni",
                "processing_status": "1",
                "project_type":" Engineering Construction ",
                "planned_start": "11-02-2024",
                "planned_finish": "10-02-2025",
                "created_by": "Mohamed Ziyaul Haqi",
                "currency": "AED"
  
              },
              {
                "id": 103,
                "project": "Building Tower A E.23.003",
                "customer": "Centro comercial Moctezuma",
                "project_manager": "Maria Anders",
                "processing_status": "1",
                "project_type":"Internal Project",
                "planned_start": "11-10-2024",
                "planned_finish": "10-10-2025",
                "created_by": "Mohamed Ziyaul Haqi",
                "currency": "AED"
  
              },
              {
                "id": 104,
                "project": "EC Tower E E.03.001",
                "customer": "Chop-suey Chinese",
                "project_manager": "Francisco Chang",
                "processing_status": "2",
                "project_type":"Customer Project ",
                "planned_start": "11-05-2024",
                "planned_finish": "02-06-2025",
                "created_by": "Mohamed Ziyaul Haqi",
                "currency": "AED"
  
              }
            ]);
  
          this.getView().setModel(oModel, "projectsMdl");
  
          let dummyData = [
            { "key": 1, "text": "EC Tower 1 (E.01.001)" },
            { "key": 2, "text": "Super Structure (E.01.001.02)" },
            { "key": 3, "text": "Sub Structure (E.01.001.03)" },
            { "key": 4, "text": "Site Work (E.01.001.04)" },
            { "key": 5, "text": "Concrete Work (E.01.001.05)" },
            { "key": 6, "text": "Masonry Work (E.01.001.06)" },
            { "key": 7, "text": "Site Work (E.01.001.01)" },
            { "key": 8, "text": "Excavation (E.01.001.07)" },
            { "key": 9, "text": "Backfilling (E.01.001.08)" },
            { "key": 10, "text": "Piles (E.01.001.03.01)" },
            { "key": 11, "text": "Pile Caps (E.01.001.03.02)" },
            { "key": 12, "text": "Neck Columns (E.01.001.03.03)" },
            { "key": 13, "text": "Ground Beams (E.01.001.03.04)" }
          ]
          this.getView().setModel(new JSONModel(dummyData), "dummyMdl");
  
        },
        _onRouteMatched: function (oEvent) {
          this.errorPopoverParams();
          this.setColulmnsIntoModel();
          this._registerForP13n();
        },
        setColulmnsIntoModel: function () {
          let oSettingsModel = this.oOwnerComponent.getModel("settings");
          oSettingsModel.getData().columns = this._columns();
          oSettingsModel.refresh(true);
        },
  
        statusFormatter(value) {
          let data = [{ key: "1", text: "Released" },
          { key: "2", text: "Created" }
          ]
  
          return data.find(e => e.key == value)?.text;
        },
  
        onListItemPress: function (oEvent) {
          var oItem = oEvent.getParameter("listItem");
          var oBindingContext = oItem.getBindingContext("projectsMdl");
          var oModel = this.getView().getModel("projectsMdl");
          var rowObj = oBindingContext.getObject(), oNextUIState; // Need to dynamically with api
          var oSettingsModel = this.oOwnerComponent.getModel("settings");
          sap.m.MessageToast.show(rowObj.project);

  
          //Set Navigated Items
          // oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("id", oBindingContext));
  
          // this.getOwnerComponent().getHelper().then(function (oHelper) {
          //   oNextUIState = oHelper.getNextUIState(0);
          //   this.oRouter.navTo("project-details", { layout: oNextUIState.layout, id: 1, });
          // }.bind(this));
  
        },
  
        onPressNavCreate: function () {
          this.oRouter.navTo("create-project", { layout: "TwoColumnsMidExpanded" });
  
        },
  
        errorPopoverParams: function () {
  
          this.eMdl = this.getOwnerComponent().getModel("errors");
          ErrorMessage.removeValueState(null, this.eMdl);
  
          this.eMdl.setData([]);
          this.errorData = [];
        },
        async onValueHelpRequestProject(oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();
  
          // create dialog lazily
          this.oProjectDialog ??= await this.loadFragment({
            name: "com.ecui.projects.fragments.ProjectsDialog"
          });
  
          this.oProjectDialog.open();
  
        },
        onDialogProjectClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.byId("inputProject");
  
          if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
          }
  
          oInput.setValue(oSelectedItem.getTitle());
        },
        async onValueHelpRequestCustomer(oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();
  
          // create dialog lazily
          this.oCustomerDialog ??= await this.loadFragment({
            name: "com.ecui.projects.fragments.CustomersDialog"
          });
  
          this.oCustomerDialog.open();
  
        },
        onDialogCustomerClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.byId("inputCustomer");
  
          if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
          }
  
          oInput.setValue(oSelectedItem.getTitle());
        },
        async onValueHelpRequestProjectManager(oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();
  
          // create dialog lazily
          this.oProjectManagerDialog ??= await this.loadFragment({
            name: "com.ecui.projects.fragments.ProjectManagersDialog"
          });
  
          this.oProjectManagerDialog.open();
  
        },
        onDialogProjectManagerClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.byId("inputProjectManager");
  
          if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
          }
  
          oInput.setValue(oSelectedItem.getTitle());
        },
        async onValueHelpRequestWBS(oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();
  
          // create dialog lazily
          this.oWBSDialog ??= await this.loadFragment({
            name: "com.ecui.projects.fragments.WBSElementDialog"
          });
  
          this.oWBSDialog.open();
  
        },
        onDialogWBSClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem"),
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
        onSearch: async function (oEvent) {
          let oModel = this.getView().getModel('advancedFilterMdl');
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
                if (key.includes("planned_start") || key.includes("planned_finish")) {
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
          this._tableId.getBinding("items").filter(aFilter, "Application");
        },
        openPersoDialog: function (oEvt) {
          this._openPersoDialog(["Columns", "Sorter", "Groups"], oEvt.getSource());
        },
        _registerForP13n: function () {
          const oTable = this._tableId;
          let oColumns = JSON.parse(JSON.stringify(this._columns())); // deep copy
          let oReMapCols = oColumns.map(e => {
            return {
              key: e.id,
              label: e.label,
              path: e.property
            }
          });
          this.oMetadataHelper = new MetadataHelper(oReMapCols);
  
          Engine.getInstance().register(oTable, {
            helper: this.oMetadataHelper,
            controller: {
              Columns: new SelectionController({
                targetAggregation: "columns",
                control: oTable
              }),
              Sorter: new SortController({
                control: oTable
              }),
              Groups: new GroupController({
                control: oTable
              }),
              ColumnWidth: new ColumnWidthController({
                control: oTable
              }),
               Filter: new FilterController({
                 control: oTable
               })
            }
          });
  
          Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
        },
        _openPersoDialog: function (aPanels, oSource) {
          let oTable = this._tableId;
  
          Engine.getInstance().show(oTable, aPanels, {
            contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
            contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
            source: oSource || oTable
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
              case 'invoice_col':
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
  
            const colPath = 'projectsMdl>' + oProperty.path;
            return createCell(oColumnState, colPath);
          }.bind(this));
  
          // Rebind the table with the updated cell templates
          oTable.bindItems({
            templateShareable: false,
            path: 'projectsMdl>/',
            sorter: aSorter.concat(aGroups),
            template: new sap.m.ColumnListItem({
              type: "Navigation",
              cells: aCells
            })
          });
        },
        _columns() {
          return [
            {
              id: "project_col",
              label: 'Projects',
              property: "projects",
              width: "25",
              visible: true
            },
            {
              id: "customer_col",
              label: 'Project Manager ',
              property: "project_manager",
              width: "25",
              visible: true
            },
            {
              id: "prg_mngr_col",
              label: 'Processing Status',
              property: "processing_status",
              width: "25",
              visible: true
            },
            {
              id: "project_type_col",
              label: 'Project Type ',
              property: "project_type",
              width: "25",
              visible: true
            },
            {
              id: "company_col",
              label: 'Customer',
              property: "customer",
              width: "25",
              visible: true
            },
            {
              id: "process_status_col",
              label: 'Company',
              property: "company",
              width: "25",
              visible: true
            },
            {
              id: "planned_start_col",
              label: 'Planned Start',
              property: "planned_start",
              width: "25",
              visible: true
            },
            {
              id: "planned_finish_col",
              label: 'Planned Finish',
              property: "planned_finish",
              width: "25",
              visible: true
            },
            {
              id: "currency_col",
              label: 'Project Currency',
              property: "project_currency",
              width: "25",
              visible: true
            },
            {
              id: "created_by_col",
              label: 'Created By',
              property: "created_by_col",
              width: "25",
              visible: true
            }
          ];
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
  
          oState.Sorter.forEach((oSorter) => {
            const oCol = this._tableId.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
            if (oSorter.sorted !== false) {
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
        updateColumns(oState) {
          const oTable = this._tableId;
  
          oTable.getColumns().forEach((oColumn, iIndex) => {
            oColumn.setVisible(false);
            oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
            oColumn.setSortIndicator(coreLibrary.SortOrder.None);
            oColumn.data("grouped", false);
          });
  
          oState.Columns.forEach((oProp, iIndex) => {
            const oCol = oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
            oCol.setVisible(true);
  
            oTable.removeColumn(oCol);
            oTable.insertColumn(oCol, iIndex);
          });
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
          const oTable = this._tableId;
          const sAffectedProperty = oSortItem.getKey();
          const sSortOrder = oSortItem.getSortOrder();
  
          //Apply the state programatically on sorting through the column menu
          //1) Retrieve the current personalization state
          Engine.getInstance().retrieveState(oTable).then(function (oState) {
  
            //2) Modify the existing personalization state --> clear all sorters before
            oState.Sorter.forEach(function (oSorter) {
              oSorter.sorted = false;
            });
  
            if (sSortOrder !== coreLibrary.SortOrder.None) {
              oState.Sorter.push({
                key: sAffectedProperty,
                descending: sSortOrder === coreLibrary.SortOrder.Descending
              });
            }
  
            //3) Apply the modified personalization state to persist it in the VariantManagement
            Engine.getInstance().applyState(oTable, oState);
          });
        },
  
        onGroup: function (oEvt) {
          const oGroupItem = oEvt.getParameter("item");
          const oTable = this._tableId;
          const sAffectedProperty = oGroupItem.getKey();
  
          //1) Retrieve the current personalization state
          Engine.getInstance().retrieveState(oTable).then(function (oState) {
  
            //2) Modify the existing personalization state --> clear all groupings before
            oState.Groups.forEach(function (oSorter) {
              oSorter.grouped = false;
            });
  
            if (oGroupItem.getGrouped()) {
              oState.Groups.push({
                key: sAffectedProperty
              });
            }
  
            //3) Apply the modified personalization state to persist it in the VariantManagement
            Engine.getInstance().applyState(oTable, oState);
          });
        },
  
        onClear() {
          this.getView().setModel(new JSONModel(), 'advancedFilterMdl');
        },
        onExit: function () {
          this.oRouter.getRoute("manage-projects").detachPatternMatched(this._onRouteMatched, this);
        }
      }
      );
    },
  
  );
  